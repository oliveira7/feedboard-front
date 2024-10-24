'use server';

import api from "./api";

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });

        return response.data.data;
    } catch (e: any) {
        return e.response.data.data;
    }
 }
