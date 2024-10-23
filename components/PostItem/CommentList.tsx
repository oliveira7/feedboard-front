'use client';

import React, { useState, useEffect } from 'react';
import { fetchPosts, deletePostById, newPost } from '@/api/post-endpoint.service';
import CommentItem from './CommentItem';
import { UserModel } from '@/schema/user.model';
import { PostModel } from '@/schema/posts.model';
import { ExpandMore } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useGroup } from '@/context/GroupContext'; 
import Image from 'next/image';

interface CommentListProps {
  postId: string;
  user: UserModel;
}

export default function CommentList({ postId, user }: CommentListProps) {
  const [comments, setComments] = useState<PostModel[]>([]);
  const [commentText, setCommentText] = useState('');
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  const { expandedCommentsByPost } = useGroup(); 

  const loadComments = async (reset = false) => {
    if (loadingComments || !hasMoreComments) return;

    setLoadingComments(true);

    try {
      const currentPage = reset ? 1 : page;
      const response = await fetchPosts(currentPage, 2, undefined, postId);
      if (response && response.posts) {
        setComments((prev) =>
          reset ? response.posts : [...prev, ...response.posts]
        );

        if (currentPage >= response.totalPages) {
          setHasMoreComments(false);
        } else {
          setPage(currentPage + 1);
        }
      } else {
        setHasMoreComments(false);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deletePostById(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const newCommentData = {
        author: user._id,
        parent_id: postId,
        content: commentText,
        pinned: false,
      };

      const response = await newPost(newCommentData);
      if (response) {
        setComments((prevComments) => [
          ...prevComments,
          {
            _id: response._id,
            author: {
              _id: user._id,
              name: user.name,
              avatar_base64: user.avatar_base64,
            },
            content: commentText,
            created_at: new Date().toISOString(),
            replies: [],
            totalChildren: 0,
          },
        ]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  useEffect(() => { 
    if (expandedCommentsByPost[postId]) {
      loadComments(true);
    } 
  }, [expandedCommentsByPost]);

  return (
    <div>
      {expandedCommentsByPost[postId] && ( 
        <>
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-2 mb-2">
              <div className='w-full'>
                <CommentItem
                  comment={comment}
                  user={user}
                  onDelete={() => handleDeleteComment(comment._id)}
                />
              </div>
            </div>
          ))}

          {hasMoreComments && (
            <div className='w-full flex justify-center ml-2'>
              <button onClick={() => loadComments()} className="text-sm text-gray-200 hover:text-highlight active:text-highlight">
                {loadingComments ? <CircularProgress size={24} /> : <ExpandMore width={100} height={100} />}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-2 mt-4">
            {user?.avatar_base64 && (
              <Image
                src={user?.avatar_base64}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <>
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
            </>
          </div>
        </>
      )}
    </div>
  );
}
