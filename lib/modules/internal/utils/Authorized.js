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
const type_graphql_1 = require("type-graphql");
function Authorized(ruleFn) {
    return type_graphql_1.UseMiddleware(({ args, context }, next) => __awaiter(this, void 0, void 0, function* () {
        if (!context.user) {
            throw new apollo_server_core_1.AuthenticationError('Must be authenticated');
        }
        if (ruleFn) {
            ruleFn({
                can: (action, subject, field) => {
                    context.ability.throwUnlessCan(action, subject, field);
                },
            }, args);
        }
        return next();
    }));
}
exports.Authorized = Authorized;
//# sourceMappingURL=Authorized.js.map