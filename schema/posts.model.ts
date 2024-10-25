export interface CreatePostModel {
    author: string, 
    name?: string, 
    avatar?: string;
    group_id?: string;
    content: string;
    media?: { base64: string; type: 'image' | 'video' }[];
}

export interface PostModel {
    _id: string;
    author: {
      _id: string;
      name: string;
      avatar?: string; 
    };
    content: string;
    created_at: string;
    updated_at?: string;
    files?: { url: string; type: 'image' | 'video' }[]; 
    group_id?: string | null;
    parent_id?: string | null;
    pinned?: boolean;
    totalChildren: number;
    totalReaction: number;
    peoplesReacted: { user_id: string; name: string }[];
  }

export interface UpdatePostModel {
    content?: string;
    media_urls?: { url: string; type: 'image' | 'video' }[];
}



