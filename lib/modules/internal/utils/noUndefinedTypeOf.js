"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noUndefinedTypeOf = (item, key) => {
    if (typeof item.__isTypeOf === 'undefined') {
        delete item.__isTypeOf;
    }
    return item;
};
//# sourceMappingURL=noUndefinedTypeOf.js.map