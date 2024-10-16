'use server';

import { GroupModel } from "@/schema/group.model";
import api from "./api";

export const getGroups = async (): Promise<GroupModel[]> => {
    try {
        const response = await api.get('/groups');
        return response.data.data;
    } catch (e: any) {
        return e.response.data.data;
    }
 }

export const createGroup = async (group: any) => { 
    try {
        const response = await api.post('/groups', group);
        return response.data.data;
    } catch (e: any) {
        return e.response.data;
    }
}

export const getGroupsByUser = async (): Promise<GroupModel[]> => {
    try {
        const response = await api.get('/groups');
        return response.data.data;
    } catch (e: any) {
        return e.response.data.data;
    }
 }

 export const getGroupById = async (id: string): Promise<GroupModel> => {
    try {
        const response = await api.get('/groups/' + id);
        return response.data.data;
    } catch (e: any) {
        return e.response.data.data;
    }
 }

 export const updateGroup = async (id: string, updatedData: Partial<GroupModel>) => { 
    try {
        const response = await api.put(`/groups/${id}`, updatedData);
        return response.data.data;
    } catch (e: any) {
        return e.response.data;
    }
 }