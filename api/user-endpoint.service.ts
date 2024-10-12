'use server'

import { cookies } from "next/headers";
import api from "./api";

export const getUserById = async (id: string) => {
    try {
        const response = await api.get('/users/' + id );
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.error(e);
    }
 }