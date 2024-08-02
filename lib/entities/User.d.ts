import { User as AccountsUser } from '@accounts/typeorm';
import { UserMeta } from './UserMeta';
export declare class User extends AccountsUser {
  static meta(id: string): Promise<UserMeta>;
  id: string;
}
