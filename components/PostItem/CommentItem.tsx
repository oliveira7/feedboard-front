import React, { useState, useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MenuOutlined, MoreVert } from '@mui/icons-material';
import { fetchPosts, newPost } from '@/api/post-endpoint.service';
import ReplyList from './ReplyList';
import { UserModel } from '@/schema/user.model';
import { PostModel } from '@/schema/posts.model';
import { getTimeSincePost } from '@/utils/getTimeSincePost';

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
  const [replyPage, setReplyPage] = useState(1);
  const [showReplies, setShowReplies] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const loadReplies = async (reset = false) => {
    if (loadingReplies || !hasMoreReplies) return;

    setLoadingReplies(true);

    try {
      const currentPage = reset ? 1 : replyPage;

      const response = await fetchPosts(currentPage, 5, undefined, comment._id);
      if (response && response.posts) {
        setReplies((prevReplies) =>
          reset ? response.posts : [...prevReplies, ...response.posts]
        );

        if (currentPage >= response.totalPages) {
          setHasMoreReplies(false);
        } else {
          setReplyPage(currentPage + 1);
        }
      } else {
        setHasMoreReplies(false);
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
      const newReplyData = {
        author: user._id,
        parent_id: comment._id,
        content: replyText,
        pinned: false,
      };

      const response = await newPost(newReplyData);
      if (response) {
        setReplies((prevReplies) => [
          ...prevReplies,
          {
            _id: response._id,
            author: {
              _id: user._id,
              name: user.name,
              avatar_base64: user.avatar_base64,
            },
            content: replyText,
            created_at: new Date().toISOString(),
            media: [],
            totalChildren: 0,
            group_id: '',
            parent_id: comment._id,
          },
        ]);
        setReplyText('');
        setShowReplyInput(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar resposta:', error);
    }
  };

  return (
    <div className="bg-primary-50 p-4 rounded-lg mb-4 shadow-md">
      <div className="flex w-full space-x-4">
        <div className="flex items-start space-x-3 w-full justify-between">
          <div className='flex items-center'>
            {comment.author.avatar_base64 && (
            <img
              src={comment.author.avatar_base64}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full"
            />
          )}
            <div className="text-sm font-bold text-highlight ml-2">{comment.author.name}</div>
          </div>

          <div className="flex">
            <div>
              <div className='flex items-center'>
                <span className="text-xs ">{getTimeSincePost(comment.created_at)}</span>
                {user && user._id === comment.author._id && (
                  <div>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <MenuOutlined style={{
                        width: '15px'
                      }} />
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
              </div></div>
          </div>
        </div>
      </div>
      <div className="text-sm mt-2">{comment.content}</div>

      {showReplies && comment.totalChildren > 0 && <ReplyList replies={replies} user={user} onDeleteReply={onDelete} />}

      {showReplyInput ? (
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
      ) : (
        <div className='flex items-center mt-4 ml-[50px]'>
          <a className="text-sm  mt-1 cursor-pointer hover:text-highlight active:text-highlight" >
            Gostei
          </a>
          <span className='ml-2 mr-2 '>|</span>
          <a
            onClick={() => setShowReplyInput(true)}
            className="text-sm  mt-1 cursor-pointer hover:text-highlight active:text-highlight"
          >
            Responder
          </a>

          {comment.totalChildren > 0 && (
            <>
              <div className="w-1 h-1 bg-gray-300 rounded-full inline-block mx-2 mt-1"></div>
              <span
                className="text-xs  mt-1 cursor-pointer  hover:text-highlight active:text-highlight"
                onClick={() => {
                  setShowReplies(!showReplies);
                  if (!showReplies) loadReplies();
                }}
              >
                {`${comment.totalChildren} respostas`}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
