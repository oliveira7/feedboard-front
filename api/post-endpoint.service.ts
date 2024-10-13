// services/postService.ts
'use server';

import { CreatePostModel } from "@/schema/posts.model";
import api from "./api";

const mockPosts = [
  {
    _id: "1",
    user_id: {
      _id: "1",
      name: "João Silva",
      avatar_url: "https://via.placeholder.com/40",
    },
    content: "Este é um exemplo de publicação no feed.",
    media_urls: [],
    created_at: "2023-10-10T12:34:56.000Z",
    likes: 15,
    comments: [
      { user: "Maria Oliveira", comment: "Muito interessante!" },
      { user: "Carlos Lima", comment: "Gostei da sua publicação!" },
    ],
  },
  {
    _id: "2",
    user_id: {
      _id: "2",
      name: "Maria Oliveira",
      avatar_url: "https://via.placeholder.com/40",
    },
    content: "Hoje eu tive uma experiência incrível na minha viagem!",
    media_urls: [
      {
        url: "https://via.placeholder.com/600x400",
        type: "image",
      },
    ],
    created_at: "2023-10-10T12:34:56.000Z",
    likes: 42,
    comments: [
      { user: "João Silva", comment: "Parece incrível!" },
      { user: "Ana Pereira", comment: "Que lugar lindo!" },
    ],
  },
  {
    _id: "3",
    user_id: {
      _id: "3",
      name: "Carlos Lima",
      avatar_url: "https://via.placeholder.com/40",
    },
    content: "Alguém mais está acompanhando a série nova?",
    media_urls: [],
    created_at: "2023-10-10T12:34:56.000Z",
    likes: 23,
    comments: [
      { user: "Roberto Souza", comment: "Sim, estou adorando!" },
    ],
  },
  {
    _id: "4",
    user_id: {
      _id: "4",
      name: "Ana Pereira",
      avatar_url: "https://via.placeholder.com/40",
    },
    content: "Eu acabei de publicar meu novo artigo, dê uma olhada!",
    media_urls: [
      {
        url: "https://via.placeholder.com/600x400",
        type: "image",
      },
    ],
    created_at: "2023-10-11T14:00:00.000Z",
    likes: 8,
    comments: [
      { user: "Carlos Lima", comment: "Parabéns pelo artigo!" },
      { user: "João Silva", comment: "Vou dar uma olhada!" },
    ],
  },
  {
    _id: "5",
    user_id: {
      _id: "5",
      name: "Roberto Souza",
      avatar_url: "https://via.placeholder.com/40",
    },
    content: "Gostaria de compartilhar minha opinião sobre o mercado de tecnologia.",
    media_urls: [],
    created_at: "2023-10-11T15:00:00.000Z",
    likes: 30,
    comments: [
      { user: "Ana Pereira", comment: "Concordo com você!" },
      { user: "Maria Oliveira", comment: "Muito bem colocado!" },
    ],
  },
];


export const fetchPosts = async (page: number, limit: number) => {
  try {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    if (!response) {
      throw new Error('Erro ao buscar posts');
    }
    return await response.data;
  } catch (error) {
    console.error('Erro ao carregar os posts:', error);
    return [];
  }
};


  export const newPost = async (post: CreatePostModel) => { 
    try {
      const response = await api.post('/posts', post);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar nova publicação:", error);
      return null;
    }
  }
