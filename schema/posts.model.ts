export interface CreatePostModel {
    author:  { _id: string, name: string, avatar_base64: string };    
    group_id?: string;
    content: string;
    media?: { base64: string; type: 'image' | 'video' }[];
}

export interface PostModel {
    _id: string;
    user_id: {
        _id: string;
        name: string;
        avatar_base64: string;
    };
    content: string;
    media: { url: string; type: 'image' | 'video' }[];
    created_at: string;
    likes: number;
    comments: { user: string; comment: string }[];
}

export interface UpdatePostModel {
    content?: string;
    media_urls?: { url: string; type: 'image' | 'video' }[];
}

// types.ts

export interface Node {
    _id: string;
    author: {
      _id: string;
      name: string;
      avatar_base64: string;
    };
    content: string;
    created_at: string;
    media?: { base64?: string; url?: string; type: 'image' | 'video' }[];
    parent_id: string | null;
    totalChildren: number; // Número total de filhos (comentários ou respostas)
    // Outros campos relevantes, se houver
  }
  
