import { SchemaField } from '../../../entities/SchemaField';
export declare type Order = 'ASC' | 'DESC';
export interface NestedSort {
    [key: string]: Order | NestedSort;
}
export interface SortOption {
    sort: string;
    order: 'ASC' | 'DESC';
}
export declare const getSortOptions: (tableName: string, fields: SchemaField[], sort: NestedSort | NestedSort[], scope?: string[], acc?: SortOption[], orderScopes?: Set<unknown>) => SortOption[];
