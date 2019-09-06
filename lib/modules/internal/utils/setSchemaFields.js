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
const typeorm_1 = require("typeorm");
const Schema_1 = require("../../../entities/Schema");
const SchemaField_1 = require("../../../entities/SchemaField");
exports.setSchemaFields = (schemaId, groups) => __awaiter(this, void 0, void 0, function* () {
    const schemaRepo = typeorm_1.getRepository(Schema_1.Schema);
    const schemaFieldRepo = typeorm_1.getRepository(SchemaField_1.SchemaField);
    const schemaFields = yield schemaFieldRepo.find({
        where: {
            schemaId,
        },
    });
    const fieldsToBeRemovedSet = new Set(schemaFields.map(f => f.id));
    const updateOrCreateField = (data, group, position, parentField) => __awaiter(this, void 0, void 0, function* () {
        if (data.schemaId && data.schemaId !== schemaId) {
            return null;
        }
        const field = schemaFieldRepo.create(Object.assign({}, data, { position,
            group,
            schemaId }));
        if (parentField) {
            field.parentFieldId = parentField.id;
        }
        if (field.id) {
            fieldsToBeRemovedSet.delete(field.id);
            const source = yield schemaFieldRepo.findOneOrFail(field.id);
            yield schemaFieldRepo.merge(source, field);
        }
        yield schemaFieldRepo.save(field);
        if (data.fields) {
            yield Promise.all(data.fields.map((children, i) => {
                return updateOrCreateField(children, group, i, field);
            }));
        }
        return field;
    });
    for (const group of groups) {
        if (group.fields) {
            yield Promise.all(group.fields.map((children, i) => {
                return updateOrCreateField(children, group.title, i);
            }));
        }
    }
    if (fieldsToBeRemovedSet.size > 0) {
        yield schemaFieldRepo.delete({
            id: typeorm_1.In(Array.from(fieldsToBeRemovedSet)),
        });
    }
    const schema = yield schemaRepo.findOne(schemaId);
    if (schema) {
        schema.groups = groups.map(group => group.title);
        yield schemaRepo.save(schema);
    }
    return true;
});
//# sourceMappingURL=setSchemaFields.js.map