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
const ability_1 = require("@casl/ability");
const apollo_server_core_1 = require("apollo-server-core");
exports.abilityForbiddenMiddleware = ({ context, info }, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        return yield next();
    }
    catch (err) {
        if (err instanceof ability_1.ForbiddenError) {
            throw new apollo_server_core_1.ForbiddenError(err.message);
        }
        throw err;
    }
});
//# sourceMappingURL=abilityErrorMiddleware.js.map