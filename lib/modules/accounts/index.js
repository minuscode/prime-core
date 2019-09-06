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
const graphql_api_1 = require("@accounts/graphql-api");
const password_1 = require("@accounts/password");
const server_1 = require("@accounts/server");
const typeorm_1 = require("@accounts/typeorm");
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const { MAILGUN_API_KEY, MAILGUN_DOMAIN, ACCOUNTS_SECRET } = process.env;
let mailgun;
if (MAILGUN_API_KEY && MAILGUN_API_KEY !== '') {
    mailgun = mailgun_js_1.default({
        apiKey: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN,
    });
}
exports.createAccounts = (connection) => __awaiter(this, void 0, void 0, function* () {
    const tokenSecret = ACCOUNTS_SECRET || 'not very secret secret';
    const db = new typeorm_1.AccountsTypeorm({
        connection,
        cache: 1000,
    });
    const password = new password_1.AccountsPassword({
        twoFactor: {
            appName: 'Prime',
        },
    });
    const accountsServer = new server_1.AccountsServer({
        db,
        tokenSecret,
        siteUrl: 'http://localhost:3000',
        sendMail(mail) {
            if (mailgun) {
                return mailgun.messages().send(mail);
            }
        },
    }, { password });
    const accounts = graphql_api_1.AccountsModule.forRoot({
        accountsServer,
        headerName: 'x-prime-token',
    });
    return accounts;
});
//# sourceMappingURL=index.js.map