"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
exports.getSortOptions = (tableName, fields, sort, scope = [], acc = [], orderScopes = new Set()) => {
    if (Array.isArray(sort)) {
        sort.forEach(item => exports.getSortOptions(tableName, fields, item, scope, acc));
    }
    else {
        for (const [fieldName, dirOrSort] of Object.entries(sort)) {
            const field = fields.find(f => f.name === fieldName && f.parentFieldId === (scope[scope.length - 1] || null));
            if (field && field.primeField) {
                const nextScope = [...scope, field.id];
                const scopeKey = nextScope.map(s => `'${s}'`).join('->');
                if (orderScopes.has(scopeKey)) {
                    throw new apollo_server_core_1.UserInputError('Cannot sort by same field twice');
                }
                orderScopes.add(scopeKey);
                if (typeof dirOrSort === 'string') {
                    acc.push({ sort: `"${tableName}"."data"->${scopeKey}`, order: dirOrSort });
                }
                else {
                    exports.getSortOptions(tableName, fields, dirOrSort, nextScope, acc);
                }
            }
        }
    }
    return acc;
};
//# sourceMappingURL=sortOptions.js.map