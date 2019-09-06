import { GraphQLModule } from '@graphql-modules/core';
import debug from 'debug';
import { Connection } from 'typeorm';
export declare const log: debug.Debugger;
export declare const createInternal: (connection: Connection) => Promise<GraphQLModule<any, import("@accounts/graphql-api").AccountsRequest, {
    requestId: number;
    container: import("typedi").ContainerInstance;
    ability: import("@casl/ability").Ability;
}>>;
