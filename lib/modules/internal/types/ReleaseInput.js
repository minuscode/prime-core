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
const type_graphql_1 = require("type-graphql");
let ReleaseInput = class ReleaseInput {
};
__decorate([
    type_graphql_1.Field(type => String),
    __metadata("design:type", String)
], ReleaseInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(type => String, { nullable: true }),
    __metadata("design:type", String)
], ReleaseInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", String)
], ReleaseInput.prototype, "scheduledAt", void 0);
ReleaseInput = __decorate([
    type_graphql_1.InputType()
], ReleaseInput);
exports.ReleaseInput = ReleaseInput;
//# sourceMappingURL=ReleaseInput.js.map