import { User } from '@accounts/typeorm';
export declare class AccessToken {
    id: string;
    name: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: User;
}
