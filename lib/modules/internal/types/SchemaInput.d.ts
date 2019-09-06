import { SchemaVariant } from '../../../entities/Schema';
import { SchemaFieldGroupInput } from './SchemaFieldGroupInput';
export declare class SchemaInput {
    name: string;
    title: string;
    description?: string;
    variant: SchemaVariant;
    settings: any;
    fields: SchemaFieldGroupInput;
}
