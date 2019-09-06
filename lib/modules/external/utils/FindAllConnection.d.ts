import { Brackets } from 'typeorm';
import { EntityConnection } from 'typeorm-cursor-connection';
import { DocumentTransformer } from '../../../utils/DocumentTransformer';
export declare class FindAllConnection<T> extends EntityConnection<T> {
    documentTransformer: DocumentTransformer;
    totalCount: number | null;
    createAppliedQueryBuilder(counter?: boolean): import("typeorm").SelectQueryBuilder<T>;
    resolveCursor(item: T): string;
    query(): Promise<T[]>;
    protected keyToSelector(key: any[], direction: 'after' | 'before'): Brackets;
}
