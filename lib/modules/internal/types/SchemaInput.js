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
const Schema_1 = require("../../../entities/Schema");
const SchemaFieldGroupInput_1 = require("./SchemaFieldGroupInput");
let SchemaInput = class SchemaInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(type => Schema_1.SchemaVariant, { nullable: true }),
    __metadata("design:type", Number)
], SchemaInput.prototype, "variant", void 0);
__decorate([
    type_graphql_1.Field(type => graphql_type_json_1.default, { nullable: true }),
    __metadata("design:type", Object)
], SchemaInput.prototype, "settings", void 0);
__decorate([
    type_graphql_1.Field(type => [SchemaFieldGroupInput_1.SchemaFieldGroupInput], { nullable: true }),
    __metadata("design:type", SchemaFieldGroupInput_1.SchemaFieldGroupInput)
], SchemaInput.prototype, "fields", void 0);
SchemaInput = __decorate([
    type_graphql_1.InputType()
], SchemaInput);
exports.SchemaInput = SchemaInput;
//# sourceMappingURL=SchemaInput.js.map