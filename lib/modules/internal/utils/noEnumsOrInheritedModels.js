"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.noEnumsOrInheritedModels = (item, key) => {
    if (key === 'User') {
        return true;
    }
    if (typeof item === 'object' && Object.values(item).every(lodash_1.isNumber)) {
        return true;
    }
    return false;
};
//# sourceMappingURL=noEnumsOrInheritedModels.js.map