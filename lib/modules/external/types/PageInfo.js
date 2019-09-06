"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.PageInfo = new graphql_1.GraphQLObjectType({
    name: 'PageInfo',
    fields: {
        hasNextPage: { type: graphql_1.GraphQLBoolean },
        hasPreviousPage: { type: graphql_1.GraphQLBoolean },
        startCursor: { type: graphql_1.GraphQLString },
        endCursor: { type: graphql_1.GraphQLString },
    },
});
//# sourceMappingURL=PageInfo.js.map