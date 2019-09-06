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
const DocumentMetadata_1 = require("./DocumentMetadata");
exports.createSchemaType = ({ name, schema, schemas, types, fields, resolvers, }) => __awaiter(this, void 0, void 0, function* () {
    let resolvedTypeFields = {};
    const resolveFieldsAsync = () => __awaiter(this, void 0, void 0, function* () {
        const typeFields = {
            id: { type: graphql_1.GraphQLID },
        };
        for (const field of fields) {
            if (field.primeField && !field.parentFieldId) {
                const type = yield field.primeField.outputType({
                    name,
                    schema,
                    schemas,
                    types,
                    fields,
                    uniqueTypeName: uniqueTypeNames_1.uniqueTypeName,
                    resolvers,
                }, field_1.PrimeFieldOperation.READ);
                if (type) {
                    typeFields[field.name] = type;
                }
            }
        }
        typeFields._meta = {
            type: DocumentMetadata_1.DocumentMetadata,
        };
        if (schema.variant === Schema_1.SchemaVariant.Slice) {
            delete typeFields.id;
            delete typeFields._meta;
        }
        return typeFields;
    });
    return {
        args: Object.assign({}, (!schema.settings.single && { id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } }), { locale: { type: graphql_1.GraphQLString } }),
        type: new graphql_1.GraphQLObjectType({
            name,
            fields: () => resolvedTypeFields,
        }),
        variant: schema.variant,
        operation: field_1.PrimeFieldOperation.READ,
        asyncResolve() {
            return resolveFieldsAsync().then(typeFields => {
                resolvedTypeFields = typeFields;
            });
        },
    };
});
//# sourceMappingURL=createSchemaType.js.map