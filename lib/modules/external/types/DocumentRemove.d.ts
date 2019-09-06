import { GraphQLNonNull } from 'graphql';
export declare const DocumentRemove: {
    args: {
        id: {
            type: GraphQLNonNull<import("graphql").GraphQLNullableType>;
            description: string;
        };
        locale: {
            type: import("graphql").GraphQLScalarType;
            description: string;
        };
    };
    type: import("graphql").GraphQLScalarType;
};
