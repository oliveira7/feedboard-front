// ReplyItem.tsx
import { PostModel } from '@/schema/posts.model';
import React from 'react';

interface ReplyItemProps {
  reply: PostModel;
}

export default function ReplyItem({ reply }: ReplyItemProps) {
  return (
    <div className="bg-primary-100 p-2 rounded-lg">
      <p className="text-sm font-bold text-highlight">{reply.author.name}</p>
      <p className="text-sm">{reply.content}</p>
    </div>
  );
}
