import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createDocumentCreateResolver: (payload: SchemaPayload) => Promise<(root: any, args: {
    locale?: string | undefined;
    input: any;
}, context: any, info: any) => Promise<any>>;
