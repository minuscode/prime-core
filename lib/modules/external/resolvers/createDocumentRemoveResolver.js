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
const getDefaultLocale = () => 'en';
exports.createDocumentRemoveResolver = (payload) => __awaiter(this, void 0, void 0, function* () {
    const documentRepository = typeorm_1.getRepository(Document_1.Document);
    return (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
        const key = args.id.length === 36 ? 'id' : 'documentId';
        const locale = args.locale || (yield getDefaultLocale());
        const single = payload.schema.settings.single;
        const doc = yield documentRepository.findOneOrFail(Object.assign({}, (single && { [key]: args.id }), (single || (key === 'documentId' && { locale })), { schemaId: payload.schema.id, deletedAt: typeorm_1.IsNull() }));
        const result = yield documentRepository.update(Object.assign({ documentId: doc.id }, (args.locale && { locale })), {
            deletedAt: new Date(),
        });
        return result.raw[0].length > 0;
    });
});
//# sourceMappingURL=createDocumentRemoveResolver.js.map