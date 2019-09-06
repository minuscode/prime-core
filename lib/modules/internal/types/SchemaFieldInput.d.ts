import { SchemaField } from '../../../entities/SchemaField';
export declare class SchemaFieldInput extends SchemaField {
    id: string;
    name: string;
    title: string;
    description: string;
    group: string;
    type: string;
    position: number;
    schemaId: string;
    primary: boolean;
    options: any;
    fields: SchemaFieldInput[];
}
