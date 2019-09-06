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
const graphql_api_1 = require("@accounts/graphql-api");
const password_1 = __importDefault(require("@accounts/password"));
const typeorm_1 = require("@accounts/typeorm");
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const type_graphql_1 = require("type-graphql");
const typeorm_2 = require("typeorm");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const User_1 = require("../../../entities/User");
const UserMeta_1 = require("../../../entities/UserMeta");
const processWebhooks_1 = require("../../../utils/processWebhooks");
const UserMetaRepository_1 = require("../repositories/UserMetaRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const createConnectionType_1 = require("../types/createConnectionType");
const UpdateUserInput_1 = require("../types/UpdateUserInput");
const Authorized_1 = require("../utils/Authorized");
const ExtendedConnection_1 = require("../utils/ExtendedConnection");
const UserConnection = createConnectionType_1.createConnectionType(User_1.User);
let UserResolver = class UserResolver {
    User(id //
    ) {
        return this.userRepository.findOneOrFail(id);
    }
    getUser(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneOrFail(context.user.id);
            const meta = yield user.meta();
            return Object.assign({}, context.user, { meta, ability: context.ability.rules });
        });
    }
    allUsers(args //
    ) {
        const result = new ExtendedConnection_1.ExtendedConnection(args, {
            repository: this.userRepository,
            sortOptions: [{ sort: 'createdAt', order: 'ASC' }],
        });
        result.resolveNode = (user) => __awaiter(this, void 0, void 0, function* () {
            user.emails = yield this.userEmailRepository.find({ user });
            const meta = yield user.meta();
            return Object.assign({}, user, { meta });
        });
        return result;
    }
    createPrimeUser(email, maybePassword, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const password = graphql_api_1.AccountsModule.injector.get(password_1.default);
            const userId = yield password.createUser({
                email,
                password: maybePassword,
            });
            if (!maybePassword) {
                password.sendEnrollmentEmail(email);
            }
            yield password.server.activateUser(userId);
            if (profile) {
                const meta = new UserMeta_1.UserMeta();
                meta.id = userId;
                meta.profile = profile;
                yield this.userMetaRepository.save(meta);
            }
            processWebhooks_1.processWebhooks('user.created', { userId });
            return true;
        });
    }
    changeEmail(password, email, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = graphql_api_1.AccountsModule.injector.get(password_1.default);
            const user = yield accounts.authenticate({
                user: {
                    id: context.user.id,
                },
                password,
            });
            if (user) {
                yield accounts.addEmail(user.id, email, false);
                yield accounts.sendVerificationEmail(email);
                processWebhooks_1.processWebhooks('user.emailAdded', { userId: user.id, email });
                return true;
            }
            return false;
        });
    }
    updateUser(id, input, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneOrFail(id);
            const meta = yield user.meta();
            meta.profile = input.profile;
            context.ability.throwUnlessCan('update', user);
            yield this.userRepository.save(user);
            yield this.userMetaRepository.save(meta);
            processWebhooks_1.processWebhooks('user.updated', { user });
            return user;
        });
    }
    removeUser(id, //
    context) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneOrFail(id);
            context.ability.throwUnlessCan('delete', user);
            yield this.userRepository.remove(user);
            processWebhooks_1.processWebhooks('user.removed', { user });
            return true;
        });
    }
    email(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = yield this.userEmailRepository.findOneOrFail({ user });
            return email.address;
        });
    }
    roles(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // dno... yet
            return [];
        });
    }
    ability(context) {
        return context.ability.rules;
    }
    meta(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return user.meta();
        });
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(UserRepository_1.UserRepository),
    __metadata("design:type", UserRepository_1.UserRepository)
], UserResolver.prototype, "userRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(UserMetaRepository_1.UserMetaRepository),
    __metadata("design:type", UserMetaRepository_1.UserMetaRepository)
], UserResolver.prototype, "userMetaRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(typeorm_1.UserEmail),
    __metadata("design:type", typeorm_2.Repository)
], UserResolver.prototype, "userEmailRepository", void 0);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => User_1.User),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "User", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => User_1.User),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    Authorized_1.Authorized(role => role.can('list', 'User')),
    type_graphql_1.Query(returns => UserConnection),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createConnectionType_1.ConnectionArgs //
    ]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "allUsers", null);
__decorate([
    Authorized_1.Authorized(role => role.can('create', 'User')),
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('password', { nullable: true })),
    __param(2, type_graphql_1.Arg('profile', type => graphql_type_json_1.default, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createPrimeUser", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('password')),
    __param(1, type_graphql_1.Arg('email')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeEmail", null);
__decorate([
    type_graphql_1.Mutation(returns => User_1.User),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input', type => UpdateUserInput_1.UpdateUserInput)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserInput_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateUser", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('id', type => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "removeUser", null);
__decorate([
    type_graphql_1.FieldResolver(returns => String, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "email", null);
__decorate([
    type_graphql_1.FieldResolver(returns => [String], { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "roles", null);
__decorate([
    type_graphql_1.FieldResolver(returns => graphql_type_json_1.default, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "ability", null);
__decorate([
    type_graphql_1.FieldResolver(returns => UserMeta_1.UserMeta),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "meta", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(of => User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map