import { ConnectionArguments } from '@girin/connection';
import { Brackets } from 'typeorm';
import { EntityConnection, EntityConnectionOptions } from 'typeorm-cursor-connection';
export declare class ExtendedConnection<T> extends EntityConnection<T> {
    options: EntityConnectionOptions<T>;
    totalCountField: string;
    protected skip?: number;
    constructor(args: ConnectionArguments & {
        skip?: number;
    }, options: EntityConnectionOptions<T>);
    readonly totalCount: Promise<number>;
    createAppliedQueryBuilder(counter?: boolean): import("typeorm").SelectQueryBuilder<T>;
    query(): Promise<T[]>;
    protected keyToSelector(key: any[], direction: 'after' | 'before'): Brackets;
}
