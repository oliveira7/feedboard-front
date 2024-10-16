// PostItem.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ThumbUp, Comment, Delete, MoreVert } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { deletePostById, newPost, fetchPosts } from '@/api/post-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import { IconButton, Menu, MenuItem } from '@mui/material';

interface Reply {
  _id: string;
  author: { _id: string; name: string; avatar_base64: string };
  content: string;
  created_at: string;
}

interface Comment {
  _id: string;
  author: { _id: string; name: string; avatar_base64: string };
  content: string;
  created_at: string;
  replies?: Reply[];
  totalChildren?: number;
  replySkip?: number;
  replyLimit?: number;
  hasMoreReplies?: boolean;
  loadingReplies?: boolean;
}

interface Post {
  _id: string;
  author: { _id: string; name: string; avatar_base64: string };
  content: string;
  media: { base64?: string; url?: string; type: 'image' | 'video' }[];
  created_at: string;
  likes: number;
  totalChildren: number;
}

interface PostItemProps {
  post: Post;
  onDelete: () => void;
}

export default function PostItem({ post, onDelete }: PostItemProps) {
  const { _id, author, content, media, created_at, likes, totalChildren = 0 } = post;

  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyToCommentIndex, setReplyToCommentIndex] = useState<number | null>(null);
  const [commentSkip, setCommentSkip] = useState(0);
  const commentLimit = 3;
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const { user } = useGroup();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    loadComments(true);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Load comments with skip and limit
  const loadComments = async (reset = false) => {
    if (loadingComments || !hasMoreComments) return;

    setLoadingComments(true);

    try {
      const currentSkip = reset ? 0 : commentSkip;
      const response = await fetchPosts(commentLimit, currentSkip, _id);

      if (response && response.posts && response.posts.length > 0) {
        const newComments = response.posts.map((comment) => ({
          ...comment,
          replies: [],
          replySkip: 0,
          replyLimit: 5,
          hasMoreReplies: (comment.totalChildren || 0) > 0,
          loadingReplies: false,
        }));

        setCommentList((prevComments) =>
          reset ? newComments : [...prevComments, ...newComments]
        );

        setCommentSkip(currentSkip + commentLimit);

        if (response.posts.length < commentLimit) {
          setHasMoreComments(false);
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

  // Load replies with skip and limit
  const loadReplies = async (commentId: string, commentIndex: number) => {
    const comment = commentList[commentIndex];

    if (comment.loadingReplies || !comment.hasMoreReplies) return;

    const currentSkip = comment.replySkip || 0;
    const replyLimit = comment.replyLimit || 5;

    // Update loading state
    setCommentList((prevComments) => {
      const updatedComments = [...prevComments];
      updatedComments[commentIndex] = {
        ...comment,
        loadingReplies: true,
      };
      return updatedComments;
    });

    try {
      const response = await fetchPosts(replyLimit, currentSkip, commentId);

      if (response && response.posts && response.posts.length > 0) {
        const updatedReplies = comment.replies
          ? [...comment.replies, ...response.posts]
          : response.posts;

        const hasMoreReplies = response.posts.length === replyLimit;

        setCommentList((prevComments) => {
          const updatedComments = [...prevComments];
          updatedComments[commentIndex] = {
            ...comment,
            replies: updatedReplies,
            replySkip: currentSkip + replyLimit,
            hasMoreReplies,
            loadingReplies: false,
          };
          return updatedComments;
        });
      } else {
        // No more replies
        setCommentList((prevComments) => {
          const updatedComments = [...prevComments];
          updatedComments[commentIndex] = {
            ...comment,
            hasMoreReplies: false,
            loadingReplies: false,
          };
          return updatedComments;
        });
      }
    } catch (error) {
      console.error('Erro ao carregar replies:', error);
      // Reset loading state
      setCommentList((prevComments) => {
        const updatedComments = [...prevComments];
        updatedComments[commentIndex] = {
          ...comment,
          loadingReplies: false,
        };
        return updatedComments;
      });
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const newComment = {
        author: user._id,
        parent_id: _id,
        content: commentText,
        pinned: false,
      };

      const response = await newPost(newComment);
      if (response) {
        const newCommentObject: Comment = {
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
          replySkip: 0,
          replyLimit: 5,
          hasMoreReplies: false,
          loadingReplies: false,
        };
        setCommentList((prevComments) => [newCommentObject, ...prevComments]);
        setCommentText('');
        // Reset skip since we added a new comment
        setCommentSkip((prevSkip) => prevSkip + 1);
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  // Handle replying to a comment
  const handleReply = async (commentIndex: number) => {
    if (!replyText.trim()) return;

    const comment = commentList[commentIndex];

    try {
      const newReply = {
        author: user._id,
        parent_id: comment._id,
        content: replyText,
        pinned: false,
      };

      const response = await newPost(newReply);
      if (response) {
        const newReplyObject: Reply = {
          _id: response._id,
          author: {
            _id: user._id,
            name: user.name,
            avatar_base64: user.avatar_base64,
          },
          content: replyText,
          created_at: new Date().toISOString(),
        };

        const updatedReplies = [newReplyObject, ...(comment.replies || [])];

        const updatedComment = {
          ...comment,
          replies: updatedReplies,
          totalChildren: (comment.totalChildren || 0) + 1,
          replySkip: (comment.replySkip || 0) + 1,
          hasMoreReplies: true,
        };

        setCommentList((prevComments) => {
          const updatedComments = [...prevComments];
          updatedComments[commentIndex] = updatedComment;
          return updatedComments;
        });

        setReplyText('');
        setReplyToCommentIndex(null);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  // Handle deleting a post
  const handleDeletePost = async () => {
    try {
      await deletePostById(_id);
      onDelete();
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  // Handle liking a post
  const handleLike = () => {
    setLiked(!liked);
    // Here you can add logic to update likes on the server
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-primary-50 p-4 rounded-lg w-full max-w-xl shadow-md"
    >
      {/* Post Header */}
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            src={author.avatar_base64}
            alt={author.name}
            className="w-10 h-10 rounded-full mr-2"
          />
          <div>
            <h3 className="font-bold">{author.name}</h3>
            <p className="text-sm text-gray-400">
              {`${new Date(created_at).toLocaleDateString()} - ${new Date(
                created_at
              ).toLocaleTimeString()}`}
            </p>
          </div>
        </div>
        {user && user._id === author._id && (
          <div>
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 200,
                  width: '20ch',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleDeletePost();
                  handleClose();
                }}
              >
                <Delete fontSize="small" style={{ marginRight: 8 }} />
                Excluir post
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>

      {/* Post Content */}
      <p className="mb-4">{content}</p>

      {/* Post Media */}
      {media && media.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {media.map((item, idx) => (
            <div key={idx} className="w-full">
              {item.type === 'image' ? (
                <img
                  src={item.url || item.base64}
                  alt="Post media"
                  className="rounded-lg"
                />
              ) : (
                <video controls className="rounded-lg w-full">
                  <source src={item.url || item.base64} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 cursor-pointer" onClick={handleLike}>
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
          <span className="text-highlight">{totalChildren ?? 0}</span>
        </div>
      </div>

      {/* Comments List */}
      {commentList && commentList.length > 0 && (
        <div className="mb-4">
          {commentList.map((comment, index) => (
            <div key={comment._id} className="bg-primary-100 p-2 rounded-lg mb-2">
              <p className="text-sm font-bold text-highlight">{comment.author.name}</p>
              <p className="text-sm">{comment.content}</p>

              {/* Replies List */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-primary-100 p-2 rounded-lg">
                      <p className="text-sm font-bold text-highlight">
                        {reply.author.name}
                      </p>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Replies Button */}
              {comment.hasMoreReplies && (
                <button
                  onClick={() => loadReplies(comment._id, index)}
                  className="text-sm text-highlight mt-1"
                >
                  {comment.loadingReplies ? 'Carregando...' : 'Ver mais respostas'}
                </button>
              )}

              {/* Add Reply Field */}
              {replyToCommentIndex === index ? (
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    placeholder="Escreva uma resposta..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-primary-200 p-2 rounded-lg text-sm outline-none"
                  />
                  <button onClick={() => handleReply(index)} className="text-highlight">
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

          {/* Load More Comments Button */}
          {hasMoreComments && (
            <button
              onClick={() => loadComments(false)}
              className="text-sm text-highlight mt-2"
            >
              {loadingComments ? 'Carregando...' : 'Ver mais comentários'}
            </button>
          )}
        </div>
      )}

      {/* Add Comment Field */}
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
