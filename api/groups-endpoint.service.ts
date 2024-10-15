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
        console.log(response);
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