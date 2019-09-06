import { Document } from '../../../entities/Document';
import { Release } from '../../../entities/Release';
import { User } from '../../../entities/User';
import { ConnectionArgs } from '../types/createConnectionType';
import { ReleaseInput } from '../types/ReleaseInput';
import { ExtendedConnection } from '../utils/ExtendedConnection';
import { Context } from '../../../interfaces/Context';
export declare class ReleaseResolver {
    private readonly releaseRepository;
    private readonly documentRepository;
    private readonly documentResolver;
    Release(id: string): Promise<Release>;
    allReleases(args: ConnectionArgs): ExtendedConnection<Release>;
    createRelease(input: ReleaseInput, context: Context): Promise<Release>;
    updateRelease(id: string, input: ReleaseInput, context: Context): Promise<Release>;
    removeRelease(id: string, context: Context): Promise<boolean>;
    publishRelease(id: string, context: Context): Promise<Release>;
    user(release: Release): Promise<User>;
    documents(release: Release): Promise<Document[]>;
    documentsCount(release: Release): Promise<number>;
}
