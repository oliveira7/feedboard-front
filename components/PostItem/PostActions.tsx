// PostActions.tsx
import React from 'react';
import { ThumbUp, Comment } from '@mui/icons-material';

interface PostActionsProps {
  likes: number;
  liked: boolean;
  onLike: () => void;
  totalComments: number;
}

export default function PostActions({
  likes,
  liked,
  onLike,
  totalComments,
}: PostActionsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-1 cursor-pointer" onClick={onLike}>
        <ThumbUp
          className={`cursor-pointer text-lg ${
            liked ? 'text-highlight' : 'text-gray-200'
          } hover:text-highlight`}
        />
        <span className={`${liked ? 'text-highlight' : 'text-gray-200'}`}>
          {liked ? likes + 1 : likes}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <Comment className="text-highlight" />
        <span className="text-highlight">{totalComments ?? 0}</span>
      </div>
    </div>
  );
}
