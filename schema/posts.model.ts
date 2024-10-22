export interface CreatePostModel {
    author: string, 
    name?: string, 
    avatar_base64?: string;
    group_id?: string;
    content: string;
    media?: { base64: string; type: 'image' | 'video' }[];
}

export interface PostModel {
    _id: string;
    author: {
      _id: string;
      name: string;
      avatar_base64?: string; 
    };
    content: string;
    created_at: string;
    updated_at?: string;
    media?: { base64: string; type: 'image' | 'video' }[]; 
    group_id?: string | null;
    parent_id?: string | null;
    pinned?: boolean;
    totalChildren: number;
  }

export interface UpdatePostModel {
    content?: string;
    media_urls?: { url: string; type: 'image' | 'video' }[];
}



