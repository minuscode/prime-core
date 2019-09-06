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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("@accounts/typeorm");
const type_graphql_1 = require("type-graphql");
const typeorm_2 = require("typeorm");
const UserMeta_1 = require("./UserMeta");
let User = class User extends typeorm_1.User {
    constructor() {
        super(...arguments);
        this.id = super.id;
    }
    meta() {
        return __awaiter(this, void 0, void 0, function* () {
            const metaRepo = typeorm_2.getRepository(UserMeta_1.UserMeta);
            let meta = yield metaRepo.findOne(this.id);
            if (!meta) {
                meta = new UserMeta_1.UserMeta();
                meta.id = this.id;
                yield metaRepo.save(meta);
            }
            return meta;
        });
    }
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", Object)
], User.prototype, "id", void 0);
User = __decorate([
    typeorm_2.Entity(),
    type_graphql_1.ObjectType()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map