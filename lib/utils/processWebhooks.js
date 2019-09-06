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
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const typeorm_1 = require("typeorm");
const Webhook_1 = require("../entities/Webhook");
const WebhookCall_1 = require("../entities/WebhookCall");
const successCodes = [200, 201, 202, 203, 204];
exports.processWebhooks = (action, body) => __awaiter(this, void 0, void 0, function* () {
    const webhookRepository = typeorm_1.getRepository(Webhook_1.Webhook);
    const webhookCallRepository = typeorm_1.getRepository(WebhookCall_1.WebhookCall);
    const webhooks = yield webhookRepository.find();
    yield Promise.all(webhooks
        .filter(webhook => {
        if (webhook.options && Array.isArray(webhook.options.actions)) {
            return webhook.options.actions.includes(action);
        }
        return true;
    })
        .map((webhook) => __awaiter(this, void 0, void 0, function* () {
        const request = {
            headers: {
                'x-prime-action': action,
                'x-prime-webhook-name': webhook.name,
                'content-type': 'application/json',
                'user-agent': 'prime',
            },
            method: webhook.method,
            url: webhook.url,
            body,
        };
        let response;
        try {
            response = yield isomorphic_fetch_1.default(request.url, {
                headers: request.headers,
                method: request.method,
                body: JSON.stringify(request.body),
            });
        }
        catch (err) {
            response = {
                headers: [],
                status: -1,
                statusText: err.message,
                text: () => __awaiter(this, void 0, void 0, function* () { return ''; }),
            };
        }
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        yield webhookCallRepository.create({
            webhookId: webhook.id,
            success: successCodes.indexOf(response.status) >= 0,
            status: response.status,
            executedAt: new Date(),
            request,
            response: {
                headers,
                body: yield response.text(),
                redirected: response.redirected,
                url: response.url,
                type: response.type,
                status: response.status,
                statusText: response.statusText,
            },
        });
    })));
});
//# sourceMappingURL=processWebhooks.js.map