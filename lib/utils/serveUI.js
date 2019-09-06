"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const log_1 = require("./log");
exports.serveUI = (app) => {
    const { uiDir } = config_1.config;
    if (!uiDir) {
        log_1.log('no ui dir found %o', uiDir);
    }
    app.use(config_1.config.pathClean, express_1.default.static(uiDir, {
        index: false,
    }));
    app.get(`${config_1.config.pathClean}*`, (req, res, next) => {
        if (req.url.substr(config_1.config.path.length, 4) === '/api') {
            return next();
        }
        fs_1.default.readFile(path_1.default.join(uiDir, 'index.html'), (err, data) => {
            if (err) {
                log_1.log(err);
                res.send('error');
            }
            else {
                res.send(data
                    .toString()
                    .replace('"$PRIME_CONFIG$"', `'${JSON.stringify(config_1.config)}'`)
                    .replace(/\/static\//g, `${config_1.config.path}static/`));
            }
        });
    });
};
//# sourceMappingURL=serveUI.js.map