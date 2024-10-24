'use server';

import api from "./api";

export const createReaction = async (postId: string): Promise<any> => { 
    try {
        const response = await api.post('/reactions', { post_id: postId });
        return response.data.data;
    } catch (e: any) {
        return e.response?.data || 'Error creating reaction';
    }
}

export const deleteReaction = async (postId: string): Promise<any> => { 
    try {
        const response = await api.delete(`/reactions/posts/${postId}`);
        return response.data.data;
    } catch (e: any) {
        return e.response?.data || 'Error deleting reaction';
    }
}
