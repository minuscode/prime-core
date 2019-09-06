"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config(); // tslint:disable-line no-var-requires
require("reflect-metadata");
const server_1 = require("./server");
const connect_1 = require("./utils/connect");
const port = Number(process.env.PORT) || 4000;
exports.default = connect_1.connect(process.env.DATABASE_URL).then(connection => server_1.createServer({ port, connection }));
//# sourceMappingURL=index.js.map