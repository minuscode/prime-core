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
const lodash_1 = require("lodash");
const type_graphql_1 = require("type-graphql");
const typeorm_2 = require("typeorm");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const Settings_1 = require("../../../entities/Settings");
const UserMeta_1 = require("../../../entities/UserMeta");
const fields_1 = require("../../../utils/fields");
const PackageVersion_1 = require("../types/PackageVersion");
const PackageVersionInput_1 = require("../types/PackageVersionInput");
const PrimeField_1 = require("../types/PrimeField");
const Settings_2 = require("../types/Settings");
const Authorized_1 = require("../utils/Authorized");
const getPackagesVersion_1 = require("../utils/getPackagesVersion");
const updateNpmPackages_1 = require("../utils/updateNpmPackages");
let PrimeResolver = class PrimeResolver {
    isOnboarding() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield typeorm_2.getRepository(typeorm_1.User).count();
            return count === 0;
        });
    }
    onboard(email, password, profile) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isOnboarding()) {
                const accounts = graphql_api_1.AccountsModule.injector.get(password_1.default);
                const db = accounts.server.options.db;
                const userId = yield accounts.createUser({ email, password });
                yield accounts.server.activateUser(userId);
                if (profile) {
                    const meta = new UserMeta_1.UserMeta();
                    meta.id = userId;
                    meta.profile = profile;
                    yield typeorm_2.getRepository(UserMeta_1.UserMeta).save(meta);
                }
                yield db.verifyEmail(userId, email);
                return true;
            }
            return false;
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this.settingsRepository.findOne({
                order: { updatedAt: 'DESC' },
            });
            if (!settings) {
                settings = new Settings_1.Settings();
                settings.data = {
                    accessType: Settings_2.SettingsAccessType[Settings_2.SettingsAccessType.PUBLIC],
                    previews: [],
                    locales: [],
                };
            }
            settings.data.env = {};
            fields_1.fields.forEach(field => {
                if (field.env) {
                    field.env.forEach(name => {
                        if (process.env[name]) {
                            settings.data.env[name] = process.env[name];
                        }
                    });
                }
            });
            settings.ensureMasterLocale();
            return settings.data;
        });
    }
    setSettings(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getSettings();
            const settings = this.settingsRepository.create({
                data: lodash_1.defaults(input, data),
            });
            yield this.settingsRepository.save(settings);
            return this.getSettings();
        });
    }
    allFields() {
        return fields_1.fields;
    }
    system() {
        return getPackagesVersion_1.getPackagesVersion();
    }
    updateSystem(packagesVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedPackages = [
                '@primecms/core',
                '@primecms/ui',
                ...fields_1.fields.map(({ packageName }) => packageName),
            ];
            if (process.env.NODE_ENV !== 'production') {
                throw new Error('Cannot update packages without NODE_ENV=production');
            }
            const updateQueue = packagesVersion
                .filter(pkg => allowedPackages.includes(pkg.name))
                .map(pkg => `${pkg.name}@${pkg.version}`);
            yield updateNpmPackages_1.updateNpmPackages(updateQueue);
            return true;
        });
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(Settings_1.Settings),
    __metadata("design:type", typeorm_2.Repository)
], PrimeResolver.prototype, "settingsRepository", void 0);
__decorate([
    type_graphql_1.Query(returns => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrimeResolver.prototype, "isOnboarding", null);
__decorate([
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('email')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Arg('profile', type => graphql_type_json_1.default, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PrimeResolver.prototype, "onboard", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => Settings_2.Settings),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrimeResolver.prototype, "getSettings", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Settings_2.Settings),
    __param(0, type_graphql_1.Arg('input', type => Settings_2.Settings)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Settings_2.Settings]),
    __metadata("design:returntype", Promise)
], PrimeResolver.prototype, "setSettings", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => [PrimeField_1.PrimeField]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], PrimeResolver.prototype, "allFields", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Query(returns => [PackageVersion_1.PackageVersion], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrimeResolver.prototype, "system", null);
__decorate([
    Authorized_1.Authorized(),
    type_graphql_1.Mutation(returns => Boolean),
    __param(0, type_graphql_1.Arg('versions', type => [PackageVersionInput_1.PackageVersionInput])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PrimeResolver.prototype, "updateSystem", null);
PrimeResolver = __decorate([
    type_graphql_1.Resolver()
], PrimeResolver);
exports.PrimeResolver = PrimeResolver;
//# sourceMappingURL=PrimeResolver.js.map