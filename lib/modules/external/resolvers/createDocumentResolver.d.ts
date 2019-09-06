import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createDocumentResolver: ({ name, schema, fields, documentTransformer, }: SchemaPayload) => Promise<(root: any, args: {
    id: string;
    locale?: string | undefined;
}, context: any, info: any) => Promise<{
    __typeOf: string;
    id: string;
    _meta: {
        locales: any[];
        id: string;
        documentId: string;
        locale: string;
        data: any;
        publishedAt: Date;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        schemaId: string;
        schema: typeof import("../../../entities/Schema").Schema;
        releaseId?: string | undefined;
        release: typeof import("../../../entities/Release").Release;
        userId?: string | undefined;
        user: import("@accounts/typeorm").User;
    };
} | undefined>>;
