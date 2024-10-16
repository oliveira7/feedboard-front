import { UserModel } from "./user.model";

export interface GroupModel {
    _id: string;
    name: string;
    created_by: string;
    members?: UserModel[] | [];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
  }