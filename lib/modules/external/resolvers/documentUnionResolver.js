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
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const Document_1 = require("../../../entities/Document");
const Schema_1 = require("../../../entities/Schema");
const getDefaultLocale = () => 'en';
exports.documentUnionResolver = (resolvers) => (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
    const locale = args.locale || (yield getDefaultLocale());
    const documentRepository = typeorm_1.getRepository(Document_1.Document);
    const schemaRepository = typeorm_1.getRepository(Schema_1.Schema);
    const doc = yield documentRepository.findOne({
        documentId: args.id,
        locale,
    });
    if (doc) {
        const schema = yield schemaRepository.findOneOrFail(doc.schemaId);
        const schemaName = lodash_1.upperFirst(lodash_1.camelCase(schema.name));
        if (resolvers[schemaName]) {
            return resolvers[schemaName](root, args, context, info);
        }
    }
    return null;
});
//# sourceMappingURL=documentUnionResolver.js.map