'use server'

import { cookies } from "next/headers";
import api from "./api";
import { UserModel } from "@/schema/user.model";

export const getUserById = async (id: string) => {
    try {
        const response = await api.get('/users/' + id );
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
 }

 export const updateUser = async (id: string, updatedData: Partial<UserModel>) => {
    const response = await api.put(`/users/${id}`, updatedData);
    return response.data;
  };
  