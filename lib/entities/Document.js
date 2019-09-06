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
const Release_1 = require("./Release");
const Schema_1 = require("./Schema");
let Document = class Document {
    constructor() {
        this.schema = Schema_1.Schema;
        this.release = Release_1.Release;
    }
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    typeorm_2.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    typeorm_2.Column({ length: 10 }),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Document.prototype, "documentId", void 0);
__decorate([
    typeorm_2.Column({ default: 'en' }),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Document.prototype, "locale", void 0);
__decorate([
    typeorm_2.Column('jsonb'),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], Document.prototype, "data", void 0);
__decorate([
    typeorm_2.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "publishedAt", void 0);
__decorate([
    typeorm_2.CreateDateColumn(),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    typeorm_2.UpdateDateColumn(),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "updatedAt", void 0);
__decorate([
    typeorm_2.Column({ type: 'timestamp', nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Date)
], Document.prototype, "deletedAt", void 0);
__decorate([
    typeorm_2.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "schemaId", void 0);
__decorate([
    typeorm_2.ManyToOne(type => Schema_1.Schema, schema => schema.documents, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Document.prototype, "schema", void 0);
__decorate([
    typeorm_2.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "releaseId", void 0);
__decorate([
    typeorm_2.ManyToOne(type => Release_1.Release, release => release.documents, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Object)
], Document.prototype, "release", void 0);
__decorate([
    typeorm_2.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "userId", void 0);
__decorate([
    typeorm_2.ManyToOne(type => typeorm_1.User, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", typeorm_1.User)
], Document.prototype, "user", void 0);
Document = __decorate([
    typeorm_2.Entity(),
    type_graphql_1.ObjectType()
], Document);
exports.Document = Document;
//# sourceMappingURL=Document.js.map