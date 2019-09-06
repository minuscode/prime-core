import { User } from '@accounts/typeorm';
import { Document } from './Document';
import { SchemaField } from './SchemaField';
export declare enum SchemaVariant {
    Default = 0,
    Slice = 1,
    Template = 2
}
export declare class Schema {
    id: string;
    name: string;
    title: string;
    variant: SchemaVariant;
    groups: any;
    settings: any;
    createdAt: Date;
    updatedAt: Date;
    documents: Document[];
    fields: SchemaField[];
    user: User;
    setName(): Promise<void>;
}
