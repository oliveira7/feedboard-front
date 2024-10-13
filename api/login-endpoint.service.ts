'use server';

import api from "./api";

export const login = async (email: string, password: string) => {
    try {
        console.log(email, password)
        const response = await api.post('/auth/login', { email, password });
        console.log(response);

        return response.data;
    } catch (e: any) {
        return e.response.data;
    }
 }