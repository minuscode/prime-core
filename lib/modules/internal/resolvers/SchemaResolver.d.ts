import { EntityConnection } from 'typeorm-cursor-connection';
import { Document } from '../../../entities/Document';
import { Schema } from '../../../entities/Schema';
import { ConnectionArgs } from '../types/createConnectionType';
import { SchemaFieldGroup } from '../types/SchemaFieldGroup';
import { SchemaInput } from '../types/SchemaInput';
export declare class SchemaResolver {
    private readonly schemaRepository;
    private readonly documentRepository;
    Schema(id: string, name: string): Promise<any>;
    allSchemas(args: ConnectionArgs): Promise<{
        edges: {
            node: {
                variant: any;
                id: string;
                name: string;
                title: string;
                groups: any;
                settings: any;
                createdAt: Date;
                updatedAt: Date;
                documents: Document[];
                fields: import("../../../entities/SchemaField").SchemaField[];
                user: import("@accounts/typeorm").User;
            };
            cursor: string;
        }[];
        options: import("typeorm-cursor-connection").EntityConnectionOptions<Schema>;
        repository: import("typeorm").Repository<Schema>;
        sortOptions: import("typeorm-cursor-connection").EntityConnectionSortOption[];
        where: ((qb: import("typeorm").SelectQueryBuilder<Schema>) => any) | undefined;
        pageInfo: import("@girin/connection").PageInfo<EntityConnection<Schema>>;
    }>;
    createSchema(input: SchemaInput & {
        fields: any;
    }): Promise<Schema>;
    updateSchema(id: string, input: SchemaInput & {
        fields: any;
    }): Promise<Schema>;
    removeSchema(id: string): Promise<boolean>;
    schemaNameAvailable(name: string, variant: number): Promise<boolean>;
    fields(schema: Schema): Promise<SchemaFieldGroup[]>;
    documentCount(schema: Schema): Promise<number>;
}
