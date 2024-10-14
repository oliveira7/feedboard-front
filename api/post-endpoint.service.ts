// services/postService.ts
'use server';

import { CreatePostModel } from "@/schema/posts.model";
import api from "./api";

export const fetchPosts = async (page: number, limit: number, group_id?: string) => {
  try {
    let url = `/posts?page=${page}&limit=${limit}`;

    if (group_id) {
      console.log('entrou0');
      url += `&group_id=${group_id}`;
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


  export const newPost = async (post: CreatePostModel) => { 
    try {
      const response = await api.post('/posts', post);
      console.log(response);
      return response.data.data;;
    } catch (error) {
      console.error("Erro ao criar nova publicação:", error);
      return null;
    }
  }

  export const deletePostById = async (postId: string) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      console.log(response)
      return response.data.data;;
    } catch (error) {
      throw new Error('Erro ao deletar o post');
    }
  }
