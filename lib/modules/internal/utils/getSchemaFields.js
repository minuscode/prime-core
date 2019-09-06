"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const Schema_1 = require("../../../entities/Schema");
const SchemaField_1 = require("../../../entities/SchemaField");
const fields_1 = require("../../../utils/fields");
exports.getSchemaFields = (schemaId, inheritance = true) => __awaiter(this, void 0, void 0, function* () {
    const schemaRepo = typeorm_1.getRepository(Schema_1.Schema);
    const schemaFieldRepo = typeorm_1.getRepository(SchemaField_1.SchemaField);
    const schemaIds = [schemaId];
    const schema = yield schemaRepo.findOne(schemaId);
    if (schema && inheritance) {
        schemaIds.push(...lodash_1.get(schema, 'settings.schemaIds', []));
    }
    const fieldsSource = yield schemaFieldRepo.find({
        where: {
            schemaId: typeorm_1.In(schemaIds),
        },
        order: { position: 'ASC' },
    });
    const fields = [
        ...fieldsSource.filter(f => f.schemaId === schemaId),
        ...fieldsSource.filter(f => f.schemaId !== schemaId),
    ];
    const defaultGroup = schema && schema.variant === Schema_1.SchemaVariant.Template ? schema.title : 'Main';
    const groups = ((schema && schema.groups) || [defaultGroup]).map(title => ({
        title,
        fields: [],
    }));
    const withOptions = field => {
        const fieldInstance = fields_1.fields.find(f => f.type === field.type);
        const defaultOptions = (fieldInstance && fieldInstance.defaultOptions) || {};
        field.options = lodash_1.defaultsDeep(field.options || {}, defaultOptions);
        return field;
    };
    fields.reduce((acc, field, index) => {
        if (field.parentFieldId) {
            return acc;
        }
        if (!field.group || field.group === '') {
            field.group = defaultGroup;
        }
        let group = groups.find(g => g && g.title === field.group);
        if (!group) {
            group = { title: field.group, fields: [] };
            groups.push(group);
        }
        if (group.fields) {
            group.fields.push(withOptions(Object.assign({}, field, { position: field.position || index })));
        }
        return acc;
    }, []);
    fields.forEach(field => {
        if (field.parentFieldId) {
            const parentField = fields.find(f => f.id === field.parentFieldId);
            if (parentField) {
                const group = groups.find(g => g.title === parentField.group);
                if (group && group.fields) {
                    const target = group.fields.find(f => f.id === parentField.id);
                    if (target) {
                        target.fields = target.fields || [];
                        target.fields.push(withOptions(Object.assign({}, field, { position: field.position || target.fields.length })));
                    }
                }
            }
        }
    });
    return groups;
});
//# sourceMappingURL=getSchemaFields.js.map