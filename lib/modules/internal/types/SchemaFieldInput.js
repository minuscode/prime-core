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
var SchemaFieldInput_1;
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const type_graphql_1 = require("type-graphql");
const SchemaField_1 = require("../../../entities/SchemaField");
let SchemaFieldInput = SchemaFieldInput_1 = class SchemaFieldInput extends SchemaField_1.SchemaField {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "group", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], SchemaFieldInput.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaFieldInput.prototype, "schemaId", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Boolean)
], SchemaFieldInput.prototype, "primary", void 0);
__decorate([
    type_graphql_1.Field(type => graphql_type_json_1.default, { nullable: true }),
    __metadata("design:type", Object)
], SchemaFieldInput.prototype, "options", void 0);
__decorate([
    type_graphql_1.Field(type => SchemaFieldInput_1, { nullable: true }),
    __metadata("design:type", Array)
], SchemaFieldInput.prototype, "fields", void 0);
SchemaFieldInput = SchemaFieldInput_1 = __decorate([
    type_graphql_1.InputType()
], SchemaFieldInput);
exports.SchemaFieldInput = SchemaFieldInput;
//# sourceMappingURL=SchemaFieldInput.js.map