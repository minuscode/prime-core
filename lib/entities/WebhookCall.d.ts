import { Webhook } from './Webhook';
export declare class WebhookCall {
    id: string;
    success: boolean;
    status: number;
    request: any;
    response: any;
    executedAt: Date;
    webhookId: string;
    webhook: Webhook;
}
