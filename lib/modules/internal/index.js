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
const core_1 = require("@graphql-modules/core");
const debug_1 = __importDefault(require("debug"));
const lodash_1 = require("lodash");
const type_graphql_1 = require("type-graphql");
const typedi_1 = __importDefault(require("typedi"));
const pubSub_1 = require("../../utils/pubSub");
const accounts_1 = require("../accounts");
const AccessTokenResolver_1 = require("./resolvers/AccessTokenResolver");
const DocumentResolver_1 = require("./resolvers/DocumentResolver");
const PrimeResolver_1 = require("./resolvers/PrimeResolver");
const ReleaseResolver_1 = require("./resolvers/ReleaseResolver");
const SchemaResolver_1 = require("./resolvers/SchemaResolver");
const UserResolver_1 = require("./resolvers/UserResolver");
const WebhookResolver_1 = require("./resolvers/WebhookResolver");
const abilityErrorMiddleware_1 = require("./utils/abilityErrorMiddleware");
const createAbility_1 = require("./utils/createAbility");
const isAuthenticated_1 = require("./utils/isAuthenticated");
const noEnumsOrInheritedModels_1 = require("./utils/noEnumsOrInheritedModels");
const noUndefinedTypeOf_1 = require("./utils/noUndefinedTypeOf");
exports.log = debug_1.default('prime:core');
exports.createInternal = (connection) => __awaiter(this, void 0, void 0, function* () {
    exports.log('building schema');
    const accounts = yield accounts_1.createAccounts(connection);
    const schema = yield type_graphql_1.buildTypeDefsAndResolvers({
        resolvers: [
            AccessTokenResolver_1.AccessTokenResolver,
            DocumentResolver_1.DocumentResolver,
            PrimeResolver_1.PrimeResolver,
            ReleaseResolver_1.ReleaseResolver,
            SchemaResolver_1.SchemaResolver,
            UserResolver_1.UserResolver,
            WebhookResolver_1.WebhookResolver,
        ],
        pubSub: pubSub_1.pubSub,
        globalMiddlewares: [abilityErrorMiddleware_1.abilityForbiddenMiddleware],
        container: ({ context }) => context.container,
    });
    return new core_1.GraphQLModule({
        name: 'prime-core',
        imports: [accounts],
        typeDefs: () => [schema.typeDefs],
        resolvers: () => lodash_1.mapValues(lodash_1.omitBy(schema.resolvers, noEnumsOrInheritedModels_1.noEnumsOrInheritedModels), noUndefinedTypeOf_1.noUndefinedTypeOf),
        context(session, currentContext) {
            return __awaiter(this, void 0, void 0, function* () {
                const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                const container = typedi_1.default.of(requestId);
                const ctx = {
                    requestId,
                    container,
                    ability: createAbility_1.createAbility(currentContext),
                };
                container.set('context', ctx);
                return ctx;
            });
        },
        resolversComposition: {
            'Mutation.createUser': [isAuthenticated_1.isAuthenticated()],
        },
        configRequired: false,
    });
});
//# sourceMappingURL=index.js.map