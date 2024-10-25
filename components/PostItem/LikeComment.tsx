'use client';

import React, { useState, useEffect } from 'react';
import { ThumbUpAltOutlined } from '@mui/icons-material';
import { createReaction, deleteReaction } from '@/api/reactions-endpoint.service';

interface LikeCommentProps {
  postId: string;
  peoplesReacted: { user_id: string; name: string }[];
  initialLikes: number;
  initialLiked: boolean;
  userId: string;
}

export default function LikeComment({ postId, peoplesReacted, initialLikes, initialLiked, userId }: LikeCommentProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  useEffect(() => {
    if (peoplesReacted.some((reaction) => reaction.user_id === userId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [peoplesReacted, userId]);

  const formatLikes = () => {
    if (likes === 0) {
      return '';
    }

    if (liked) {
      if (likes === 1) {
        return 'Você curtiu';
      }
      return `Você e mais ${likes - 1} pessoa(s) curtiram`;
    } else {
      if (likes === 1) {
        return '1 pessoa curtiu';
      }
      return `${likes} pessoas curtiram`;
    }
  };

  const likeMessage = formatLikes();

  const handleLike = async () => {
    try {
      if (liked) {
        await deleteReaction(postId);
        setLikes((prevLikes) => Math.max(0, prevLikes - 1));
      } else {
        await createReaction(postId);
        setLikes((prevLikes) => prevLikes + 1);
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
      {likeMessage && (
        <span className={`ml-1 text-sm ${liked ? 'text-highlight' : ''}`}>
          {likeMessage}
        </span>
      )}
    </div>
  );
}
