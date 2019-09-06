"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const PageInfo_1 = require("../types/PageInfo");
let ConnectionArgs = class ConnectionArgs {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ConnectionArgs.prototype, "first", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ConnectionArgs.prototype, "last", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ConnectionArgs.prototype, "skip", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ConnectionArgs.prototype, "after", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ConnectionArgs.prototype, "before", void 0);
ConnectionArgs = __decorate([
    type_graphql_1.ArgsType()
], ConnectionArgs);
exports.ConnectionArgs = ConnectionArgs;
exports.createConnectionType = (model) => {
    // tslint:disable-next-line max-classes-per-file
    let ConnectionEdge = class ConnectionEdge {
    };
    __decorate([
        type_graphql_1.Field(type => model),
        __metadata("design:type", Object)
    ], ConnectionEdge.prototype, "node", void 0);
    __decorate([
        type_graphql_1.Field(),
        __metadata("design:type", String)
    ], ConnectionEdge.prototype, "cursor", void 0);
    ConnectionEdge = __decorate([
        type_graphql_1.ObjectType(`${model.name}ConnectionEdge`)
    ], ConnectionEdge);
    // tslint:disable-next-line max-classes-per-file
    let Connection = class Connection {
    };
    Connection.args = ConnectionArgs;
    __decorate([
        type_graphql_1.Field(type => [ConnectionEdge]),
        __metadata("design:type", ConnectionEdge)
    ], Connection.prototype, "edges", void 0);
    __decorate([
        type_graphql_1.Field(type => PageInfo_1.PageInfo),
        __metadata("design:type", PageInfo_1.PageInfo)
    ], Connection.prototype, "pageInfo", void 0);
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        __metadata("design:type", Number)
    ], Connection.prototype, "totalCount", void 0);
    Connection = __decorate([
        type_graphql_1.ObjectType(`${model.name}Connection`)
    ], Connection);
    return Connection;
};
//# sourceMappingURL=createConnectionType.js.map