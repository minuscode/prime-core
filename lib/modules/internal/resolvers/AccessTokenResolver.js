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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const hashids_1 = __importDefault(require("hashids"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const typeorm_cursor_connection_1 = require("typeorm-cursor-connection");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const AccessToken_1 = require("../../../entities/AccessToken");
const AccessTokenInput_1 = require("../types/AccessTokenInput");
const createConnectionType_1 = require("../types/createConnectionType");
const Authorized_1 = require("../utils/Authorized");
const AccessTokenConnection = createConnectionType_1.createConnectionType(AccessToken_1.AccessToken);
let AccessTokenResolver = class AccessTokenResolver {
    AccessToken(id, context, info) {
        return this.accessTokenRepository.findOne(id);
    }
    allAccessTokens(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield new typeorm_cursor_connection_1.EntityConnection(args, {
                repository: this.accessTokenRepository,
                sortOptions: [{ sort: '"createdAt"', order: 'DESC' }],
            });
            return {
                edges: yield connection.edges,
                totalCount: yield this.accessTokenRepository.count(),
            };
        });
    }
    createAccessToken(input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.';
            const salt = String(process.env.HASHID_SALT || 'keyboard dart cat');
            const hash = crypto_1.default.createHmac('sha512', salt);
            const hashid = new hashids_1.default(salt, 108, alphabet);
            hash.update(`${Math.floor(1000 * Math.random())}|${Date.now()}`);
            const accessToken = this.accessTokenRepository.create(input);
            const tokenSeed = hash.digest('hex').match(/.{1,8}/g) || [];
            const token = hashid.encode(tokenSeed.map(num => parseInt(num, 16)));
            if (!tokenSeed.length || token === '') {
                throw new Error('Failed to generate access token');
            }
            accessToken.token = token;
            accessToken.userId = context.user.id;
            yield this.accessTokenRepository.save(accessToken);
            return accessToken;
        });
    }
    removeAccessToken(id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield this.accessTokenRepository.findOneOrFail(id);
            return Boolean(yield this.accessTokenRepository.remove(accessToken));
        });
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(AccessToken_1.AccessToken),
    __metadata("design:type", typeorm_1.Repository)
], AccessTokenResolver.prototype, "accessTokenRepository", void 0);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => AccessToken_1.AccessToken, { nullable: true, description: 'Get Access Token by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __param(2, type_graphql_1.Info()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AccessTokenResolver.prototype, "AccessToken", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => AccessTokenConnection, { description: 'Get many Access Tokens' }),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createConnectionType_1.ConnectionArgs]),
    __metadata("design:returntype", Promise)
], AccessTokenResolver.prototype, "allAccessTokens", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => AccessToken_1.AccessToken, { description: 'Create Access Token' }),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AccessTokenInput_1.AccessTokenInput, Object]),
    __metadata("design:returntype", Promise)
], AccessTokenResolver.prototype, "createAccessToken", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean, { description: 'Remove Access Token by ID' }),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AccessTokenResolver.prototype, "removeAccessToken", null);
AccessTokenResolver = __decorate([
    type_graphql_1.Resolver(of => AccessToken_1.AccessToken)
], AccessTokenResolver);
exports.AccessTokenResolver = AccessTokenResolver;
//# sourceMappingURL=AccessTokenResolver.js.map