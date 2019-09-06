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
const typeorm_1 = require("@accounts/typeorm");
const typeorm_2 = require("typeorm");
const Settings_1 = require("../modules/internal/types/Settings");
let Settings = class Settings {
    ensureMasterLocale() {
        const locales = (this.data && this.data.locales) || [];
        const defaultLocale = {
            id: 'en',
            name: 'English (US)',
            flag: 'us',
            master: true,
        };
        if (locales.length > 0) {
            const master = locales.find(locale => locale.master === true);
            if (!master) {
                locales[0].master = true;
            }
        }
        else {
            locales.push(defaultLocale);
        }
        return locales.find((locale) => locale && locale.master);
    }
};
__decorate([
    typeorm_2.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Settings.prototype, "id", void 0);
__decorate([
    typeorm_2.Column({ type: 'jsonb', default: {} }),
    __metadata("design:type", Settings_1.Settings)
], Settings.prototype, "data", void 0);
__decorate([
    typeorm_2.CreateDateColumn(),
    __metadata("design:type", Date)
], Settings.prototype, "createdAt", void 0);
__decorate([
    typeorm_2.UpdateDateColumn(),
    __metadata("design:type", Date)
], Settings.prototype, "updatedAt", void 0);
__decorate([
    typeorm_2.Column({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "userId", void 0);
__decorate([
    typeorm_2.ManyToOne(type => typeorm_1.User, { nullable: true }),
    __metadata("design:type", typeorm_1.User)
], Settings.prototype, "user", void 0);
Settings = __decorate([
    typeorm_2.Entity()
], Settings);
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map