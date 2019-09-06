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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const lodash_1 = require("lodash");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const Document_1 = require("../../../entities/Document");
const DocumentTransformer_1 = require("../../../utils/DocumentTransformer");
const getUniqueHashId_1 = require("../../../utils/getUniqueHashId");
const processWebhooks_1 = require("../../../utils/processWebhooks");
const DocumentRepository_1 = require("../repositories/DocumentRepository");
const SchemaFieldRepository_1 = require("../repositories/SchemaFieldRepository");
const SchemaRepository_1 = require("../repositories/SchemaRepository");
const createConnectionType_1 = require("../types/createConnectionType");
const DocumentFilterInput_1 = require("../types/DocumentFilterInput");
const DocumentInput_1 = require("../types/DocumentInput");
const DocumentVersion_1 = require("../types/DocumentVersion");
const Authorized_1 = require("../utils/Authorized");
const ExtendedConnection_1 = require("../utils/ExtendedConnection");
const DocumentConnection = createConnectionType_1.createConnectionType(Document_1.Document);
var DocumentSort;
(function (DocumentSort) {
    DocumentSort[DocumentSort["updatedAt_ASC"] = 0] = "updatedAt_ASC";
    DocumentSort[DocumentSort["updatedAt_DESC"] = 1] = "updatedAt_DESC";
    DocumentSort[DocumentSort["createdAt_ASC"] = 2] = "createdAt_ASC";
    DocumentSort[DocumentSort["createdAt_DESC"] = 3] = "createdAt_DESC";
    DocumentSort[DocumentSort["userId_ASC"] = 4] = "userId_ASC";
    DocumentSort[DocumentSort["userId_DESC"] = 5] = "userId_DESC";
    DocumentSort[DocumentSort["documentId_ASC"] = 6] = "documentId_ASC";
    DocumentSort[DocumentSort["documentId_DESC"] = 7] = "documentId_DESC";
    DocumentSort[DocumentSort["schemaId_ASC"] = 8] = "schemaId_ASC";
    DocumentSort[DocumentSort["schemaId_DESC"] = 9] = "schemaId_DESC";
})(DocumentSort || (DocumentSort = {}));
const sortOptions = orders => orders.map(orderBy => {
    const [sort, order] = orderBy.split('_');
    return { sort, order };
});
type_graphql_1.registerEnumType(DocumentSort, { name: 'DocumentConnectionSort' });
let DocumentResolver = class DocumentResolver {
    constructor() {
        this.documentTransformer = new DocumentTransformer_1.DocumentTransformer();
    }
    Document(id, locale, releaseId) {
        const key = id.length === 36 ? 'id' : 'documentId';
        return this.documentRepository.loadOneByDocumentId(id, key, {
            releaseId,
            locale,
        });
    }
    allDocuments(sorts, filters, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new ExtendedConnection_1.ExtendedConnection(args, {
                where: (qb, counter = false) => {
                    qb.andWhere('Document.deletedAt IS NULL');
                    const subquery = qb
                        .subQuery()
                        .select('id')
                        .from(Document_1.Document, 'd')
                        .where('d.documentId = Document.documentId')
                        .andWhere('d.deletedAt IS NULL');
                    const filterWithName = (name, filterArr) => new typeorm_1.Brackets(builder => {
                        filterArr.map((filter, i) => {
                            builder.orWhere(new typeorm_1.Brackets(sq => {
                                Object.entries(filter).map(([key, value]) => {
                                    if (value === null) {
                                        sq.andWhere(`${name}.${key} IS NULL`);
                                    }
                                    else {
                                        sq.andWhere(`${name}.${key} = :${key}_${i}`, { [`${key}_${i}`]: value });
                                    }
                                });
                            }));
                        });
                    });
                    const filtered = (filters || []).map(filter => lodash_1.pickBy(filter, (value, key) => {
                        return key === 'releaseId' || lodash_1.identity(value);
                    }));
                    if (filtered.length > 0 && Object.keys(filtered[0]).length > 0) {
                        subquery.andWhere(filterWithName('d', filtered));
                        qb.andWhere(filterWithName('Document', filtered));
                    }
                    subquery.orderBy({ 'd.createdAt': 'DESC' }).limit(1);
                    if (!counter) {
                        qb.having(`Document.id = ${subquery.getQuery()}`);
                        qb.groupBy('Document.id');
                    }
                    return qb;
                },
                repository: this.documentRepository,
                sortOptions: sortOptions(sorts),
            });
            result.totalCountField = 'documentId';
            return result;
        });
    }
    createDocument(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemaRepository.findOneOrFail(input.schemaId, { cache: 1000 });
            const document = yield this.documentRepository.insert(Object.assign({}, input, { data: yield this.documentTransformer.transformInput(input.data, schema), userId: context.user.id, documentId: input.documentId || (yield getUniqueHashId_1.getUniqueHashId(this.documentRepository, 'documentId')) }));
            const doc = document.identifiers.pop() || { id: null };
            return this.documentRepository.findOneOrFail(doc.id);
        });
    }
    updateDocument(id, data, locale, releaseId, context //
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOneOrFail({ id, deletedAt: typeorm_1.IsNull() });
            const schema = yield this.schemaRepository.findOneOrFail(doc.schemaId, { cache: 1000 });
            delete doc.id;
            delete doc.publishedAt;
            delete doc.createdAt;
            delete doc.updatedAt;
            const document = yield this.documentRepository.insert(Object.assign({}, doc, (data && { data: yield this.documentTransformer.transformInput(data, schema) }), (releaseId && { releaseId }), { userId: context.user.id, documentId: doc.documentId || (yield getUniqueHashId_1.getUniqueHashId(this.documentRepository, 'documentId')) }));
            const res = document.identifiers.pop() || { id: null };
            return this.documentRepository.findOneOrFail(res.id);
        });
    }
    removeDocument(id, locale, releaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.Document(id, locale, releaseId);
            yield this.documentRepository.update(Object.assign({ documentId: document.documentId }, (locale && { locale }), (releaseId && { releaseId })), {
                deletedAt: new Date(),
            });
            processWebhooks_1.processWebhooks('document.removed', { document });
            // @todo update algolia
            return true;
        });
    }
    publishDocument(id, context //
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOneOrFail({ id, deletedAt: typeorm_1.IsNull() });
            const publishedId = yield this.documentRepository.publish(doc, context.user.id);
            const document = yield this.Document(publishedId);
            processWebhooks_1.processWebhooks('document.published', { document });
            // @todo update algolia
            return document;
        });
    }
    unpublishDocument(id, context //
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.documentRepository.findOneOrFail({ id, deletedAt: typeorm_1.IsNull() });
            this.documentRepository.update({
                documentId: doc.documentId,
                locale: doc.locale,
            }, {
                publishedAt: null,
            });
            // @todo update algolia
            const document = yield this.Document(id);
            processWebhooks_1.processWebhooks('document.unpublished', { document });
            return document;
        });
    }
    data(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = yield this.schemaRepository.loadOne(document.schemaId);
            return this.documentTransformer.transformOutput(document, schema);
        });
    }
    versions(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.documentRepository.find({
                where: { documentId: document.documentId, deletedAt: typeorm_1.IsNull() },
                order: { updatedAt: 'DESC' },
            });
        });
    }
    published(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.documentRepository.loadOneByDocumentId(document.documentId, 'documentId', {
                publishedAt: typeorm_1.Raw(alias => `${alias} IS NOT NULL`),
            });
        });
    }
    primary(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const qb = this.schemaFieldRepository.createQueryBuilder();
            qb.cache(1000);
            let field = yield this.schemaFieldRepository
                .getLoader(qb, (b, keys) => b.where({ schemaId: typeorm_1.In(keys) }).andWhere('SchemaField.primary = TRUE'), 'schemaId')
                .load(document.schemaId);
            if (field) {
                const path = [field.id];
                if (field.parentFieldId) {
                    field = yield this.schemaFieldRepository.loadOne(field.parentFieldId);
                    if (field) {
                        path.push(field.id);
                    }
                }
                let value = lodash_1.get(document.data, path.reverse().join('.'));
                if (field && field.primeField) {
                    value = field.primeField.processOutput(value);
                }
                return value;
            }
            return null;
        });
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(SchemaRepository_1.SchemaRepository),
    __metadata("design:type", SchemaRepository_1.SchemaRepository)
], DocumentResolver.prototype, "schemaRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(SchemaFieldRepository_1.SchemaFieldRepository),
    __metadata("design:type", SchemaFieldRepository_1.SchemaFieldRepository)
], DocumentResolver.prototype, "schemaFieldRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(DocumentRepository_1.DocumentRepository),
    __metadata("design:type", DocumentRepository_1.DocumentRepository)
], DocumentResolver.prototype, "documentRepository", void 0);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => Document_1.Document, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID, { description: 'Can be either uuid or documentId' })),
    __param(1, type_graphql_1.Arg('locale', { nullable: true })),
    __param(2, type_graphql_1.Arg('releaseId', type => type_graphql_1.ID, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DocumentResolver.prototype, "Document", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => DocumentConnection),
    __param(0, type_graphql_1.Arg('sort', type => [DocumentSort], { defaultValue: 1, nullable: true })),
    __param(1, type_graphql_1.Arg('filter', type => [DocumentFilterInput_1.DocumentFilterInput], { nullable: true })),
    __param(2, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array, createConnectionType_1.ConnectionArgs]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "allDocuments", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Document_1.Document),
    __param(0, type_graphql_1.Arg('input', type => DocumentInput_1.DocumentInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DocumentInput_1.DocumentInput, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "createDocument", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Document_1.Document),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('data', type => graphql_type_json_1.default, { nullable: true })),
    __param(2, type_graphql_1.Arg('locale', { nullable: true })),
    __param(3, type_graphql_1.Arg('releaseId', type => type_graphql_1.ID, { nullable: true })),
    __param(4, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof graphql_type_json_1.default !== "undefined" && graphql_type_json_1.default) === "function" ? _a : Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "updateDocument", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('locale', { nullable: true })),
    __param(2, type_graphql_1.Arg('releaseId', type => type_graphql_1.ID, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "removeDocument", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Document_1.Document),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "publishDocument", null);
__decorate([
    type_graphql_1.Mutation(returns => Document_1.Document),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "unpublishDocument", null);
__decorate([
    type_graphql_1.FieldResolver(returns => graphql_type_json_1.default, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.Document]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "data", null);
__decorate([
    type_graphql_1.FieldResolver(returns => [DocumentVersion_1.DocumentVersion], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.Document]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "versions", null);
__decorate([
    type_graphql_1.FieldResolver(returns => Document_1.Document, {
        nullable: true,
        description: 'Get published version of the document (if any)',
    }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.Document]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "published", null);
__decorate([
    type_graphql_1.FieldResolver(returns => graphql_type_json_1.default, {
        nullable: true,
    }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Document_1.Document]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "primary", null);
DocumentResolver = __decorate([
    type_graphql_1.Resolver(of => Document_1.Document)
], DocumentResolver);
exports.DocumentResolver = DocumentResolver;
//# sourceMappingURL=DocumentResolver.js.map