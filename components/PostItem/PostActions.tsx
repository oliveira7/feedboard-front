'use client';

import React, { useState, useEffect } from 'react';
import { ThumbUpAltOutlined, CommentOutlined } from '@mui/icons-material';
import { useGroup } from '@/context/GroupContext';
import { createReaction, deleteReaction } from '@/api/reactions-endpoint.service';

interface PostActionsProps {
  peoplesReacted: { user_id: string; name: string }[];
  totalComments: number;
  postId: string;
}

export default function PostActions({
  peoplesReacted,
  totalComments,
  postId,
}: PostActionsProps) {
  const { toggleExpandComment, user } = useGroup();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(peoplesReacted.length);

  useEffect(() => {
    if (user && peoplesReacted.some((reaction) => reaction.user_id === user._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [peoplesReacted, user]);

  const formatLikes = () => {
    if (likes === 0) {
      return '';
    }

    if (liked) {
      if (likes === 1) {
        return 'Você gostou disso';
      }
      return `Você e ${likes - 1} pessoa(s) gostaram disso`;
    } else {
      if (likes === 1) {
        return '1 pessoa gostou disso';
      }
      return `${likes} pessoas gostaram disso`;
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
      console.error('Error updating reaction:', error);
    }
  };

  return (
    <div className="flex justify-between items-center ml-6 mr-6">
      <div className="flex items-center space-x-1 cursor-pointer" onClick={handleLike}>
        <ThumbUpAltOutlined
          className={`cursor-pointer text-lg ${liked ? 'text-highlight' : ''} hover:text-highlight`}
        />
        {likeMessage && (
          <span className={`${liked ? 'text-highlight' : ''} text-xs`}>
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
