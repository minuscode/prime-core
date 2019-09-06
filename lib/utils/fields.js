"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable non-literal-require no-console
const debug_1 = __importDefault(require("debug"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const log = debug_1.default('prime:fields');
// Resolve fields
exports.fields = (config_1.config.fields || [])
    .map((moduleName) => {
    try {
        const field = require(moduleName).default;
        field.packageName = moduleName;
        const pkgDir = moduleName.replace(/\/*(src\/*?)?$/, '');
        let pkgJson;
        try {
            const dev = path_1.default.resolve(path_1.default.join('node_modules', pkgDir, 'package.json'));
            const devFile = fs_1.default.realpathSync(dev);
            field.mode = 'development';
            field.dir = devFile.replace(/\/package.json$/, '');
            pkgJson = require(devFile);
        }
        catch (err) {
            try {
                const dist = path_1.default.resolve(path_1.default.join('..', '..', 'node_modules', pkgDir, 'package.json'));
                const distFile = fs_1.default.realpathSync(dist);
                field.mode = 'production';
                field.dir = distFile.replace(/\/package.json$/, '');
                pkgJson = require(distFile);
            }
            catch (err2) {
                // noop
            }
        }
        if (pkgJson) {
            if (pkgJson.prime) {
                field.ui = path_1.default.join(field.dir, pkgJson.prime);
            }
        }
        if (field.options && !field.defaultOptions) {
            // Backwards compatible
            field.defaultOptions = field.options;
        }
        let error;
        if (!field.type) {
            error = '%o has no static "type" property';
        }
        else if (!field.title) {
            error = '%o has no static "title" property';
        }
        if (error) {
            log(error, moduleName);
            return null;
        }
        return field;
    }
    catch (err) {
        log('Could not resolve field module %o because:\n%O', moduleName, err);
    }
    return null;
})
    .filter(n => !!n);
//# sourceMappingURL=fields.js.map