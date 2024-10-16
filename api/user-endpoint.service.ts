'use server'

import { cookies } from "next/headers";
import api from "./api";
import { CreateUsersModel, UserModel } from "@/schema/user.model";

export const getUserById = async (id: string) => {
    try {
        const response = await api.get('/users/' + id);
        return response.data.data;
    } catch (e) {
        console.error(e);
    }
}

export const updateUser = async (id: string, updatedData: Partial<UserModel>) => {
    try {
        const response = await api.put(`/users/${id}`, updatedData);
        return response.data.data;
    } catch (e) {
        console.error(e);
    }
};

export const register = async (crateUser: CreateUsersModel) => {
    try {
        const response = await api.post('/users', crateUser)
        return response.data.data;
    } catch (e) {
        console.error(e)
    }
}

export const getAll = async (page: number, limit: number, queries: any) => { 
    try {
        let url = `/users?page=${page}&limit=${limit}`;

        if (queries) {
            url += `&${queries}`;
        }

        const response = await api.get(url);
        return response.data.data;
    } catch (e) {
        console.error(e);
    }
}
