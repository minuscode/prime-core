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
const getUniqueHashId_1 = require("../../../utils/getUniqueHashId");
const index_1 = require("../index");
exports.createDocumentCreateResolver = (payload) => __awaiter(this, void 0, void 0, function* () {
    const documentRepository = typeorm_1.getRepository(Document_1.Document);
    return (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
        // insert, then
        const locale = args.locale || (yield index_1.getDefaultLocale());
        const data = yield payload.documentTransformer.transformInput(args.input, payload.schema, payload.fields);
        // @todo userId
        const document = yield documentRepository.insert({
            data,
            locale,
            schemaId: payload.schema.id,
            documentId: yield getUniqueHashId_1.getUniqueHashId(documentRepository, 'documentId'),
        });
        const doc = document.identifiers.pop() || { id: null };
        return payload.resolvers[payload.name](root, { id: doc.id }, context, info);
    });
});
//# sourceMappingURL=createDocumentCreateResolver.js.map