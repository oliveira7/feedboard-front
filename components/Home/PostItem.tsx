'use client';

import React, { useState } from 'react';
import { ThumbUp, Comment } from '@mui/icons-material';
import { Button } from "@mui/material";
import { motion } from 'framer-motion';

interface Comment {
  user: string;
  comment: string;
  replies?: Comment[];  // Cada comentário pode ter respostas
}

interface Post {
  _id: string;
  user_id: { _id: string, name: string, avatar_url: string };
  content: string;
  media_urls: { url: string, type: 'image' }[];
  created_at: string;
  likes: number;
  comments: Comment[];
}

export default function PostItem({ post }: { post: Post }) {
  const { user_id, content, media_urls, created_at, likes, comments } = post;

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const [replyText, setReplyText] = useState('');
  const [replyToCommentIndex, setReplyToCommentIndex] = useState<number | null>(null);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = { user: "Usuário atual", comment: commentText, replies: [] };
      setCommentList([...commentList, newComment]);
      setCommentText('');
    }
  };

  const handleReply = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    if (replyText.trim()) {
      const updatedComments = [...commentList];
      updatedComments[index].replies = updatedComments[index].replies || [];
      updatedComments[index].replies!.push({ user: "Usuário atual", comment: replyText });
      setCommentList(updatedComments);
      setReplyText('');
      setReplyToCommentIndex(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-50 text-black p-4 rounded-lg w-full max-w-xl shadow-md"
    >
      <div className="flex items-center mb-4">
        <img
          src={user_id.avatar_url}
          alt={user_id.name}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <h3 className="font-bold text-gray-600">{user_id.name}</h3>
          <p className="text-sm text-gray-400">{new Date(created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="mb-4">{content}</p>

      {media_urls.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {media_urls.map((media, idx) => (
            <div key={idx} className="w-full">
              <img src={media.url} alt="Post media" className="rounded-lg" />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 cursor-pointer" onClick={handleLike}
        >
          <ThumbUp
            className={`cursor-pointer text-lg ${liked ? 'text-primary' : 'text-gray-400'} hover:text-primary`} // Aplica hover no ícone
          />
          <span className={`${liked ? 'text-primary' : 'text-gray-400'}`}>
            {liked ? likes + 1 : likes}
          </span>
        </div>


        <div className="flex items-center space-x-1">
          <Comment className="text-primary" />
          <span className="text-primary">{commentList.length}</span>
        </div>
      </div>

      {commentList.length > 0 && (
        <div className="mb-4">
          {commentList.map((comment, index) => (
            <div key={index} className="bg-primary-100 p-2 rounded-lg mb-2">
              <p className="text-sm font-bold text-primary">{comment.user}</p>
              <p className="text-sm text-black">{comment.comment}</p>

              {/* Exibir respostas */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply, replyIndex) => (
                    <div key={replyIndex} className="bg-gray-200 p-2 rounded-lg">
                      <p className="text-sm font-bold text-primary">{reply.user}</p>
                      <p className="text-sm text-black">{reply.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário para responder a um comentário */}
              {replyToCommentIndex === index ? (
                <form onSubmit={(e) => handleReply(e, index)} className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    placeholder="Escreva uma resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-primary-100 p-2 rounded-lg text-sm text-black outline-none"
                  />
                  <button type="submit" className="text-primary">Responder</button>
                </form>
              ) : (
                <button
                  onClick={() => setReplyToCommentIndex(index)}
                  className="text-sm text-primary mt-1"
                >
                  Responder
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAddComment} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-primary-100 p-2 rounded-lg text-sm text-black outline-none"
        />
        <button type="submit" className="text-primary">Comentar</button>
      </form>
    </motion.div>
  );
}
