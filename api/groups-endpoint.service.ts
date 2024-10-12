'use server';

import { GroupModel } from "@/schema/group.model";
import api from "./api";

export const getGroups = async (): Promise<GroupModel[]> => {
    try {
        const response = await api.get('/groups');
        return response.data;
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(e.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
 }