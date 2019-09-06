import GraphQLJSON from 'graphql-type-json';
import { Document } from '../../../entities/Document';
import { Context } from '../../../interfaces/Context';
import { ConnectionArgs } from '../types/createConnectionType';
import { DocumentFilterInput } from '../types/DocumentFilterInput';
import { DocumentInput } from '../types/DocumentInput';
import { ExtendedConnection } from '../utils/ExtendedConnection';
export declare class DocumentResolver {
    private readonly schemaRepository;
    private readonly schemaFieldRepository;
    private readonly documentRepository;
    private readonly documentTransformer;
    Document(id: string, locale?: string, releaseId?: string): any;
    allDocuments(sorts: string[], filters: DocumentFilterInput[], args: ConnectionArgs): Promise<ExtendedConnection<Document>>;
    createDocument(input: DocumentInput, context: Context): Promise<Document>;
    updateDocument(id: string, data: GraphQLJSON, locale: string, releaseId: string, context: Context): Promise<Document>;
    removeDocument(id: string, locale?: string, releaseId?: string): Promise<boolean>;
    publishDocument(id: string, context: Context): Promise<any>;
    unpublishDocument(id: string, context: Context): Promise<any>;
    data(document: Document): Promise<any>;
    versions(document: Document): Promise<Document[]>;
    published(document: Document): Promise<any>;
    primary(document: Document): Promise<any>;
}
