'use server';

import api from "./api";

export const fetchPosts = async (page: number, limit: number, groupId?: string, parentId?: string, type?: string, userId?: string) => {
  try {
    let url = `/posts?page=${page}&limit=${limit}`;

    if (groupId) {
      url += `&groupId=${groupId}`;
    }
    if (parentId) { 
      url += `&parentId=${parentId}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (userId) {
      url += `&userId=${userId}`;	
    }

    const response = await api.get(url);

    if (!response) {
      throw new Error('Erro ao buscar posts');
    }

    return response.data.data;
  } catch (error) {
    console.error('Erro ao carregar os posts:', error);
    return [];
  }
};


export const newPost = async (formData: FormData) => {
  try {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Erro ao criar nova publicação:", error);
    return null;
  }
};

export const deletePostById = async (postId: string) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    throw new Error('Erro ao deletar o post');
  }
}

