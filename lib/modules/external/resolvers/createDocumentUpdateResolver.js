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
const apollo_server_core_1 = require("apollo-server-core");
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const Document_1 = require("../../../entities/Document");
const index_1 = require("../index");
exports.createDocumentUpdateResolver = (payload) => __awaiter(this, void 0, void 0, function* () {
    const documentRepository = typeorm_1.getRepository(Document_1.Document);
    return (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
        const key = args.id.length === 36 ? 'id' : 'documentId';
        const locale = args.locale || (yield index_1.getDefaultLocale());
        // @todo only allow to merge published?
        let doc = yield documentRepository.findOne({
            where: Object.assign({ [key]: args.id }, (key === 'documentId' && { locale }), { deletedAt: typeorm_1.IsNull(), schemaId: payload.schema.id }),
            order: {
                createdAt: 'DESC',
            },
        });
        if (!doc && key === 'documentId') {
            doc = yield documentRepository.findOne({
                where: { documentId: args.id, deletedAt: typeorm_1.IsNull() },
                order: {
                    createdAt: 'DESC',
                },
            });
        }
        if (!doc) {
            throw new apollo_server_core_1.UserInputError('Document not found');
        }
        const data = yield payload.documentTransformer.transformInput(args.input, payload.schema, payload.fields);
        if (args.merge) {
            lodash_1.defaultsDeep(data, yield payload.documentTransformer.transformInput(doc.data, payload.schema, payload.fields));
        }
        // @todo userId
        const document = yield documentRepository.insert({
            data,
            locale,
            schemaId: payload.schema.id,
            documentId: doc.documentId,
        });
        const res = document.identifiers.pop() || { id: null };
        return payload.resolvers[payload.name](root, { id: res.id }, context, info);
    });
});
//# sourceMappingURL=createDocumentUpdateResolver.js.map