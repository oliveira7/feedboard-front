'use server';

import api from "./api";

export const sendInvitations = async (emails: string[]) => {
  try {
    const response =  await api.post('/invitations/sends', { emails });
    return response.data.data;
  } catch (e: any) {
    console.error(e);
  }
}
