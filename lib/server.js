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
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const graphql_1 = require("graphql");
const http_1 = __importDefault(require("http"));
const sofa_api_1 = __importDefault(require("sofa-api"));
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const external_1 = require("./modules/external");
const internal_1 = require("./modules/internal");
const config_1 = require("./utils/config");
const fields_1 = require("./utils/fields");
const log_1 = require("./utils/log");
const preview_1 = require("./utils/preview");
const pubSub_1 = require("./utils/pubSub");
const serveUI_1 = require("./utils/serveUI");
typeorm_1.useContainer(typedi_1.Container);
exports.createServer = ({ port, connection }) => __awaiter(this, void 0, void 0, function* () {
    const app = express_1.default();
    const server = http_1.default.createServer(app);
    const { schema, context, subscriptions } = yield internal_1.createInternal(connection);
    let external;
    app.use(cors_1.default({
        credentials: true,
        origin: true,
    }));
    const externalServer = new apollo_server_express_1.ApolloServer({
        introspection: true,
        playground: true,
        schema: graphql_1.buildSchema(`type Query { boot: Boolean }`),
    });
    pubSub_1.pubSub.subscribe('REBUILD_EXTERNAL', (payload) => __awaiter(this, void 0, void 0, function* () {
        if (external) {
            log_1.log('schemas have changed', payload.name);
        }
        external = yield external_1.createExternal(connection);
        externalServer.schema = external.schema;
        externalServer.context = external.context;
        if (config_1.config.sofaApi) {
            app.use(`${config_1.config.path}api`, sofa_api_1.default({
                schema: external.schema,
                ignore: ['Prime_Document'],
            }));
        }
    }));
    pubSub_1.pubSub.publish('REBUILD_EXTERNAL', { name: 'SERVER_BOOT' });
    externalServer.applyMiddleware({
        app,
        path: `${config_1.config.path}graphql`,
        cors: {
            origin: true,
        },
    });
    fields_1.fields.forEach(field => field.ui && app.use(`${config_1.config.pathClean}/prime/field/${field.type}`, express_1.default.static(field.ui)));
    const apollo = new apollo_server_express_1.ApolloServer({
        playground: false,
        introspection: true,
        subscriptions: Object.assign({}, subscriptions, { onConnect: (params, ws, ctx) => ctx }),
        context(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!ctx.req && ctx.connection) {
                    return context({ req: ctx.connection.context.request });
                }
                return context(ctx);
            });
        },
        schema,
        formatResponse(response, resolver) {
            typedi_1.Container.reset(resolver.context.requestId);
            return response;
        },
    });
    apollo.installSubscriptionHandlers(server);
    apollo.applyMiddleware({
        app,
        path: `${config_1.config.path}prime/graphql`,
        cors: {
            origin: true,
        },
    });
    preview_1.previewRoutes(app);
    serveUI_1.serveUI(app);
    return server.listen(port, () => {
        log_1.log(`🚀 Server ready at http://localhost:${port}${apollo.graphqlPath}`);
        log_1.log(`🚀 Subscriptions ready at ws://localhost:${port}${apollo.subscriptionsPath}`);
    });
});
//# sourceMappingURL=server.js.map