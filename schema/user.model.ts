export interface UserModel {
    _id: string;
    name: string;
    email?: string;
    password_hash?: string;
    description?: string;
    course?: string;
    avatar_base64?: string;
    notifications?: any[];
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
    role?: string;
}

export enum Role {
    STUDENT = 'student',
    TEACHER = 'teacher',
    COORDINATOR = 'coordinator',
  }
  
export interface CreateUsersModel {
    name: string;
    course?: string;
    description?: string;
    email: string;
    password_hash: string;
    avatar_base64?: string;
    role: string;
  }
  