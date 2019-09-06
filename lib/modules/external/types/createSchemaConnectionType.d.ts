import { GraphQLObjectType } from 'graphql';
import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createSchemaConnectionType: (schemaPayload: SchemaPayload, SchemaType: GraphQLObjectType<any, any, {
    [key: string]: any;
}>) => GraphQLObjectType<any, any, {
    [key: string]: any;
}>;
