import { User } from '@accounts/typeorm';
import { Document } from './Document';
export declare class Release {
    id: any;
    name: string;
    description: string;
    scheduledAt: Date;
    publishedAt: Date;
    publishedBy: string;
    createdAt: Date;
    updatedAt: Date;
    documents: Document[];
    user: User;
}
