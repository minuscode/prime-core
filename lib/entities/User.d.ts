import { User as AccountsUser } from '@accounts/typeorm';
import { UserMeta } from './UserMeta';
export declare class User extends AccountsUser {
    id: string;
    meta(): Promise<UserMeta>;
}
