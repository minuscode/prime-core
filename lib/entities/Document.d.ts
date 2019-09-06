import { User } from '@accounts/typeorm';
import { Release } from './Release';
import { Schema } from './Schema';
export declare class Document {
    id: string;
    documentId: string;
    locale: string;
    data: any;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    schemaId: string;
    schema: typeof Schema;
    releaseId?: string;
    release: typeof Release;
    userId?: string;
    user: User;
}
