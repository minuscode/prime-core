import { PrimeFieldOperation } from '@primecms/field';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { SchemaVariant } from '../../../entities/Schema';
import { SchemaPayload } from '../interfaces/SchemaPayload';
export declare const createSchemaType: ({ name, schema, schemas, types, fields, resolvers, }: SchemaPayload) => Promise<{
    args: {
        locale: {
            type: import("graphql").GraphQLScalarType;
        };
    } | {
        locale: {
            type: import("graphql").GraphQLScalarType;
        };
        id: {
            type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
        };
    };
    type: GraphQLObjectType<any, any, {
        [key: string]: any;
    }>;
    variant: SchemaVariant;
    operation: PrimeFieldOperation;
    asyncResolve(): Promise<void>;
}>;
