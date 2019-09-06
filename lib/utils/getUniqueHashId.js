"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const hashids_1 = __importDefault(require("hashids"));
const hashid = new hashids_1.default(process.env.HASHID_SALT || 'SaltingTheHash', 10);
exports.getUniqueHashId = (repository, fieldName = 'id') => __awaiter(this, void 0, void 0, function* () {
    const id = hashid.encode(Date.now());
    const count = yield repository.count({
        where: { [fieldName]: id },
    });
    return count === 0 ? id : exports.getUniqueHashId(repository, fieldName);
});
//# sourceMappingURL=getUniqueHashId.js.map