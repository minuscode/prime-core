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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
const type_graphql_1 = require("type-graphql");
const SettingsLocale_1 = require("./SettingsLocale");
const SettingsPreview_1 = require("./SettingsPreview");
var SettingsAccessType;
(function (SettingsAccessType) {
    SettingsAccessType[SettingsAccessType["PUBLIC"] = 0] = "PUBLIC";
    SettingsAccessType[SettingsAccessType["PRIVATE"] = 1] = "PRIVATE";
})(SettingsAccessType = exports.SettingsAccessType || (exports.SettingsAccessType = {}));
type_graphql_1.registerEnumType(SettingsAccessType, {
    name: 'SettingsAccessType',
});
let Settings = class Settings {
};
__decorate([
    type_graphql_1.Field(type => SettingsAccessType, { nullable: true }),
    __metadata("design:type", Number)
], Settings.prototype, "accessType", void 0);
__decorate([
    type_graphql_1.Field(type => [SettingsPreview_1.SettingsPreview], { nullable: true }),
    __metadata("design:type", Array)
], Settings.prototype, "previews", void 0);
__decorate([
    type_graphql_1.Field(type => [SettingsLocale_1.SettingsLocale], { nullable: true }),
    __metadata("design:type", Array)
], Settings.prototype, "locales", void 0);
__decorate([
    type_graphql_1.Field(type => graphql_type_json_1.default, { nullable: true }),
    __metadata("design:type", Object)
], Settings.prototype, "env", void 0);
Settings = __decorate([
    type_graphql_1.InputType('SettingsInput'),
    type_graphql_1.ObjectType('Settings')
], Settings);
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map