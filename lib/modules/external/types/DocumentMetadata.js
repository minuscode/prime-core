"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_iso_date_1 = require("graphql-iso-date");
exports.DocumentMetadata = new graphql_1.GraphQLObjectType({
    name: 'PrimeDocument_Meta',
    fields: {
        locale: { type: graphql_1.GraphQLString },
        locales: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        publishedAt: { type: graphql_iso_date_1.GraphQLDateTime },
        updatedAt: { type: graphql_iso_date_1.GraphQLDateTime },
        id: { type: graphql_1.GraphQLID },
    },
});
//# sourceMappingURL=DocumentMetadata.js.map