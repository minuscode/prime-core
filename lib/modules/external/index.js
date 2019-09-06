"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_api_1 = require("@accounts/graphql-api");
const server_1 = __importDefault(require("@accounts/server"));
const core_1 = require("@graphql-modules/core");
const field_1 = require("@primecms/field");
const apollo_server_core_1 = require("apollo-server-core");
const debug_1 = __importDefault(require("debug"));
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const createResolversMap_1 = require("type-graphql/dist/utils/createResolversMap");
const typedi_1 = __importDefault(require("typedi"));
const typeorm_1 = require("typeorm");
const Document_1 = require("../../entities/Document");
const Schema_1 = require("../../entities/Schema");
const DocumentTransformer_1 = require("../../utils/DocumentTransformer");
const createAllDocumentResolver_1 = require("./resolvers/createAllDocumentResolver");
const createDocumentCreateResolver_1 = require("./resolvers/createDocumentCreateResolver");
const createDocumentRemoveResolver_1 = require("./resolvers/createDocumentRemoveResolver");
const createDocumentResolver_1 = require("./resolvers/createDocumentResolver");
const createDocumentUpdateResolver_1 = require("./resolvers/createDocumentUpdateResolver");
const documentUnionResolver_1 = require("./resolvers/documentUnionResolver");
const createSchemaConnectionArgs_1 = require("./types/createSchemaConnectionArgs");
const createSchemaConnectionType_1 = require("./types/createSchemaConnectionType");
const createSchemaInputType_1 = require("./types/createSchemaInputType");
const createSchemaType_1 = require("./types/createSchemaType");
const DocumentRemove_1 = require("./types/DocumentRemove");
const uniqueTypeNames_1 = require("./utils/uniqueTypeNames");
exports.log = debug_1.default('prime:graphql');
exports.getDefaultLocale = () => 'en';
exports.createExternal = (connection) => __awaiter(this, void 0, void 0, function* () {
    exports.log('building schema');
    uniqueTypeNames_1.resetTypeNames();
    const documentTransformer = new DocumentTransformer_1.DocumentTransformer();
    const schemas = yield typeorm_1.getRepository(Schema_1.Schema).find();
    const types = new Map();
    const queries = {};
    const mutations = {};
    const resolvers = {};
    for (const schema of schemas) {
        if (schema.variant === Schema_1.SchemaVariant.Template) {
            continue;
        }
        if (schema.variant === Schema_1.SchemaVariant.Slice) {
            // maybe do something special?
            schema.name = uniqueTypeNames_1.uniqueTypeName(lodash_1.upperFirst(lodash_1.camelCase(schema.name)));
        }
        else {
            schema.name = uniqueTypeNames_1.uniqueTypeName(lodash_1.upperFirst(lodash_1.camelCase(schema.name)));
        }
        schema.fields = yield documentTransformer.getFields(schema);
        const { name, fields } = schema;
        const payload = { schema, schemas, fields, name, resolvers, types, documentTransformer };
        const SchemaTypeConfig = yield createSchemaType_1.createSchemaType(payload);
        const { CREATE, UPDATE } = field_1.PrimeFieldOperation;
        const SchemaType = SchemaTypeConfig.type;
        types.set(name, SchemaTypeConfig);
        const args = yield createSchemaConnectionArgs_1.createSchemaConnectionArgs(payload);
        const connectionType = yield createSchemaConnectionType_1.createSchemaConnectionType(payload, SchemaType);
        const createType = yield createSchemaInputType_1.createSchemaInputType(payload, SchemaType, CREATE);
        const updateType = yield createSchemaInputType_1.createSchemaInputType(payload, SchemaType, UPDATE);
        if (schema.variant === Schema_1.SchemaVariant.Default) {
            queries[name] = SchemaTypeConfig;
            if (!schema.settings.single) {
                queries[`all${name}`] = {
                    args,
                    type: connectionType,
                };
            }
            if (schema.settings.mutations) {
                mutations[`create${name}`] = createType;
                mutations[`update${name}`] = updateType;
                mutations[`remove${name}`] = DocumentRemove_1.DocumentRemove;
            }
        }
        types.set(`create${name}`, createType);
        types.set(`update${name}`, updateType);
    }
    for (const [, type] of types) {
        const { asyncResolve } = type || { asyncResolve: null };
        if (asyncResolve) {
            yield asyncResolve();
        }
    }
    for (const schema of schemas) {
        if (!types.has(schema.name) || schema.variant !== Schema_1.SchemaVariant.Default) {
            continue;
        }
        const { name, fields } = schema;
        const payload = { schema, schemas, fields, name, resolvers, types, documentTransformer };
        resolvers[name] = yield createDocumentResolver_1.createDocumentResolver(payload);
        resolvers[`all${name}`] = yield createAllDocumentResolver_1.createAllDocumentResolver(payload);
        resolvers[`create${name}`] = yield createDocumentCreateResolver_1.createDocumentCreateResolver(payload);
        resolvers[`update${name}`] = yield createDocumentUpdateResolver_1.createDocumentUpdateResolver(payload);
        resolvers[`remove${name}`] = yield createDocumentRemoveResolver_1.createDocumentRemoveResolver(payload);
        queries[name].resolve = resolvers[name];
        if (queries[`all${name}`]) {
            queries[`all${name}`].resolve = resolvers[`all${name}`];
        }
        if (mutations[`create${name}`]) {
            mutations[`create${name}`].resolve = resolvers[`create${name}`];
        }
        if (mutations[`update${name}`]) {
            mutations[`update${name}`].resolve = resolvers[`update${name}`];
        }
        if (mutations[`remove${name}`]) {
            mutations[`remove${name}`].resolve = resolvers[`remove${name}`];
        }
        const SchemaType = types.get(schema.name).type;
        if (!SchemaType || Object.keys(lodash_1.omit(SchemaType.getFields(), ['id', '_meta'])).length === 0) {
            delete queries[name];
            delete queries[`all${name}`];
            delete mutations[`create${name}`];
            delete mutations[`update${name}`];
            delete mutations[`remove${name}`];
            types.delete(name);
        }
    }
    const primeDocumentNotFoundTypeName = uniqueTypeNames_1.uniqueTypeName('Prime_Document_NotFound');
    const PrimeDocumentNotFound = new graphql_1.GraphQLObjectType({
        name: primeDocumentNotFoundTypeName,
        fields: { message: { type: graphql_1.GraphQLString } },
    });
    types.set(primeDocumentNotFoundTypeName, { type: PrimeDocumentNotFound });
    const primeDocumentTypeName = uniqueTypeNames_1.uniqueTypeName('Prime_Document');
    queries[primeDocumentTypeName] = {
        args: {
            id: { type: graphql_1.GraphQLString },
            locale: { type: graphql_1.GraphQLString },
        },
        type: new graphql_1.GraphQLUnionType({
            name: primeDocumentTypeName,
            types: [
                ...Array.from(types.values())
                    .filter(({ variant, operation }) => variant === Schema_1.SchemaVariant.Default && operation === field_1.PrimeFieldOperation.READ)
                    .map(typeConfig => typeConfig.type),
                PrimeDocumentNotFound,
            ],
        }),
        resolve: documentUnionResolver_1.documentUnionResolver(resolvers),
    };
    const hasMutations = Object.keys(mutations).length;
    const graphqlSchema = new graphql_1.GraphQLSchema(Object.assign({ query: new graphql_1.GraphQLObjectType({
            name: 'Query',
            fields: queries,
        }) }, (hasMutations && {
        mutation: new graphql_1.GraphQLObjectType({
            name: 'Mutation',
            fields: mutations,
        }),
    })));
    const resolverMap = createResolversMap_1.createResolversMap(graphqlSchema);
    const unionResolvers = Object.entries(resolverMap).reduce((acc, item) => {
        const [key, value] = item;
        if (key && value.__resolveType) {
            acc[key] = value;
        }
        return acc;
    }, {});
    const PRIME_TOKEN = 'x-prime-token';
    const PRIME_PREVIEW = 'x-prime-preview';
    return new core_1.GraphQLModule({
        name: 'prime-graphql',
        extraSchemas: [graphqlSchema],
        resolvers: unionResolvers,
        context({ req }) {
            return __awaiter(this, void 0, void 0, function* () {
                const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                exports.log('requestId', requestId);
                const container = typedi_1.default.of(requestId);
                const ctx = {
                    requestId,
                    container,
                };
                if (req.headers[PRIME_TOKEN]) {
                    const server = graphql_api_1.AccountsModule.injector.get(server_1.default);
                    ctx.userSession = yield server.findSessionByAccessToken(req.headers[PRIME_TOKEN]);
                    if (!ctx.userSession) {
                        throw new apollo_server_core_1.AuthenticationError('Token not valid');
                    }
                    if (req.headers[PRIME_PREVIEW]) {
                        ctx.preview = yield typeorm_1.getRepository(Document_1.Document).findOneOrFail(req.headers[PRIME_PREVIEW]);
                    }
                }
                container.set('context', ctx);
                return ctx;
            });
        },
    });
});
//# sourceMappingURL=index.js.map