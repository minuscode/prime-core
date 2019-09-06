import { GraphQLModule } from '@graphql-modules/core';
import debug from 'debug';
import { Connection } from 'typeorm';
export declare const log: debug.Debugger;
export declare const getDefaultLocale: () => string;
export declare const createExternal: (connection: Connection) => Promise<GraphQLModule<any, any, {
    [key: string]: any;
}>>;
