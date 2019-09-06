"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rc_1 = __importDefault(require("rc"));
exports.config = rc_1.default('prime', {
    fields: [
        '@primecms/field-asset',
        '@primecms/field-boolean',
        '@primecms/field-datetime',
        '@primecms/field-document',
        '@primecms/field-geopoint',
        '@primecms/field-group',
        '@primecms/field-number',
        '@primecms/field-select',
        '@primecms/field-slice',
        '@primecms/field-string',
    ],
    sofaApi: true,
    uiDir: defaultUiDir(),
    coreUrl: defaultCoreUrl(),
    path: defaultCorePath(),
});
exports.config.coreUrl = exports.config.coreUrl.trim().replace(/\/+$/, '');
exports.config.path = `/${exports.config.path.trim()}/`.replace(/\/+$/, '/').replace(/^\/+/, '/');
exports.config.pathClean = exports.config.path.replace(/\/+$/, '');
function defaultUiDir() {
    try {
        const dir = require.resolve('@primecms/ui/package.json');
        return path_1.default.join(path_1.default.dirname(dir), 'build');
    }
    catch (err) {
        try {
            const dir = fs_1.default.realpathSync(path_1.default.join(process.cwd(), 'packages', 'prime-ui', 'build'));
            if (dir) {
                return dir;
            }
        }
        catch (err) {
            return null;
        }
    }
}
function defaultCoreUrl() {
    const { CORE_URL, HEROKU_APP_NAME, PORT } = process.env;
    if (CORE_URL) {
        return CORE_URL;
    }
    if (HEROKU_APP_NAME) {
        return `https://${HEROKU_APP_NAME}.herokuapp.com`;
    }
    return `http://localhost:${PORT || 4000}`;
}
function defaultCorePath() {
    const { CORE_PATH } = process.env;
    if (CORE_PATH) {
        return CORE_PATH;
    }
    const matches = defaultCoreUrl().match(/[0-9a-zA-Z]\/(.*)$/);
    if (matches && matches[1]) {
        return matches[1];
    }
    return '/';
}
//# sourceMappingURL=config.js.map