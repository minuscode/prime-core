"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const latest_1 = __importDefault(require("latest"));
const path_1 = __importDefault(require("path"));
const read_pkg_1 = __importDefault(require("read-pkg"));
const fields_1 = require("../../../utils/fields");
const getLatestVersion = packageName => new Promise(resolve => {
    try {
        latest_1.default(packageName, (err, version) => {
            return resolve(version);
        });
    }
    catch (err) {
        resolve(null);
    }
});
exports.getPackagesVersion = () => __awaiter(this, void 0, void 0, function* () {
    const packages = [
        { packageName: '@primecms/core' },
        { packageName: '@primecms/ui' },
        ...fields_1.fields.map(({ packageName, dir }) => ({ packageName, dir })),
    ];
    return yield Promise.all(packages.map((pkg) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { version } = yield read_pkg_1.default({
                cwd: pkg.dir || path_1.default.dirname(require.resolve(`${pkg.packageName}/package.json`)),
            });
            const latestVersion = yield getLatestVersion(pkg.packageName);
            return { name: pkg.packageName, currentVersion: version, latestVersion };
        }
        catch (err) {
            return { name: pkg.packageName };
        }
    })));
});
//# sourceMappingURL=getPackagesVersion.js.map