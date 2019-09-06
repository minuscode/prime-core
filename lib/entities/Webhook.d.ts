import { User } from '@accounts/typeorm';
import { WebhookCall } from './WebhookCall';
export declare class Webhook {
    id: string;
    name: string;
    url: string;
    method: string;
    options: any;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    calls: WebhookCall[];
}
