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
const field_1 = require("@primecms/field");
const graphql_1 = require("graphql");
const Schema_1 = require("../../../entities/Schema");
const uniqueTypeNames_1 = require("../utils/uniqueTypeNames");
exports.createSchemaInputType = ({ name, schema, schemas, types, fields, resolvers }, SchemaType, operation = field_1.PrimeFieldOperation.CREATE) => __awaiter(this, void 0, void 0, function* () {
    const operationMap = {
        [field_1.PrimeFieldOperation.CREATE]: 'Create',
        [field_1.PrimeFieldOperation.UPDATE]: 'Update',
    };
    let resolvedTypeFields = {};
    const typeName = uniqueTypeNames_1.uniqueTypeName(`${name}_${operationMap[operation]}Input`);
    const resolveFieldsAsync = () => __awaiter(this, void 0, void 0, function* () {
        const typeFields = {};
        if (schema.variant === Schema_1.SchemaVariant.Slice) {
            typeFields.___inputname = { type: graphql_1.GraphQLString };
        }
        for (const field of fields) {
            if (field.primeField && !field.parentFieldId) {
                const type = yield field.primeField.inputType({
                    name,
                    schema,
                    schemas,
                    types,
                    fields,
                    uniqueTypeName: uniqueTypeNames_1.uniqueTypeName,
                    resolvers,
                }, operation);
                if (type) {
                    typeFields[field.name] = type;
                }
            }
        }
        return typeFields;
    });
    const InputType = new graphql_1.GraphQLInputObjectType({
        name: typeName,
        fields: () => resolvedTypeFields,
    });
    return {
        args: Object.assign({}, (operation === field_1.PrimeFieldOperation.UPDATE && {
            id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID), description: 'Can be hashid or UUID' },
            merge: {
                type: graphql_1.GraphQLBoolean,
                description: 'Merge updated input (instead of replacing)',
                defaultValue: true,
            },
        }), { locale: { type: graphql_1.GraphQLString }, input: { type: new graphql_1.GraphQLNonNull(InputType) } }),
        type: SchemaType,
        variant: schema.variant,
        operation,
        asyncResolve() {
            return resolveFieldsAsync().then(typeFields => {
                resolvedTypeFields = typeFields;
            });
        },
    };
});
//# sourceMappingURL=createSchemaInputType.js.map