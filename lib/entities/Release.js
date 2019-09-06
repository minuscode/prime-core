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
const Document_1 = require("./Document");
let Release = class Release {
};
__decorate([
    typeorm_2.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", Object)
], Release.prototype, "id", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Release.prototype, "name", void 0);
__decorate([
    typeorm_2.Column({ nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Release.prototype, "description", void 0);
__decorate([
    typeorm_2.Column({ type: 'timestamp', nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Date)
], Release.prototype, "scheduledAt", void 0);
__decorate([
    typeorm_2.Column({ type: 'timestamp', nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Date)
], Release.prototype, "publishedAt", void 0);
__decorate([
    typeorm_2.Column('uuid', { nullable: true }),
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Release.prototype, "publishedBy", void 0);
__decorate([
    typeorm_2.CreateDateColumn(),
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Release.prototype, "createdAt", void 0);
__decorate([
    typeorm_2.UpdateDateColumn(),
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Release.prototype, "updatedAt", void 0);
__decorate([
    typeorm_2.OneToMany(type => Document_1.Document, document => document.release),
    __metadata("design:type", Array)
], Release.prototype, "documents", void 0);
__decorate([
    typeorm_2.ManyToOne(type => typeorm_1.User),
    __metadata("design:type", typeorm_1.User)
], Release.prototype, "user", void 0);
Release = __decorate([
    typeorm_2.Entity(),
    type_graphql_1.ObjectType()
], Release);
exports.Release = Release;
//# sourceMappingURL=Release.js.map