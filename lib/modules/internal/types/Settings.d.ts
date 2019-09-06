import { SettingsLocale } from './SettingsLocale';
import { SettingsPreview } from './SettingsPreview';
export declare enum SettingsAccessType {
    PUBLIC = 0,
    PRIVATE = 1
}
export declare class Settings {
    accessType: SettingsAccessType;
    previews: SettingsPreview[];
    locales: SettingsLocale[];
    env?: any;
}
