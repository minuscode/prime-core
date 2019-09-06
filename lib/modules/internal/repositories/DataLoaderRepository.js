"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const dataloader_1 = __importDefault(require("dataloader"));
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const FindOptionsUtils_1 = require("typeorm/find-options/FindOptionsUtils");
let DataLoaderRepository = class DataLoaderRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.cache = new Map();
    }
    getLoader(qb, keyMatcher, keyName = 'id', raw = false) {
        const hashKey = qb.getQuery() + JSON.stringify(qb.getParameters());
        const hash = Buffer.from(hashKey, 'utf8').toString('hex');
        if (!this.cache.has(hash)) {
            this.cache.set(hash, new dataloader_1.default((keys) => __awaiter(this, void 0, void 0, function* () {
                const b = qb.clone();
                if (keyMatcher) {
                    keyMatcher(b, keys);
                }
                else {
                    b.andWhereInIds(keys);
                }
                const results = yield b.getRawAndEntities();
                if (raw) {
                    results.raw.forEach((r, i) => Object.assign(results.entities[i], r));
                }
                return keys.map(key => results.entities.find((r) => r[keyName] === key));
            })));
        }
        return this.cache.get(hash);
    }
    loadOne(id, where) {
        if (['null', 'undefined'].indexOf(typeof id) >= 0) {
            return Promise.resolve(null);
        }
        const qb = this.createQueryBuilder();
        FindOptionsUtils_1.FindOptionsUtils.applyOptionsToQueryBuilder(qb, { where });
        return this.getLoader(qb).load(String(id).toLowerCase());
    }
};
DataLoaderRepository = __decorate([
    typedi_1.Service()
], DataLoaderRepository);
exports.DataLoaderRepository = DataLoaderRepository;
//# sourceMappingURL=DataLoaderRepository.js.map