"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache = new Set();
exports.uniqueTypeName = (name, i = 0) => {
    const typeName = `${name}${i > 0 ? i : ''}`;
    if (cache.has(typeName)) {
        return exports.uniqueTypeName(name, i + 1);
    }
    cache.add(typeName);
    return typeName;
};
exports.resetTypeNames = () => {
    cache.clear();
    cache.add('Order');
};
//# sourceMappingURL=uniqueTypeNames.js.map