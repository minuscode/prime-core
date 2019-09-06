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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Webhook_1 = require("./Webhook");
let WebhookCall = class WebhookCall {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], WebhookCall.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('boolean'),
    type_graphql_1.Field(type => Boolean),
    __metadata("design:type", Boolean)
], WebhookCall.prototype, "success", void 0);
__decorate([
    typeorm_1.Column('int'),
    type_graphql_1.Field(type => type_graphql_1.Int),
    __metadata("design:type", Number)
], WebhookCall.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('jsonb', { default: {}, nullable: true }),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], WebhookCall.prototype, "request", void 0);
__decorate([
    typeorm_1.Column('jsonb', { nullable: true }),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], WebhookCall.prototype, "response", void 0);
__decorate([
    typeorm_1.Column('timestamp'),
    type_graphql_1.Field(type => Date),
    __metadata("design:type", Date)
], WebhookCall.prototype, "executedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], WebhookCall.prototype, "webhookId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Webhook_1.Webhook, webhook => webhook.calls, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Webhook_1.Webhook)
], WebhookCall.prototype, "webhook", void 0);
WebhookCall = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType()
], WebhookCall);
exports.WebhookCall = WebhookCall;
//# sourceMappingURL=WebhookCall.js.map