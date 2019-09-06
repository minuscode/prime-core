import { FindConditions, ObjectLiteral } from 'typeorm';
import { Document } from '../../../entities/Document';
import { DataLoaderRepository } from './DataLoaderRepository';
export declare class DocumentRepository extends DataLoaderRepository<Document> {
    loadOneByDocumentId(id: string, key?: string, where?: FindConditions<Document> | ObjectLiteral | string): any;
    publish(document: Document, userId: string): Promise<any>;
}
