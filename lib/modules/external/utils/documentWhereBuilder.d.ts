import { WhereExpression } from 'typeorm';
import { SchemaField } from '../../../entities/SchemaField';
interface Where {
    gt?: any;
    gte?: any;
    lt?: any;
    lte?: any;
    eq?: any;
    in?: any;
    contains?: any;
}
export interface NestedWhere {
    [key: string]: undefined | Where | NestedWhere[];
    OR?: NestedWhere[];
    AND?: NestedWhere[];
}
export declare const documentWhereBuilder: (tableName: string, fields: SchemaField[], queryBuilder: WhereExpression, where: Where | NestedWhere, scope?: string[], mode?: string) => void;
export {};
