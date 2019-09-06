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
const getDefaultLocale = () => __awaiter(this, void 0, void 0, function* () { return 'en'; });
exports.createDocumentResolver = ({ name, schema, fields, documentTransformer, }) => __awaiter(this, void 0, void 0, function* () {
    const documentRepository = typeorm_1.getRepository(Document_1.Document);
    return (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
        const key = args.id && args.id.length === 36 ? 'id' : 'documentId';
        const locale = args.locale || (yield getDefaultLocale());
        const single = schema.settings.single;
        const where = Object.assign({}, (!single && { [key]: args.id }), ((single || key === 'documentId') && Object.assign({ locale }, (!context.preview && { publishedAt: typeorm_1.Raw(alias => `${alias} IS NOT NULL`) }))), { schemaId: schema.id, deletedAt: typeorm_1.IsNull() });
        const doc = yield documentRepository.findOne({
            where,
            order: {
                createdAt: 'DESC',
            },
        });
        if (doc) {
            const data = yield documentTransformer.transformOutput(doc, schema, fields);
            const locales = documentRepository
                .createQueryBuilder('d')
                .select('d.locale')
                .where('d.documentId = :documentId', { documentId: doc.documentId });
            if (!context.preview) {
                locales.where(`d.publishedAt IS NOT NULL`);
            }
            locales.groupBy('d.locale');
            const meta = Object.assign({}, doc, { locales: (yield locales.getRawMany()).map(d => d.d_locale) });
            return Object.assign({ id: doc.documentId, _meta: meta }, data, { __typeOf: name });
        }
    });
});
//# sourceMappingURL=createDocumentResolver.js.map