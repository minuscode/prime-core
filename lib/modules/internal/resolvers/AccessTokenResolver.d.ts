import { GraphQLResolveInfo } from 'graphql';
import { EntityConnection } from 'typeorm-cursor-connection';
import { AccessToken } from '../../../entities/AccessToken';
import { Context } from '../../../interfaces/Context';
import { AccessTokenInput } from '../types/AccessTokenInput';
import { ConnectionArgs } from '../types/createConnectionType';
export declare class AccessTokenResolver {
    private readonly accessTokenRepository;
    AccessToken(id: string, context: Context, info: GraphQLResolveInfo): Promise<AccessToken | undefined>;
    allAccessTokens(args: ConnectionArgs): Promise<{
        edges: import("@girin/connection").Edge<EntityConnection<AccessToken>>[];
        totalCount: number;
    }>;
    createAccessToken(input: AccessTokenInput, context: Context): Promise<AccessToken>;
    removeAccessToken(id: string, context: Context): Promise<boolean>;
}
