import { PrimeFieldOperation } from '@primecms/field';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { SchemaVariant } from '../../../entities/Schema';
import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createSchemaInputType: ({ name, schema, schemas, types, fields, resolvers }: SchemaPayload, SchemaType: GraphQLObjectType<any, any, {
    [key: string]: any;
}>, operation?: PrimeFieldOperation.CREATE | PrimeFieldOperation.UPDATE) => Promise<{
    args: {
        locale: {
            type: import("graphql").GraphQLScalarType;
        };
        input: {
            type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
        };
    } | {
        locale: {
            type: import("graphql").GraphQLScalarType;
        };
        input: {
            type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
        };
        id: {
            type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
            description: string;
        };
        merge: {
            type: import("graphql").GraphQLScalarType;
            description: string;
            defaultValue: boolean;
        };
    };
    type: GraphQLObjectType<any, any, {
        [key: string]: any;
    }>;
    variant: SchemaVariant;
    operation: PrimeFieldOperation.CREATE | PrimeFieldOperation.UPDATE;
    asyncResolve(): Promise<void>;
}>;
