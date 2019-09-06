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
const lodash_1 = require("lodash");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const Schema_1 = require("../entities/Schema");
const SchemaField_1 = require("../entities/SchemaField");
const Types = {
    ROOT: 0,
    GROUP: 1,
    SLICE: 2,
    INPUT: 10,
    OUTPUT: 11,
};
let DocumentTransformer = class DocumentTransformer {
    constructor() {
        this.fieldsDataloader = new dataloader_1.default((keys) => __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getRepository(SchemaField_1.SchemaField).find({
                where: {
                    schemaId: typeorm_1.In(keys),
                },
                cache: 1000,
            });
            return keys.map(key => result.filter(n => n.schemaId === key));
        }));
        this.getFields = (schema) => __awaiter(this, void 0, void 0, function* () {
            const schemaIds = [schema.id];
            if (schema) {
                schemaIds.push(...lodash_1.get(schema, 'settings.schemaIds', []));
            }
            return (yield this.fieldsDataloader.loadMany(schemaIds)).flat();
        });
        this.transform = (fields, data, schema, io = Types.INPUT, type = Types.ROOT) => __awaiter(this, void 0, void 0, function* () {
            const output = {};
            if (type === Types.SLICE) {
                if (!data.__inputname) {
                    return {};
                }
                output.__inputname = data.__inputname;
            }
            for (const field of fields) {
                if (!field) {
                    continue;
                }
                const { primeField } = field;
                let value = lodash_1.get(data, io === Types.INPUT ? field.name : field.id);
                if (primeField) {
                    if (io === Types.INPUT) {
                        value = yield primeField.processInput(value);
                    }
                    else if (io === Types.OUTPUT) {
                        value = yield primeField.processOutput(value);
                    }
                }
                if (typeof value === 'undefined') {
                    continue;
                }
                if (field.parentFieldId && type !== Types.GROUP) {
                    continue;
                }
                const defaultOptions = primeField ? primeField.options : {};
                const options = lodash_1.defaultsDeep(field.options || {}, defaultOptions);
                if (field.type === 'group') {
                    const subFields = fields.filter(f => f.parentFieldId === field.id);
                    if (options.repeated && Array.isArray(value)) {
                        value = (yield Promise.all(value.map(item => this.transform(subFields, item, schema, io, Types.GROUP)))).filter(item => Object.keys(item).length > 0);
                    }
                    else {
                        value = yield this.transform(subFields, value, schema, io, Types.GROUP);
                        if (Object.keys(value).length === 0) {
                            continue;
                        }
                    }
                }
                if (field.type === 'slice') {
                    if (options.multiple && Array.isArray(value)) {
                        value = (yield Promise.all(value.map((item) => __awaiter(this, void 0, void 0, function* () {
                            const sfields = yield this.getFields({ id: item.__inputname });
                            if (sfields) {
                                return yield this.transform(sfields, item, schema, io, Types.SLICE);
                            }
                            return {};
                        })))).filter(item => Object.keys(item).length > 0);
                    }
                    else {
                        const sfields = yield this.getFields({ id: value.__inputname });
                        value = yield this.transform(sfields, value, schema, io, Types.SLICE);
                        if (Object.keys(value).length === 0) {
                            continue;
                        }
                    }
                }
                if (io === Types.INPUT) {
                    output[field.id] = value;
                }
                else if (io === Types.OUTPUT) {
                    output[field.name] = value;
                }
            }
            return output;
        });
        this.transformInput = (data, schema, fields) => __awaiter(this, void 0, void 0, function* () {
            if (!fields) {
                fields = yield this.getFields(schema);
            }
            return this.transform(fields, data, schema, Types.INPUT);
        });
        this.transformOutput = (document, schema, fields) => __awaiter(this, void 0, void 0, function* () {
            if (!schema) {
                schema = yield typeorm_1.getRepository(Schema_1.Schema).findOneOrFail(document.schemaId, {
                    cache: 1000,
                });
            }
            if (!fields) {
                fields = yield this.getFields(schema);
            }
            return this.transform(fields, document.data, schema, Types.OUTPUT);
        });
    }
};
DocumentTransformer = __decorate([
    typedi_1.Service()
], DocumentTransformer);
exports.DocumentTransformer = DocumentTransformer;
//# sourceMappingURL=DocumentTransformer.js.map