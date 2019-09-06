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
var SchemaField_1;
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const fields_1 = require("../utils/fields");
const Document_1 = require("./Document");
const Release_1 = require("./Release");
const Schema_1 = require("./Schema");
const Webhook_1 = require("./Webhook");
let SchemaField = SchemaField_1 = class SchemaField {
    setPrimeField() {
        if (!this.primeField) {
            const repositories = {
                document: typeorm_1.getRepository(Document_1.Document),
                schema: typeorm_1.getRepository(Schema_1.Schema),
                schemaField: typeorm_1.getRepository(SchemaField_1),
                release: typeorm_1.getRepository(Release_1.Release),
                webhook: typeorm_1.getRepository(Webhook_1.Webhook),
            };
            const PrimeFieldClass = fields_1.fields.find(field => field.type === this.type);
            if (typeof PrimeFieldClass === 'function') {
                this.primeField = new PrimeFieldClass(this, repositories);
            }
        }
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], SchemaField.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaField.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaField.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaField.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaField.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ default: 'Main' }),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], SchemaField.prototype, "group", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], SchemaField.prototype, "position", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], SchemaField.prototype, "primary", void 0);
__decorate([
    typeorm_1.Column('jsonb', { default: {} }),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], SchemaField.prototype, "options", void 0);
__decorate([
    type_graphql_1.Field(type => [SchemaField_1], { nullable: true }),
    __metadata("design:type", Array)
], SchemaField.prototype, "fields", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], SchemaField.prototype, "parentFieldId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => SchemaField_1, category => category.childFields),
    __metadata("design:type", SchemaField)
], SchemaField.prototype, "parentField", void 0);
__decorate([
    typeorm_1.OneToMany(type => SchemaField_1, category => category.parentField),
    __metadata("design:type", Array)
], SchemaField.prototype, "childFields", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], SchemaField.prototype, "schemaId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Schema_1.Schema, schema => schema.fields, {
        onDelete: 'SET NULL',
        nullable: true,
        persistence: false,
    }),
    __metadata("design:type", Schema_1.Schema)
], SchemaField.prototype, "schema", void 0);
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SchemaField.prototype, "setPrimeField", null);
SchemaField = SchemaField_1 = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType()
], SchemaField);
exports.SchemaField = SchemaField;
//# sourceMappingURL=SchemaField.js.map