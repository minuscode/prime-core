"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Document_1 = require("../entities/Document");
const Schema_1 = require("../entities/Schema");
const config_1 = require("./config");
const DocumentTransformer_1 = require("./DocumentTransformer");
exports.previewRoutes = (app) => {
    app.get(`${config_1.config.pathClean}/prime/redirect`, (req, res) => {
        const { id, url, accessToken, refreshToken } = req.query;
        if (id.length === 36) {
            const cookieConfig = {
                path: '/',
                maxAge: 86400000,
            };
            res.cookie('prime.accessToken', accessToken, cookieConfig);
            res.cookie('prime.refreshToken', refreshToken, cookieConfig);
            res.cookie('prime.preview', id.toLowerCase(), cookieConfig);
            res.redirect(303, url.toLowerCase() + '?prime.id=' + id.toLowerCase());
            return;
        }
        res.json({ success: false });
    });
    app.get(`${config_1.config.pathClean}/prime/preview`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const cookie = String(req.headers.cookie);
        const cookies = cookie.split(';').reduce((acc, item) => {
            const [key, value] = item
                .trim()
                .split('=')
                .map(decodeURIComponent);
            acc[key] = value;
            return acc;
        }, {});
        const transformer = new DocumentTransformer_1.DocumentTransformer();
        const documentRepository = typeorm_1.getRepository(Document_1.Document);
        const schemaRepository = yield typeorm_1.getRepository(Schema_1.Schema);
        if (req.query.id) {
            try {
                const document = yield documentRepository.findOneOrFail(req.query.id);
                const schema = yield schemaRepository.findOneOrFail(document.schemaId);
                const data = yield transformer.transformOutput(document, schema);
                res.json({
                    success: true,
                    document: Object.assign({}, document, { data }),
                    schema,
                    accessToken: cookies['prime.accessToken'],
                    refreshToken: cookies['prime.refreshToken'],
                });
                return;
            }
            catch (err) {
                // noop
            }
        }
        res.json({ success: false });
    }));
};
//# sourceMappingURL=preview.js.map