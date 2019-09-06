"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const typeorm_cursor_connection_1 = require("typeorm-cursor-connection");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const Document_1 = require("../../../entities/Document");
const Schema_1 = require("../../../entities/Schema");
const processWebhooks_1 = require("../../../utils/processWebhooks");
const pubSub_1 = require("../../../utils/pubSub");
const DocumentRepository_1 = require("../repositories/DocumentRepository");
const SchemaRepository_1 = require("../repositories/SchemaRepository");
const createConnectionType_1 = require("../types/createConnectionType");
const SchemaFieldGroup_1 = require("../types/SchemaFieldGroup");
const SchemaInput_1 = require("../types/SchemaInput");
const Authorized_1 = require("../utils/Authorized");
const getSchemaFields_1 = require("../utils/getSchemaFields");
const setSchemaFields_1 = require("../utils/setSchemaFields");
const SchemaConnection = createConnectionType_1.createConnectionType(Schema_1.Schema);
const parseEnum = (Enum, value) => Enum[value];
let SchemaResolver = class SchemaResolver {
    Schema(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            if (name) {
                res = yield this.schemaRepository.findOne({
                    name: typeorm_1.Raw(alias => `lower(${alias}) = lower('${name.replace(/[\W_]+/g, '')}')`),
                });
            }
            else {
                res = yield this.schemaRepository.loadOne(id);
            }
            if (res) {
                res.variant = parseEnum(Schema_1.SchemaVariant, res.variant);
            }
            return res;
        });
    }
    allSchemas(args //
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield new typeorm_cursor_connection_1.EntityConnection(args, {
                repository: this.schemaRepository,
                sortOptions: [{ sort: 'title', order: 'ASC' }],
            });
            return Object.assign({}, connection, { edges: (yield connection.edges).map(edge => (Object.assign({}, edge, { node: Object.assign({}, edge.node, { variant: parseEnum(Schema_1.SchemaVariant, edge.node.variant) }) }))) });
        });
    }
    createSchema(input) {
        return __awaiter(this, void 0, void 0, function* () {
            input.variant = Schema_1.SchemaVariant[input.variant];
            const schema = this.schemaRepository.create(input);
            if (schema.variant === Schema_1.SchemaVariant.Default) {
                schema.groups = ['Main'];
            }
            else {
                schema.groups = [schema.name];
            }
            yield this.schemaRepository.save(schema);
            if (input.fields) {
                yield setSchemaFields_1.setSchemaFields(schema.id, input.fields);
            }
            pubSub_1.pubSub.publish('REBUILD_EXTERNAL', schema);
            schema.variant = parseEnum(Schema_1.SchemaVariant, schema.variant);
            processWebhooks_1.processWebhooks('schema.created', { schema });
            return schema;
        });
    }
    updateSchema(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input.fields) {
                yield setSchemaFields_1.setSchemaFields(id, input.fields);
            }
            const schema = yield this.schemaRepository.findOneOrFail(id);
            input.variant = parseEnum(Schema_1.SchemaVariant, input.variant);
            yield this.schemaRepository.merge(schema, input);
            schema.settings = lodash_1.defaultsDeep(input.settings, schema.settings);
            yield this.schemaRepository.save(schema);
            schema.variant = parseEnum(Schema_1.SchemaVariant, schema.variant);
            pubSub_1.pubSub.publish('REBUILD_EXTERNAL', schema);
            processWebhooks_1.processWebhooks('schema.updated', { schema });
            return schema;
        });
    }
    removeSchema(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemaRepository.findOneOrFail(id);
            yield this.documentRepository.update({ schemaId: id }, {
                deletedAt: new Date(),
            });
            yield this.schemaRepository.remove(schema);
            pubSub_1.pubSub.publish('REBUILD_EXTERNAL', schema);
            processWebhooks_1.processWebhooks('schema.removed', { schema });
            return true;
        });
    }
    schemaNameAvailable(name, variant) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.schemaRepository.count({
                where: Object.assign({}, (variant && { variant: parseEnum(Schema_1.SchemaVariant, variant) }), { name: typeorm_1.Raw(alias => `lower(${alias}) = lower('${name.replace(/[\W_]+/g, '')}')`) }),
            });
            return count === 0;
        });
    }
    fields(schema) {
        return getSchemaFields_1.getSchemaFields(schema.id);
    }
    documentCount(schema) {
        const qb = typeorm_1.getRepository(Document_1.Document).createQueryBuilder();
        const sq = qb
            .subQuery()
            .select('id')
            .from(Document_1.Document, 'd')
            .andWhere('d.documentId = Document.documentId')
            .limit(1);
        qb.andWhere('Document.schemaId = :schemaId', { schemaId: schema.id });
        qb.andWhere(`id = ${sq.getQuery()}`);
        return qb.getCount();
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(SchemaRepository_1.SchemaRepository),
    __metadata("design:type", SchemaRepository_1.SchemaRepository)
], SchemaResolver.prototype, "schemaRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(DocumentRepository_1.DocumentRepository),
    __metadata("design:type", DocumentRepository_1.DocumentRepository)
], SchemaResolver.prototype, "documentRepository", void 0);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => Schema_1.Schema, { nullable: true, description: 'Get Schema by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID, { nullable: true })),
    __param(1, type_graphql_1.Arg('name', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "Schema", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => SchemaConnection),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createConnectionType_1.ConnectionArgs //
    ]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "allSchemas", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Schema_1.Schema),
    __param(0, type_graphql_1.Arg('input', type => SchemaInput_1.SchemaInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "createSchema", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Schema_1.Schema),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input', type => SchemaInput_1.SchemaInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "updateSchema", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "removeSchema", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => Boolean),
    __param(0, type_graphql_1.Arg('name', type => String)),
    __param(1, type_graphql_1.Arg('variant', type => Schema_1.SchemaVariant, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "schemaNameAvailable", null);
__decorate([
    type_graphql_1.FieldResolver(returns => [SchemaFieldGroup_1.SchemaFieldGroup], {
        description: 'Get Schema Fields',
        nullable: true,
    }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Schema_1.Schema]),
    __metadata("design:returntype", Promise)
], SchemaResolver.prototype, "fields", null);
__decorate([
    type_graphql_1.FieldResolver(returns => Number, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Schema_1.Schema]),
    __metadata("design:returntype", void 0)
], SchemaResolver.prototype, "documentCount", null);
SchemaResolver = __decorate([
    type_graphql_1.Resolver(of => Schema_1.Schema)
], SchemaResolver);
exports.SchemaResolver = SchemaResolver;
//# sourceMappingURL=SchemaResolver.js.map