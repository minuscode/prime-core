import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createDocumentUpdateResolver: (payload: SchemaPayload) => Promise<(root: any, args: {
    id: string;
    locale?: string | undefined;
    merge?: boolean | undefined;
    input: any;
}, context: any, info: any) => Promise<any>>;
