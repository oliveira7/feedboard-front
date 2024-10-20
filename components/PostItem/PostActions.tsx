'use client';

import React from 'react';
import { ThumbUpAltOutlined, CommentOutlined } from '@mui/icons-material';
import { useGroup } from '@/context/GroupContext';

interface PostActionsProps {
  likes: number;
  liked: boolean;
  onLike: () => void;
  totalComments: number;
  postId: string;
}

export default function PostActions({
  likes,
  liked,
  onLike,
  totalComments,
  postId,
}: PostActionsProps) {
  const { expandedCommentsByPost, toggleExpandComment } = useGroup();

  const formatLikes = () => {
    if (liked) {
      if (likes === 0) return 'Você gostou disso';
      if (likes === 1) return 'Você e 1 pessoa gostaram disso';
      return `Você e ${likes} pessoas gostaram disso`;
    } else {
      if (likes === 0) return ''; 
      if (likes === 1) return '1 pessoa gostou disso';
      return `${likes} pessoas gostaram disso`;
    }
  };

  const likeMessage = formatLikes();

  return (
    <div className="flex justify-between items-center ml-6 mr-6">
      <div className="flex items-center space-x-1 cursor-pointer" onClick={onLike}>
        <ThumbUpAltOutlined
          className={`cursor-pointer text-lg ${
            liked ?? 'text-highlight'
          } hover:text-highlight`}
        />
        {likeMessage && (
          <span className={`${liked ?? 'text-highlight'} text-sm`}>
            {likeMessage}
          </span>
        )}
      </div>

      <div
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => toggleExpandComment(postId)}
      >
        <CommentOutlined className="text-highlight" />
        <span className="text-highlight">{totalComments ?? 0}</span>
      </div>
    </div>
  );
}
