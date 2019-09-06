import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createDocumentRemoveResolver: (payload: SchemaPayload) => Promise<(root: any, args: {
    id: string;
    locale?: string | undefined;
}, context: any, info: any) => Promise<boolean>>;
