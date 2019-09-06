"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const operators = {
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    eq: '=',
    neq: '!=',
    in: 'IN',
    contains: 'LIKE',
    not: '!=',
    id: 'SIMILAR TO',
};
const modes = { OR: 'orWhere', AND: 'andWhere' };
exports.documentWhereBuilder = (tableName, fields, queryBuilder, where, scope = [], mode = 'andWhere') => {
    for (const [fieldName, whereOrValue] of Object.entries(where)) {
        if (fieldName === 'OR' || fieldName === 'AND') {
            queryBuilder[mode](new typeorm_1.Brackets(builder => {
                whereOrValue.forEach(innerWhere => exports.documentWhereBuilder(tableName, fields, builder, innerWhere, scope, modes[fieldName]));
                return builder;
            }));
        }
        else if (operators.hasOwnProperty(fieldName)) {
            const innerScope = ['"data"', ...scope.slice(0).map(n => `'${n}'`)];
            const lastScopeItem = innerScope.pop();
            const column = `"${tableName}".${innerScope.join('->')}->>${lastScopeItem}`;
            const operator = operators[fieldName];
            if (!operator) {
                continue;
            }
            let value = whereOrValue;
            if (fieldName === 'contains') {
                value = `%${value}%`;
            }
            else if (fieldName === 'id') {
                value = `%(,${value}("|\\Z))%`;
            }
            let keyValue = whereOrValue;
            if (Array.isArray(keyValue)) {
                keyValue = keyValue.join(',');
            }
            const key = Buffer.from(`key:${keyValue}`).toString('hex');
            let queryKey = `:${key}`;
            if (fieldName === 'in') {
                queryKey = `(:...${key})`;
            }
            queryBuilder[mode](`${column} ${operator} ${queryKey}`, { [key]: value });
        }
        else if (whereOrValue) {
            const field = fields.find(targetField => targetField.name === fieldName &&
                targetField.parentFieldId === (scope[scope.length - 1] || null));
            if (field && field.primeField) {
                const nextScope = [...scope, field.id];
                exports.documentWhereBuilder(tableName, fields, queryBuilder, whereOrValue, nextScope, mode);
            }
        }
    }
};
//# sourceMappingURL=documentWhereBuilder.js.map