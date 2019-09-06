import { Connection } from 'typeorm';
export declare const createAccounts: (connection: Connection) => Promise<import("@graphql-modules/core").GraphQLModule<import("@accounts/graphql-api").AccountsModuleConfig, import("@accounts/graphql-api").AccountsRequest, import("@accounts/graphql-api").AccountsModuleContext<import("@accounts/types").User>>>;
