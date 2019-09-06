import DataLoader from 'dataloader';
import { Document } from '../entities/Document';
import { Schema } from '../entities/Schema';
import { SchemaField } from '../entities/SchemaField';
export declare class DocumentTransformer {
    fieldsDataloader: DataLoader<unknown, SchemaField[]>;
    getFields: (schema: Schema) => Promise<SchemaField[]>;
    transform: (fields: SchemaField[], data: any, schema: Schema, io?: number, type?: number) => Promise<{
        [key: string]: any;
    }>;
    transformInput: (data: any, schema: Schema, fields?: SchemaField[] | undefined) => Promise<{
        [key: string]: any;
    }>;
    transformOutput: (document: Document, schema?: Schema | undefined, fields?: SchemaField[] | undefined) => Promise<{
        [key: string]: any;
    }>;
}
