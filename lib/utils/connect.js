"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const pg_1 = __importDefault(require("pg"));
const typeorm_1 = require("typeorm");
exports.connect = (url = process.env.DATABASE_URL) => {
    const ssl = Boolean(String(url).indexOf('ssl=true') >= 0 || String(url).indexOf('amazonaws.com') >= 0);
    pg_1.default.defaults.ssl = ssl;
    return typeorm_1.createConnection({
        type: 'postgres',
        url,
        entities: [
            ...require('@accounts/typeorm').entities,
            path_1.default.join(__dirname, '..', 'entities', '*.ts'),
            path_1.default.join(__dirname, '..', 'entities', '*.js'),
        ],
        ssl,
        synchronize: true,
        logger: 'debug',
    }).then(connection => {
        const driver = connection.driver;
        // Fixes postgres timezone bug
        if (driver.postgres) {
            driver.postgres.defaults.parseInputDatesAsUTC = true;
            driver.postgres.types.setTypeParser(1114, (str) => new Date(str + 'Z'));
        }
        return connection;
    });
};
//# sourceMappingURL=connect.js.map