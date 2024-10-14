'use client';

import React, { useState } from 'react';
import { ThumbUp, Comment, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { deletePostById, newPost } from '@/api/post-endpoint.service';
import { useGroup } from '@/context/GroupContext';

interface Reply {
  _id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Comment {
  _id: string;
  user_id: string;
  content: string;
  created_at: string;
  replies?: Reply[];
}

interface Post {
  _id: string;
  user_id: { _id: string, name: string, avatar_url: string };
  content: string;
  media: { base64?: string; url?: string; type: 'image' | 'video' }[];
  created_at: string;
  likes: number;
  comments: Comment[];
}

export default function PostItem({ post, onDelete }: { post: Post; onDelete: () => void }) {
  const { _id, user_id, content, media, created_at, likes, comments } = post;

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState(comments);
  const [replyText, setReplyText] = useState('');
  const [replyToCommentIndex, setReplyToCommentIndex] = useState<number | null>(null);
  const { user } = useGroup();

  const handleAddComment = async () => {
    console.log(commentText);
    if (!commentText.trim()) return;
    console.log('passou pelo trim');
    console.log(user);


    try {
      const newComment = {
        user_id: user._id,
        parent_id: _id,
        content: commentText,
        pinned: false,
      };
      console.log(newComment)

      const response = await newPost(newComment);
      console.log(response);

      if (response) {
        setCommentList([...commentList, {
          _id: response._id,
          user_id: user._id,
          content: commentText,
          created_at: new Date().toISOString(),
          replies: [],
        }]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const handleReply = async (index: number) => {
    if (!replyText.trim()) return;

    try {
      const parentCommentId = commentList[index]._id;
      const newReply = {
        user_id: user._id,
        parent_id: parentCommentId,
        content: replyText,
        pinned: false,
      };

      const response = await newPost(newReply);

      if (response) {
        const updatedComments = [...commentList];
        updatedComments[index].replies = updatedComments[index].replies || [];
        updatedComments[index].replies!.push({
          _id: response._id,
          user_id: user._id,
          content: replyText,
          created_at: new Date().toISOString(),
        });

        setCommentList(updatedComments);
        setReplyText('');
        setReplyToCommentIndex(null);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostById(_id);
      onDelete(); 
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };


  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-50 p-4 rounded-lg w-full max-w-xl shadow-md"
    >
      <div className="flex items-center mb-4">
        <img
          src={user_id.avatar_url}
          alt={user_id.name}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <h3 className="font-bold text-gray-600">{user_id.name}</h3>
          <p className="text-sm text-gray-400">{`${new Date(created_at).toLocaleDateString()} - ${new Date(created_at).toLocaleTimeString()}`}</p>
        </div>
                {user && user._id === user_id._id && (
          <button onClick={handleDeletePost} className="text-red-500 hover:text-red-700">
            <Delete /> 
          </button>
        )}
      </div>
      <p className="mb-4">{content}</p>

      {media && media.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {media.map((item, idx) => (
            <div key={idx} className="w-full">
              {item.type === 'image' ? (
                <img src={item.url || item.base64} alt="Post media" className="rounded-lg" />
              ) : (
                <video controls className="rounded-lg w-full">
                  <source src={item.url || item.base64} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 cursor-pointer" onClick={handleLike}>
          <ThumbUp
            className={`cursor-pointer text-lg ${liked ? 'text-highlight' : 'text-gray-200'} hover:text-highlight`}
          />
          <span className={`${liked ? 'text-highlight' : 'text-gray-200'}`}>
            {liked ? likes + 1 : likes}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <Comment className="text-highlight" />
          <span className="text-highlight">{commentList.length}</span>
        </div>
      </div>

      {commentList && commentList.length > 0 && (
        <div className="mb-4">
          {commentList.map((comment, index) => (
            <div key={comment._id} className="bg-primary-100 p-2 rounded-lg mb-2">
              <p className="text-sm font-bold text-highlight">{comment.user_id}</p>
              <p className="text-sm">{comment.content}</p>

              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-primary-100 p-2 rounded-lg">
                      <p className="text-sm font-bold text-highlight">{reply.user_id}</p>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyToCommentIndex === index ? (
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    placeholder="Escreva uma resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-primary-200 p-2 rounded-lg text-sm outline-none"
                  />
                  <button
                    onClick={() => handleReply(index)}
                    className="text-highlight"
                  >
                    Responder
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setReplyToCommentIndex(index)}
                  className="text-sm text-highlight mt-1"
                >
                  Responder
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Campo para adicionar novo comentário */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-primary-100 p-2 rounded-lg text-sm outline-none"
        />
        <button onClick={handleAddComment} className="text-highlight">
          Comentar
        </button>
      </div>
    </motion.div>
  );
}
