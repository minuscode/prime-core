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
const type_graphql_1 = require("type-graphql");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const Document_1 = require("../../../entities/Document");
const Release_1 = require("../../../entities/Release");
const User_1 = require("../../../entities/User");
const processWebhooks_1 = require("../../../utils/processWebhooks");
const DocumentRepository_1 = require("../repositories/DocumentRepository");
const ReleaseRepository_1 = require("../repositories/ReleaseRepository");
const createConnectionType_1 = require("../types/createConnectionType");
const ReleaseInput_1 = require("../types/ReleaseInput");
const Authorized_1 = require("../utils/Authorized");
const ExtendedConnection_1 = require("../utils/ExtendedConnection");
const DocumentResolver_1 = require("./DocumentResolver");
const ReleaseConnection = createConnectionType_1.createConnectionType(Release_1.Release);
let ReleaseResolver = class ReleaseResolver {
    Release(id //
    ) {
        return this.releaseRepository.loadOne(id);
    }
    allReleases(args //
    ) {
        return new ExtendedConnection_1.ExtendedConnection(args, {
            repository: this.releaseRepository,
            sortOptions: [{ sort: 'createdAt', order: 'DESC' }],
        });
    }
    createRelease(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const release = this.releaseRepository.create(input);
            yield this.releaseRepository.save(release);
            processWebhooks_1.processWebhooks('release.created', { release });
            return release;
        });
    }
    updateRelease(id, input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const release = yield this.releaseRepository.findOneOrFail(id);
            yield this.releaseRepository.merge(release, input);
            processWebhooks_1.processWebhooks('release.updated', { release });
            return yield this.releaseRepository.save(release);
        });
    }
    removeRelease(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const release = yield this.releaseRepository.findOneOrFail(id);
            yield this.documentRepository.delete({
                releaseId: id,
            });
            yield this.releaseRepository.remove(release);
            processWebhooks_1.processWebhooks('release.removed', { release });
            return true;
        });
    }
    publishRelease(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const release = yield this.Release(id);
            const qb = this.documentRepository.createQueryBuilder();
            const subquery = qb
                .subQuery()
                .select('id')
                .from(Document_1.Document, 'd')
                .where('d.documentId = Document.documentId')
                .andWhere('d.locale = Document.locale')
                .andWhere('d.deletedAt IS NULL')
                .orderBy({ 'd.updatedAt': 'DESC' })
                .limit(1);
            const ids = yield qb
                .where({
                releaseId: release.id,
            })
                .having(`Document.id = ${subquery.getQuery()}`)
                .groupBy('Document.id')
                .addGroupBy('Document.locale')
                .getMany();
            if (ids.length > 0) {
                const docs = yield this.documentRepository.find({ where: { id: typeorm_1.In(ids.map(d => d.id)) } });
                yield Promise.all(docs.map(doc => this.documentRepository.publish(doc, context.user.id)));
            }
            this.documentRepository.update({ releaseId: release.id }, {
                releaseId: null,
            });
            release.publishedAt = new Date();
            release.publishedBy = context.user.id;
            yield this.releaseRepository.save(release);
            processWebhooks_1.processWebhooks('release.published', { release });
            return release;
        });
    }
    user(release) {
        return typeorm_1.getRepository(User_1.User).findOneOrFail({
            cache: 1000,
            where: release.user,
        });
    }
    documents(release //
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { releaseId: release.id };
            const result = yield this.documentResolver.allDocuments([], [where], {});
            const edges = yield result.edges;
            return edges.map(edge => {
                return edge.node;
            });
        });
    }
    documentsCount(release) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = { releaseId: release.id };
            const result = yield this.documentResolver.allDocuments([], [where], {});
            return result.totalCount;
        });
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(ReleaseRepository_1.ReleaseRepository),
    __metadata("design:type", ReleaseRepository_1.ReleaseRepository)
], ReleaseResolver.prototype, "releaseRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(DocumentRepository_1.DocumentRepository),
    __metadata("design:type", DocumentRepository_1.DocumentRepository)
], ReleaseResolver.prototype, "documentRepository", void 0);
__decorate([
    typedi_1.Inject(x => DocumentResolver_1.DocumentResolver),
    __metadata("design:type", DocumentResolver_1.DocumentResolver)
], ReleaseResolver.prototype, "documentResolver", void 0);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => Release_1.Release, { nullable: true, description: 'Get Release by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "Release", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => ReleaseConnection, { description: 'Get many Releases' }),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createConnectionType_1.ConnectionArgs //
    ]),
    __metadata("design:returntype", void 0)
], ReleaseResolver.prototype, "allReleases", null);
__decorate([
    type_graphql_1.Mutation(returns => Release_1.Release, { description: 'Create Release' }),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReleaseInput_1.ReleaseInput, Object]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "createRelease", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Release_1.Release, { description: 'Update Release by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReleaseInput_1.ReleaseInput, Object]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "updateRelease", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean, { description: 'Remove Release by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "removeRelease", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Release_1.Release, { description: 'Publish Release by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "publishRelease", null);
__decorate([
    type_graphql_1.FieldResolver(returns => User_1.User, { description: 'Get Release User' }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Release_1.Release]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "user", null);
__decorate([
    type_graphql_1.FieldResolver(returns => [Document_1.Document], { description: 'Get Release Documents' }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Release_1.Release //
    ]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "documents", null);
__decorate([
    type_graphql_1.FieldResolver(returns => type_graphql_1.Int, { description: 'Get Release Document Count' }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Release_1.Release]),
    __metadata("design:returntype", Promise)
], ReleaseResolver.prototype, "documentsCount", null);
ReleaseResolver = __decorate([
    type_graphql_1.Resolver(of => Release_1.Release)
], ReleaseResolver);
exports.ReleaseResolver = ReleaseResolver;
//# sourceMappingURL=ReleaseResolver.js.map