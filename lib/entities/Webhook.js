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
const typeorm_1 = require("@accounts/typeorm");
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const type_graphql_1 = require("type-graphql");
const typeorm_2 = require("typeorm");
const WebhookCall_1 = require("./WebhookCall");
let Webhook = class Webhook {
};
__decorate([
    typeorm_2.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Webhook.prototype, "id", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Webhook.prototype, "name", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Webhook.prototype, "url", void 0);
__decorate([
    typeorm_2.Column({ default: 'POST' }),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Webhook.prototype, "method", void 0);
__decorate([
    typeorm_2.Column({ type: 'jsonb', default: {} }),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], Webhook.prototype, "options", void 0);
__decorate([
    typeorm_2.CreateDateColumn(),
    type_graphql_1.Field(type => Date),
    __metadata("design:type", Date)
], Webhook.prototype, "createdAt", void 0);
__decorate([
    typeorm_2.UpdateDateColumn(),
    type_graphql_1.Field(type => Date),
    __metadata("design:type", Date)
], Webhook.prototype, "updatedAt", void 0);
__decorate([
    typeorm_2.ManyToOne(type => typeorm_1.User),
    __metadata("design:type", typeorm_1.User)
], Webhook.prototype, "user", void 0);
__decorate([
    typeorm_2.OneToMany(type => WebhookCall_1.WebhookCall, call => call.webhook),
    __metadata("design:type", Array)
], Webhook.prototype, "calls", void 0);
Webhook = __decorate([
    typeorm_2.Entity(),
    type_graphql_1.ObjectType()
], Webhook);
exports.Webhook = Webhook;
//# sourceMappingURL=Webhook.js.map