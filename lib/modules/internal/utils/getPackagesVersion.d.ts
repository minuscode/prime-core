export declare const getPackagesVersion: () => Promise<({
    name: any;
    currentVersion: any;
    latestVersion: unknown;
} | {
    name: any;
    currentVersion?: undefined;
    latestVersion?: undefined;
})[]>;
