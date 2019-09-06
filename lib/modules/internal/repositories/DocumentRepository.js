"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typeorm_1 = require("typeorm");
const Document_1 = require("../../../entities/Document");
const DataLoaderRepository_1 = require("./DataLoaderRepository");
let DocumentRepository = class DocumentRepository extends DataLoaderRepository_1.DataLoaderRepository {
    loadOneByDocumentId(id, key = 'documentId', where) {
        if (!id) {
            return Promise.resolve(null);
        }
        const qb = this.createQueryBuilder();
        qb.where('Document.deletedAt IS NULL');
        const subquery = qb
            .subQuery()
            .select('id')
            .from(Document_1.Document, 'd');
        where = lodash_1.pickBy(where, lodash_1.identity);
        const filterWithName = name => new typeorm_1.Brackets(sq => {
            Object.entries(where).map(([k, value]) => {
                if (value instanceof typeorm_1.FindOperator) {
                    sq.andWhere(value.value(`${name}.${k}`));
                }
                else {
                    sq.andWhere(`${name}.${k} = :${k}`, { [k]: value });
                }
            });
        });
        if (Object.keys(where).length > 0) {
            subquery.andWhere(filterWithName('d'));
            qb.where(filterWithName('Document'));
        }
        subquery
            .andWhere('d.documentId = Document.documentId')
            .andWhere('d.deletedAt IS NULL')
            .orderBy({ 'd.createdAt': 'DESC' })
            .limit(1);
        qb.having(`Document.id = ${subquery.getQuery()}`);
        qb.groupBy('Document.id');
        return this.getLoader(qb, (b, keys) => b.where({ [key]: typeorm_1.In(keys) }), key).load(id);
    }
    publish(document, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            delete document.id;
            delete document.releaseId;
            delete document.createdAt;
            delete document.updatedAt;
            document.publishedAt = new Date();
            document.userId = userId;
            const res = yield this.insert(document);
            const doc = res.identifiers.pop() || { id: null };
            return doc.id;
        });
    }
};
DocumentRepository = __decorate([
    typeorm_1.EntityRepository(Document_1.Document)
], DocumentRepository);
exports.DocumentRepository = DocumentRepository;
//# sourceMappingURL=DocumentRepository.js.map