import { ObjectType as EntityType } from 'typeorm';
export declare class ConnectionArgs {
    first?: number;
    last?: number;
    skip?: number;
    after?: string;
    before?: string;
}
export declare const createConnectionType: <T>(model: EntityType<T>) => any;
