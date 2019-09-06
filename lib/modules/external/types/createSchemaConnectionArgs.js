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
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const uniqueTypeNames_1 = require("../utils/uniqueTypeNames");
const OrderEnum = new graphql_1.GraphQLEnumType({
    name: 'Order',
    values: {
        ASC: { value: 'ASC' },
        DESC: { value: 'DESC' },
    },
});
exports.createSchemaConnectionArgs = ({ name, fields, schema, schemas, resolvers, }) => __awaiter(this, void 0, void 0, function* () {
    const sortName = uniqueTypeNames_1.uniqueTypeName(`${name}_Sort`);
    const sortFields = {};
    const whereName = uniqueTypeNames_1.uniqueTypeName(`${name}_Where`);
    const whereFields = {};
    const addFieldSort = (field, sortKey, acc) => {
        const children = fields.filter(f => f.parentFieldId === field.id);
        if (children.length) {
            const subSortName = uniqueTypeNames_1.uniqueTypeName(`${sortKey}_${lodash_1.upperFirst(lodash_1.camelCase(field.name))}`);
            const subSortFields = {};
            for (const subfield of fields) {
                if (subfield.parentFieldId === field.id && field.primeField) {
                    addFieldSort(subfield, subSortName, subSortFields);
                }
            }
            if (Object.keys(subSortFields).length) {
                acc[field.name] = {
                    type: new graphql_1.GraphQLInputObjectType({
                        name: subSortName,
                        fields: subSortFields,
                    }),
                };
            }
        }
        else {
            acc[field.name] = { type: OrderEnum };
        }
    };
    for (const field of fields) {
        if (field.parentFieldId === null && field.primeField) {
            const WhereType = yield field.primeField.whereType({
                fields,
                schema,
                schemas,
                name: whereName,
                resolvers,
                uniqueTypeName: uniqueTypeNames_1.uniqueTypeName,
            });
            addFieldSort(field, sortName, sortFields);
            if (WhereType) {
                whereFields[field.name] = {
                    type: WhereType,
                };
            }
        }
    }
    const SortInputType = new graphql_1.GraphQLInputObjectType({
        name: sortName,
        fields: sortFields,
    });
    const WhereInputType = new graphql_1.GraphQLInputObjectType({
        name: whereName,
        fields: () => (Object.assign({}, whereFields, { OR: { type: new graphql_1.GraphQLList(WhereInputType) }, AND: { type: new graphql_1.GraphQLList(WhereInputType) } })),
    });
    const args = {
        locale: { type: graphql_1.GraphQLString },
        first: { type: graphql_1.GraphQLInt },
        skip: { type: graphql_1.GraphQLInt },
        before: { type: graphql_1.GraphQLString },
        after: { type: graphql_1.GraphQLString },
    };
    if (Object.keys(SortInputType.getFields()).length) {
        args.sort = { type: new graphql_1.GraphQLList(SortInputType) };
    }
    if (Object.keys(WhereInputType.getFields()).length) {
        args.where = { type: new graphql_1.GraphQLList(WhereInputType) };
    }
    return args;
});
//# sourceMappingURL=createSchemaConnectionArgs.js.map