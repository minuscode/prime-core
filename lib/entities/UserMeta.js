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
let UserMeta = class UserMeta {
};
__decorate([
    typeorm_1.Column('uuid', { primary: true }),
    __metadata("design:type", String)
], UserMeta.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(type => graphql_type_json_1.default, { nullable: true }),
    typeorm_1.Column({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], UserMeta.prototype, "profile", void 0);
UserMeta = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType()
], UserMeta);
exports.UserMeta = UserMeta;
//# sourceMappingURL=UserMeta.js.map