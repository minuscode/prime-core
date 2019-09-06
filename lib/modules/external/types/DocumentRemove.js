"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.DocumentRemove = {
    args: {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID), description: 'Accepts hashid or UUID' },
        locale: { type: graphql_1.GraphQLString, description: 'Optional when using UUID as id' },
    },
    type: graphql_1.GraphQLBoolean,
};
//# sourceMappingURL=DocumentRemove.js.map