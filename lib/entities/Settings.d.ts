import { User } from '@accounts/typeorm';
import { Settings as SettingsType } from '../modules/internal/types/Settings';
export declare class Settings {
    id: string;
    data?: SettingsType;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: User;
    ensureMasterLocale(): import("../modules/internal/types/SettingsLocale").SettingsLocale | undefined;
}
