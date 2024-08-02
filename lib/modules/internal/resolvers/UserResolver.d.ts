import { UserEmail } from '@accounts/typeorm';
import { User } from '../../../entities/User';
import { UserMeta } from '../../../entities/UserMeta';
import { Context } from '../../../interfaces/Context';
import { ConnectionArgs } from '../types/createConnectionType';
import { UpdateUserInput } from '../types/UpdateUserInput';
import { ExtendedConnection } from '../utils/ExtendedConnection';
export declare class UserResolver {
  private readonly userRepository;
  private readonly userMetaRepository;
  private readonly userEmailRepository;
  User(id: string): Promise<User>;
  getUser(context: Context): Promise<{
    meta: UserMeta;
    ability: import('@casl/ability').RawRule[];
    id: string;
    username: string;
    allServices: import('@accounts/typeorm').UserService[];
    emails: UserEmail[];
    sessions: import('@accounts/typeorm').UserSession[];
    deactivated: boolean;
    createdAt: Date;
    updatedAt: Date;
    services: any;
  }>;
  allUsers(args: ConnectionArgs): ExtendedConnection<User>;
  createPrimeUser(
    email: string,
    maybePassword: string,
    profile: any
  ): Promise<boolean>;
  changeEmail(
    password: string,
    email: string,
    context: Context
  ): Promise<boolean>;
  updateUser(
    id: string,
    input: UpdateUserInput,
    context: Context
  ): Promise<User>;
  removeUser(
    id: string, //
    context: Context
  ): Promise<boolean>;
  email(user: User): Promise<string>;
  roles(user: User): Promise<string[]>;
  ability(context: Context): import('@casl/ability').RawRule[];
  meta(user: User): Promise<UserMeta>;
}
