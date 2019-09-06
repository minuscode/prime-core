import { PackageVersionInput } from '../types/PackageVersionInput';
import { PrimeField } from '../types/PrimeField';
import { Settings as SettingsType } from '../types/Settings';
export declare class PrimeResolver {
    private readonly settingsRepository;
    isOnboarding(): Promise<boolean>;
    onboard(email: string, password: string, profile: any): Promise<boolean>;
    getSettings(): Promise<SettingsType | undefined>;
    setSettings(input: SettingsType): Promise<SettingsType | undefined>;
    allFields(): PrimeField[];
    system(): Promise<({
        name: any;
        currentVersion: any;
        latestVersion: unknown;
    } | {
        name: any;
        currentVersion?: undefined;
        latestVersion?: undefined;
    })[]>;
    updateSystem(packagesVersion: PackageVersionInput[]): Promise<boolean>;
}
