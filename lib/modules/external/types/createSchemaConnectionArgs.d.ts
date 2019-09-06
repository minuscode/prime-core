import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createSchemaConnectionArgs: ({ name, fields, schema, schemas, resolvers, }: SchemaPayload) => Promise<{
    [key: string]: any;
}>;
