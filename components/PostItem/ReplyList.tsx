// ReplyList.tsx
import React from 'react';
import ReplyItem from './ReplyItem';
import { PostModel } from '@/schema/posts.model';

interface ReplyListProps {
  replies: PostModel[];
}

export default function ReplyList({ replies }: ReplyListProps) {
  return (
    <div className="ml-4 mt-2 space-y-2">
      {replies.map((reply) => (
        <ReplyItem key={reply._id} reply={reply} />
      ))}
    </div>
  );
}
