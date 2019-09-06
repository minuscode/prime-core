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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Schema_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("@accounts/typeorm");
const class_validator_1 = require("class-validator");
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const lodash_1 = require("lodash");
const type_graphql_1 = require("type-graphql");
const typeorm_2 = require("typeorm");
const Document_1 = require("./Document");
const SchemaField_1 = require("./SchemaField");
var SchemaVariant;
(function (SchemaVariant) {
    SchemaVariant[SchemaVariant["Default"] = 0] = "Default";
    SchemaVariant[SchemaVariant["Slice"] = 1] = "Slice";
    SchemaVariant[SchemaVariant["Template"] = 2] = "Template";
})(SchemaVariant = exports.SchemaVariant || (exports.SchemaVariant = {}));
type_graphql_1.registerEnumType(SchemaVariant, {
    name: 'SchemaVariant',
});
let Schema = Schema_1 = class Schema {
    setName() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.name && this.title) {
                const { title, variant } = this;
                const contentTypes = typeorm_2.getRepository(Document_1.Document);
                const baseName = lodash_1.upperFirst(lodash_1.camelCase(title)).replace(/ /g, '');
                let name = baseName;
                let count = 1;
                let i = 1;
                while (count === 1) {
                    count = yield contentTypes.count({ where: { name, variant } });
                    if (count === 1) {
                        name = `${baseName}${i}`;
                        i += 1;
                    }
                }
                this.name = name;
            }
        });
    }
};
__decorate([
    typeorm_2.PrimaryGeneratedColumn('uuid'),
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Schema.prototype, "id", void 0);
__decorate([
    typeorm_2.Column({ unique: true }),
    class_validator_1.Matches(/^[A-Za-z][A-Za-z0-9]+$/, { message: 'not in alphanumeric' }),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schema.prototype, "name", void 0);
__decorate([
    typeorm_2.Column(),
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Schema.prototype, "title", void 0);
__decorate([
    typeorm_2.Column('enum', { enum: SchemaVariant, default: SchemaVariant.Default }),
    type_graphql_1.Field(type => SchemaVariant),
    __metadata("design:type", Number)
], Schema.prototype, "variant", void 0);
__decorate([
    typeorm_2.Column('jsonb', { default: [] }),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], Schema.prototype, "groups", void 0);
__decorate([
    typeorm_2.Column('jsonb', { default: {} }),
    type_graphql_1.Field(type => graphql_type_json_1.default),
    __metadata("design:type", Object)
], Schema.prototype, "settings", void 0);
__decorate([
    typeorm_2.CreateDateColumn(),
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Schema.prototype, "createdAt", void 0);
__decorate([
    typeorm_2.UpdateDateColumn(),
    type_graphql_1.Field(),
    __metadata("design:type", Date)
], Schema.prototype, "updatedAt", void 0);
__decorate([
    typeorm_2.OneToMany(type => Schema_1, schema => schema.documents),
    __metadata("design:type", Array)
], Schema.prototype, "documents", void 0);
__decorate([
    typeorm_2.OneToMany(type => SchemaField_1.SchemaField, field => field.schema, {
        nullable: true,
        persistence: false,
    }),
    __metadata("design:type", Array)
], Schema.prototype, "fields", void 0);
__decorate([
    typeorm_2.ManyToOne(type => typeorm_1.User),
    __metadata("design:type", typeorm_1.User)
], Schema.prototype, "user", void 0);
__decorate([
    typeorm_2.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Schema.prototype, "setName", null);
Schema = Schema_1 = __decorate([
    typeorm_2.Entity(),
    type_graphql_1.ObjectType()
], Schema);
exports.Schema = Schema;
//# sourceMappingURL=Schema.js.map