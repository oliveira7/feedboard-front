'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import { fetchPosts, newPost } from '@/api/post-endpoint.service';
import ReplyList from './ReplyList';
import { UserModel } from '@/schema/user.model';
import { PostModel } from '@/schema/posts.model';
import { getTimeSincePost } from '@/utils/getTimeSincePost';
import LikeComment from './LikeComment';

interface CommentItemProps {
  comment: PostModel;
  user: UserModel;
  onDelete: () => void;
}

export default function CommentItem({ comment, user, onDelete }: CommentItemProps) {
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState<PostModel[]>([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [limit, setLimit] = useState(5);
  const [showReplies, setShowReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const loadReplies = async (reset = false, customLimit: number | null = null) => {
    if (loadingReplies) return;

    setLoadingReplies(true);

    try {
      const currentLimit = reset ? 5 : customLimit || limit;

      const response = await fetchPosts(1, currentLimit, undefined, comment._id);
      if (response && response.posts) {
        const newReplies = response.posts;

        setReplies(reset ? newReplies : [...replies, ...newReplies]);

        if (newReplies.length < currentLimit) {
          setHasMoreReplies(false);
        }
      } 
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim()) return;

    try {
      const formData = new FormData();
      formData.append('author', user._id);
      formData.append('parent_id', comment._id);
      formData.append('content', replyText);
      formData.append('pinned', 'false');

      const response = await newPost(formData);
      if (response) {
        const newReply: PostModel = {
          _id: response._id,
          author: {
            _id: user._id,
            name: user.name,
            avatar: user?.avatar,
          },
          content: replyText,
          created_at: new Date().toISOString(),
          files: [],
          totalChildren: 0,
          group_id: '',
          parent_id: comment._id,
          totalReaction: 0,
          peoplesReacted: []
        };

        setReplies((prevReplies) => [newReply, ...prevReplies]);

        comment.totalChildren += 1;

        if (replies.length + 1 >= comment.totalChildren) {
          setHasMoreReplies(false);
        }

        setReplyText('');
        setShowReplyInput(false);
        setShowReplies(true);

        setLimit((prevLimit) => prevLimit + 1);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  return (
    <div className="bg-primary-50 p-4 rounded-lg mb-4 shadow-md">
      <div className="flex w-full space-x-4">
        <div className="flex items-start space-x-3 w-full justify-between">
          <div className="flex items-center">
            {comment.author.avatar && (
              <img
                src={comment?.author?.avatar}
                alt={comment?.author?.name}
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
            )}
            <div className="text-sm font-bold text-highlight ml-2">
              {comment.author.name}
            </div>
          </div>

          <div className="flex">
            <div>
              <div className="flex items-center">
                <span className="text-xs ">
                  {getTimeSincePost(comment.created_at)}
                </span>
                {user && user._id === comment.author._id && (
                  <div>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <MenuOutlined style={{ width: '15px' }} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem
                        onClick={() => {
                          onDelete();
                          setAnchorEl(null);
                        }}
                      >
                        Excluir comentário
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm mt-2">{comment.content}</div>

      <div className="flex items-center mt-4 ml-[50px]">
        <LikeComment
          postId={comment._id}
          peoplesReacted={comment.peoplesReacted}
          initialLikes={comment.peoplesReacted.length || 0}
          initialLiked={0 || false}
          userId={user._id}
        />
        <span className="ml-2 mr-2">|</span>
        <a
          onClick={() => setShowReplyInput(true)}
          className="text-xs mt-1 cursor-pointer hover:text-highlight active:text-highlight"
        >
          Responder
        </a>

        {(comment.totalChildren > 0 || replies.length > 0) && (
          <>
            <div className="w-1 h-1 bg-gray-300 rounded-full inline-block mx-2 mt-1"></div>
            <span
              className="text-xs mt-1 cursor-pointer hover:text-highlight active:text-highlight"
              onClick={() => {
                setShowReplies(!showReplies);
                if (!showReplies) {
                  setLimit(5);
                  setHasMoreReplies(true);
                  loadReplies(true, 5);
                }
              }}
            >
              {`${comment.totalChildren} resposta(s)`}
            </span>
          </>
        )}
      </div>

      {showReplyInput && (
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            placeholder="Escreva uma resposta..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-primary-100 p-2 rounded-lg text-sm outline-none"
          />
          <button onClick={handleAddReply} className="text-highlight">
            Responder
          </button>
        </div>
      )}

      {showReplies && (
        <div className="mt-4">
          {replies.length > 0 && (
            <ReplyList replies={replies} user={user} onDeleteReply={onDelete} />
          )}
          {hasMoreReplies && !loadingReplies && (
            <button
              onClick={() => {
                const newLimit = limit + 5;
                setLimit(newLimit);
                loadReplies(false, newLimit);
              }}
              className="text-highlight text-sm mt-2"
            >
              Carregar mais respostas
            </button>
          )}
          {loadingReplies && (
            <div className="text-sm text-gray-500 mt-2">Carregando respostas...</div>
          )}
        </div>
      )}
    </div>
  );
}
