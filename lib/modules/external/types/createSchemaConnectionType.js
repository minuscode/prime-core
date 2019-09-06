"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const uniqueTypeNames_1 = require("../utils/uniqueTypeNames");
const PageInfo_1 = require("./PageInfo");
exports.createSchemaConnectionType = (schemaPayload, SchemaType) => {
    const { name } = schemaPayload;
    const ConnectionEdge = new graphql_1.GraphQLObjectType({
        name: uniqueTypeNames_1.uniqueTypeName(`${name}_ConnectionEdge`),
        fields: {
            node: { type: SchemaType },
            cursor: { type: graphql_1.GraphQLString },
        },
    });
    return new graphql_1.GraphQLObjectType({
        name: uniqueTypeNames_1.uniqueTypeName(`${name}_Connection`),
        fields: {
            edges: { type: new graphql_1.GraphQLList(ConnectionEdge) },
            pageInfo: { type: PageInfo_1.PageInfo },
            totalCount: { type: graphql_1.GraphQLInt },
        },
    });
};
//# sourceMappingURL=createSchemaConnectionType.js.map