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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("@accounts/typeorm");
const type_graphql_1 = require("type-graphql");
const typeorm_2 = require("typeorm");
let AccessToken = class AccessToken {
};
__decorate([
    typeorm_2.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], AccessToken.prototype, "id", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], AccessToken.prototype, "name", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], AccessToken.prototype, "token", void 0);
__decorate([
    typeorm_2.CreateDateColumn(),
    type_graphql_1.Field(type => Date),
    __metadata("design:type", Date)
], AccessToken.prototype, "createdAt", void 0);
__decorate([
    typeorm_2.UpdateDateColumn(),
    type_graphql_1.Field(type => Date),
    __metadata("design:type", Date)
], AccessToken.prototype, "updatedAt", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], AccessToken.prototype, "userId", void 0);
__decorate([
    typeorm_2.ManyToOne(type => typeorm_1.User),
    __metadata("design:type", typeorm_1.User)
], AccessToken.prototype, "user", void 0);
AccessToken = __decorate([
    typeorm_2.Entity(),
    type_graphql_1.ObjectType()
], AccessToken);
exports.AccessToken = AccessToken;
//# sourceMappingURL=AccessToken.js.map