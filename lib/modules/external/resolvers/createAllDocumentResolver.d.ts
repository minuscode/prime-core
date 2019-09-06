import { Document } from '../../../entities/Document';
import { SchemaPayload } from '../interfaces/SchemaPayload';
import { NestedWhere } from '../utils/documentWhereBuilder';
import { FindAllConnection } from '../utils/FindAllConnection';
import { NestedSort } from '../utils/sortOptions';
interface Args {
    where?: NestedWhere[];
    sort?: NestedSort[];
    locale?: string;
    first?: number | null;
    last?: number | null;
    after?: string | null;
    before?: string | null;
}
export declare const createAllDocumentResolver: ({ schema, fields, documentTransformer, }: SchemaPayload) => Promise<(root: any, args: Args, context: any, info: any) => Promise<FindAllConnection<Document>>>;
export {};
