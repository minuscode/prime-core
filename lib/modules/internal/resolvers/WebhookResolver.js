"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const typeorm_cursor_connection_1 = require("typeorm-cursor-connection");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const User_1 = require("../../../entities/User");
const Webhook_1 = require("../../../entities/Webhook");
const WebhookCall_1 = require("../../../entities/WebhookCall");
const WebhookRepository_1 = require("../repositories/WebhookRepository");
const createConnectionType_1 = require("../types/createConnectionType");
const WebhookInput_1 = require("../types/WebhookInput");
const Authorized_1 = require("../utils/Authorized");
const WebhookConnection = createConnectionType_1.createConnectionType(Webhook_1.Webhook);
var WebhookOrder;
(function (WebhookOrder) {
    WebhookOrder[WebhookOrder["id_ASC"] = 0] = "id_ASC";
    WebhookOrder[WebhookOrder["id_DESC"] = 1] = "id_DESC";
    WebhookOrder[WebhookOrder["name_ASC"] = 2] = "name_ASC";
    WebhookOrder[WebhookOrder["name_DESC"] = 3] = "name_DESC";
})(WebhookOrder || (WebhookOrder = {}));
type_graphql_1.registerEnumType(WebhookOrder, {
    name: 'WebhookConnectionOrder',
});
let WebhookResolver = class WebhookResolver {
    Webhook(id, context, info) {
        return this.webhookRepository.loadOne(id);
    }
    webhookAdded(payload) {
        return payload;
    }
    allWebhooks(args, orderBy) {
        return __awaiter(this, void 0, void 0, function* () {
            const [sort, order] = orderBy.split('_');
            const connection = yield new typeorm_cursor_connection_1.EntityConnection(args, {
                repository: this.webhookRepository,
                sortOptions: [{ sort, order }],
            });
            return {
                edges: yield connection.edges,
                totalCount: yield this.webhookRepository.count(),
            };
        });
    }
    createWebhook(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = this.webhookRepository.create(input);
            yield this.webhookRepository.save(webhook);
            return webhook;
        });
    }
    updateWebhook(id, input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.webhookRepository.findOneOrFail(id);
            yield this.webhookRepository.merge(entity, input);
            yield this.webhookRepository.save(entity);
            return entity;
        });
    }
    removeWebhook(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.webhookRepository.findOneOrFail(id);
            return Boolean(yield this.webhookRepository.remove(entity));
        });
    }
    calls(webhook) {
        return this.webhookCallRepository.find({
            cache: 1000,
            where: { webhook },
        });
    }
    user(webhook) {
        return typeorm_1.getRepository(User_1.User).findOneOrFail({
            cache: 1000,
            where: webhook.user,
        });
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(WebhookRepository_1.WebhookRepository),
    __metadata("design:type", WebhookRepository_1.WebhookRepository)
], WebhookResolver.prototype, "webhookRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(WebhookCall_1.WebhookCall),
    __metadata("design:type", typeorm_1.Repository)
], WebhookResolver.prototype, "webhookCallRepository", void 0);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => Webhook_1.Webhook, { nullable: true, description: 'Get Webhook by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.Info()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], WebhookResolver.prototype, "Webhook", null);
__decorate([
    type_graphql_1.Subscription({
        topics: 'WEBHOOK_ADDED',
        description: 'Get latest Webhook as a subscription',
    }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Webhook_1.Webhook]),
    __metadata("design:returntype", Webhook_1.Webhook)
], WebhookResolver.prototype, "webhookAdded", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => WebhookConnection, { description: 'Get many Webhooks' }),
    __param(0, type_graphql_1.Args()),
    __param(1, type_graphql_1.Arg('order', type => WebhookOrder, { defaultValue: 0 })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createConnectionType_1.ConnectionArgs, String]),
    __metadata("design:returntype", Promise)
], WebhookResolver.prototype, "allWebhooks", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Webhook_1.Webhook, { description: 'Create Webhook' }),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WebhookInput_1.WebhookInput, Object]),
    __metadata("design:returntype", Promise)
], WebhookResolver.prototype, "createWebhook", null);
__decorate([
    type_graphql_1.Mutation(returns => Webhook_1.Webhook, { description: 'Update Webhook by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, WebhookInput_1.WebhookInput, Object]),
    __metadata("design:returntype", Promise)
], WebhookResolver.prototype, "updateWebhook", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean, { description: 'Remove Webhook by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhookResolver.prototype, "removeWebhook", null);
__decorate([
    type_graphql_1.FieldResolver(returns => [WebhookCall_1.WebhookCall], { description: 'Get many Webhook calls' }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Webhook_1.Webhook]),
    __metadata("design:returntype", Promise)
], WebhookResolver.prototype, "calls", null);
__decorate([
    type_graphql_1.FieldResolver(returns => User_1.User, { description: 'Get Webhook User' }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Webhook_1.Webhook]),
    __metadata("design:returntype", Promise)
], WebhookResolver.prototype, "user", null);
WebhookResolver = __decorate([
    type_graphql_1.Resolver(of => Webhook_1.Webhook)
], WebhookResolver);
exports.WebhookResolver = WebhookResolver;
//# sourceMappingURL=WebhookResolver.js.map