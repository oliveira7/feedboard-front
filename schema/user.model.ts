export interface UserModel {
    _id: string;
    name: string;
    email: string;
    password_hash: string;
    description: string;
    course: string;
    avatar_url?: string;
    notifications: any[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}