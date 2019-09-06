import { Context } from 'apollo-server-core';
import { GraphQLResolveInfo } from 'graphql';
import { EntityConnection } from 'typeorm-cursor-connection';
import { User } from '../../../entities/User';
import { Webhook } from '../../../entities/Webhook';
import { WebhookCall } from '../../../entities/WebhookCall';
import { ConnectionArgs } from '../types/createConnectionType';
import { WebhookInput } from '../types/WebhookInput';
export declare class WebhookResolver {
    private readonly webhookRepository;
    private readonly webhookCallRepository;
    Webhook(id: string, context: Context, info: GraphQLResolveInfo): any;
    webhookAdded(payload: Webhook): Webhook;
    allWebhooks(args: ConnectionArgs, orderBy: string): Promise<{
        edges: import("@girin/connection").Edge<EntityConnection<Webhook>>[];
        totalCount: number;
    }>;
    createWebhook(input: WebhookInput, context: Context): Promise<Webhook>;
    updateWebhook(id: string, input: WebhookInput, context: Context): Promise<Webhook>;
    removeWebhook(id: string, context: Context): Promise<boolean>;
    calls(webhook: Webhook): Promise<WebhookCall[]>;
    user(webhook: Webhook): Promise<User>;
}
