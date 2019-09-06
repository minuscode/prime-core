"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Document_1 = require("../../../entities/Document");
const documentWhereBuilder_1 = require("../utils/documentWhereBuilder");
const FindAllConnection_1 = require("../utils/FindAllConnection");
const sortOptions_1 = require("../utils/sortOptions");
const getDefaultLocale = () => 'en';
exports.createAllDocumentResolver = ({ schema, fields, documentTransformer, }) => __awaiter(this, void 0, void 0, function* () {
    const documentRepository = typeorm_1.getRepository(Document_1.Document);
    return (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
        const locale = args.locale || (yield getDefaultLocale());
        const sortOptions = sortOptions_1.getSortOptions('Document', fields, args.sort || []);
        if (sortOptions.length === 0) {
            sortOptions.push({ sort: '"createdAt"', order: 'DESC' });
        }
        sortOptions.push({ sort: '"id"', order: 'DESC' });
        const connection = new FindAllConnection_1.FindAllConnection(args, {
            where: (qb, isCount = false) => {
                const sqb = qb
                    .subQuery()
                    .select('id')
                    .from(Document_1.Document, 'd')
                    .where('d.documentId = Document.documentId');
                if (!isCount) {
                    qb.addSelect(fqb => {
                        const ffqb = fqb
                            .subQuery()
                            .select('array_agg(DISTINCT "locale")') // @todo postgres only
                            .from(Document_1.Document, 'd')
                            .where('d.documentId = Document.documentId');
                        if (!context.preview) {
                            ffqb.andWhere(`Document.publishedAt IS NOT NULL`);
                        }
                        ffqb.andWhere(`Document.deletedAt IS NULL`);
                        return ffqb;
                    }, 'locales');
                }
                qb.andWhere('Document.schemaId = :schemaId', { schemaId: schema.id });
                qb.andWhere('Document.locale = :locale', { locale });
                if (!context.preview) {
                    qb.andWhere(`Document.publishedAt IS NOT NULL`);
                }
                qb.andWhere(`Document.deletedAt IS NULL`);
                sqb.andWhere('Document.schemaId = :schemaId', { schemaId: schema.id });
                sqb.andWhere('d.locale = :locale', { locale });
                if (!context.preview) {
                    sqb.andWhere(`d.publishedAt IS NOT NULL`);
                }
                sqb.andWhere(`d.deletedAt IS NULL`);
                (args.where || []).map(n => {
                    documentWhereBuilder_1.documentWhereBuilder('Document', fields, qb, n);
                    documentWhereBuilder_1.documentWhereBuilder('d', fields, sqb, n);
                });
                sqb.orderBy({ 'd.createdAt': 'DESC' }).limit(1);
                if (!isCount) {
                    qb.having(`Document.id = ${sqb.getQuery()}`);
                    qb.groupBy('Document.id');
                }
                else {
                    qb.groupBy('Document.documentId');
                }
            },
            repository: documentRepository,
            sortOptions,
        });
        const res = yield connection
            .createAppliedQueryBuilder(true)
            .select('COUNT(DISTINCT Document.documentId)')
            .cache(2000)
            .getRawOne();
        connection.totalCount = Number((res && res.count) || 0);
        /**
         * Here we have no choice to ts-ignore the next line because 'typeorm-cursor-connection'
         * does not properly type the resolveNode function  as a MaybePromise<TNode> return type.
         * In order to asynchronously resolve the node, we need this hack until a PR fixes the typings.
         */
        // @ts-ignore-next-line
        connection.resolveNode = (node) => __awaiter(this, void 0, void 0, function* () {
            const data = yield documentTransformer.transformOutput(node, schema, fields);
            return Object.assign({}, data, { _meta: node, id: node.documentId });
        });
        return connection;
    });
});
//# sourceMappingURL=createAllDocumentResolver.js.map