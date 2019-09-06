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
const child_process_1 = require("child_process");
const which_pm_1 = __importDefault(require("which-pm"));
exports.updateNpmPackages = (packages) => __awaiter(this, void 0, void 0, function* () {
    const pm = yield which_pm_1.default(process.cwd());
    const args = [pm.name, pm.name === 'yarn' ? 'add' : 'install --silent', ...packages];
    return new Promise((resolve, reject) => {
        child_process_1.exec(args.join(' '), (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(Boolean(res));
        });
    });
});
//# sourceMappingURL=updateNpmPackages.js.map