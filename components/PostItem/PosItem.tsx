// PostItem.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbUp, Comment, MoreVert, MenuOutlined } from '@mui/icons-material';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { deletePostById } from '@/api/post-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import CommentList from './CommentList';
import PostActions from './PostActions';
import { PostModel } from '@/schema/posts.model';
import { getTimeSincePost } from '@/utils/getTimeSincePost';

interface PostItemProps {
  post: PostModel;
  onDelete: () => void;
}

export default function PostItem({ post, onDelete }: PostItemProps) {
  const { _id, author, content, media, created_at, totalChildren } = post;
  const [liked, setLiked] = useState(false);
  const { user } = useGroup();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Chamar API de curtida
  };

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
      className="bg-primary-50 p-6 rounded-lg w-full max-w-xl shadow-md"
    >
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            src={author.avatar_base64}
            alt={author.name}
            className="w-10 h-10 rounded-full mr-2"
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

      {media && media.length > 0 && (
        <div className="flex space-x-2 mb-4">
          {media.map((item, idx) => (
            <div key={idx} className="w-full">
              {item.type === 'image' ? (
                <img
                  src={item.base64}
                  alt="Post media"
                  className="rounded-lg"
                />
              ) : (
                <video controls className="rounded-lg w-full">
                  <source src={item.base64} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      <PostActions
        likes={0}
        liked={liked}
        onLike={handleLike}
        totalComments={totalChildren}
        postId={_id}
      />

      <CommentList postId={_id} user={user} />
    </motion.div>
  );
}
