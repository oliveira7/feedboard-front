'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuOutlined } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { deletePostById } from '@/api/post-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import CommentList from './CommentList';
import PostActions from './PostActions';
import { PostModel } from '@/schema/posts.model';
import { getTimeSincePost } from '@/utils/getTimeSincePost';
import Image from 'next/image';

interface PostItemProps {
  post: PostModel;
  onDelete: () => void;
}

export default function PostItem({ post, onDelete }: PostItemProps) {
  const { _id, author, content, media, created_at, totalChildren, peoplesReacted, pinned } = post;
  const { user } = useGroup();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const handleDeletePost = async () => {
    try {
      await deletePostById(_id);
      onDelete();
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: pinned ? '#E8F5E9' : '#f0f4f8',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '36rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: pinned ? '1px solid #4CAF50' : 'none',
      }}
    >
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          {author?.avatar ? (
            <Image
              src={author.avatar || '/default-avatar.png'}
              alt={author.name}
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
          ) : (
            <Avatar alt="User Avatar" className="w-10 h-10" />
          )}
          <div>
            <h3 className="font-bold pl-2">{author.name}</h3>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-sm">{getTimeSincePost(created_at)}</span>
          {user && user._id === author._id && (
            <div>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MenuOutlined />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    handleDeletePost();
                    setAnchorEl(null);
                  }}
                >
                  Excluir post
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </div>

      <p className="mb-4 ml-4 mr-4">
        {isExpanded || content.length <= MAX_LENGTH ? content : `${content.substring(0, MAX_LENGTH)}...`}
      </p>

      {content.length > MAX_LENGTH && (
        <div className="ml-4 mb-4">
          <a
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold cursor:pointer hover:text-highlight"
          >
            {isExpanded ? 'Ver menos' : 'Ver mais'}
          </a>
        </div>
      )}

      {media && media.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {media.map((item, idx) => (
            <div key={idx} className="w-full">
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt="Post media"
                  className="rounded-lg"
                  width={500}
                  height={500}
                />
              ) : (
                <video controls className="rounded-lg w-full">
                  <source src={item.url} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      <PostActions
        peoplesReacted={peoplesReacted}
        totalComments={totalChildren}
        postId={_id}
      />

      <CommentList postId={_id} user={user} />
    </motion.div>
  );
}
