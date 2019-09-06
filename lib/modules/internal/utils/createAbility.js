"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ability_1 = require("@casl/ability");
exports.createAbility = (context) => {
    return ability_1.AbilityBuilder.define((can, cannot) => {
        const userId = context.user && context.user.id;
        const role = (() => 'admin')();
        if (context.user) {
            can('update', 'User', { id: userId });
        }
        if (role === 'admin') {
            can('manage', 'all');
        }
        if (role === 'editor') {
            can('list', 'User');
            // can('read', 'User');
            // can('create', 'User');
            // can('delete', 'User');
            // can('update', 'User');
        }
        // Some ideas...
        // Can update own Blog posts
        // can('update', 'Document', { schemaId: 'blog', userId })
        // Can create Blog posts but not publish them
        // can('create', 'Document', { schemaId: 'blog' })
        // cannot('publish', 'Document', { schemaId: 'blog' })
        // Can create schemas
        // can('create', 'Schema')
    });
};
//# sourceMappingURL=createAbility.js.map