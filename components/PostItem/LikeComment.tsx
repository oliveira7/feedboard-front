'use client';

import React, { useState } from 'react';
import { ThumbUpAltOutlined } from '@mui/icons-material';
import { createReaction, deleteReaction } from '@/api/reactions-endpoint.service';

interface LikeCommentProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export default function LikeComment({ postId, initialLikes, initialLiked }: LikeCommentProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    try {
      if (liked) {
        await deleteReaction(postId);
        setLikes(likes - 1);
      } else {

        await createReaction(postId);
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  return (
    <div className="flex items-center cursor-pointer" onClick={handleLike}>
      <ThumbUpAltOutlined
        className={`text-lg ${liked ? 'text-highlight' : ''} hover:text-highlight`}
      />
      <span className="ml-1 text-sm">{likes} {likes === 1 ? 'curtida' : 'curtidas'}</span>
    </div>
  );
}
