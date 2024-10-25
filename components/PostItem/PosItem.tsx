'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
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
  const { _id, author, content, files, created_at, totalChildren, peoplesReacted } = post;
  const { user } = useGroup();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      style={{ backgroundColor: '#f0f4f8', padding: '1.5rem', borderRadius: '0.5rem', width: '100%', maxWidth: '36rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <Image
            src={author?.avatar || '/default-avatar.png'}
            alt={author?.name}
            className="w-10 h-10 rounded-full mr-2"
            width={40}
            height={40}
          />
          <div>
            <h3 className="font-bold">{author.name}</h3>
          </div>
        </div>
        <div className='flex items-center'>
        <span className="text-sm">
              {getTimeSincePost(created_at)}
            </span>
        {user && user._id === author._id && (
          <div>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MenuOutlined  />
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

      <p className="mb-4 ml-4 mr-4">{content}</p>

      {files && files.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {files.map((item, idx) => (
            <div key={idx} className="w-full">
              {item.type === 'image' ? (
                <Image
                  src={item?.url}
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
