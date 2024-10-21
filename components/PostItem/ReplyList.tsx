'use client';

import React from 'react';
import ReplyItem from './ReplyItem';
import { PostModel } from '@/schema/posts.model';
import { UserModel } from '@/schema/user.model';

interface ReplyListProps {
  replies: PostModel[];
  user: UserModel;
  onDeleteReply: (replyId: string) => void;
}

export default function ReplyList({ replies, user, onDeleteReply }: ReplyListProps) {
  return (
    <div className="ml-4 mt-2 space-y-2">
      {replies.map((reply) => (
        <ReplyItem
          key={reply._id}
          reply={reply}
          user={user}
          onDeleteReply={() => onDeleteReply(reply._id)}
        />
      ))}
    </div>
  );
}
