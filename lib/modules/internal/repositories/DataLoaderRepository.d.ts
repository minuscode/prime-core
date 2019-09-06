import { FindConditions, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
export declare class DataLoaderRepository<T> extends Repository<T> {
    cache: Map<any, any>;
    getLoader(qb: SelectQueryBuilder<T>, keyMatcher?: (qb: SelectQueryBuilder<T>, keys: string[]) => void, keyName?: string, raw?: boolean): any;
    loadOne(id: string, where?: FindConditions<T> | ObjectLiteral | string): any;
}
