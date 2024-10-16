// PostItem.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbUp, Comment, MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { deletePostById } from '@/api/post-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import CommentList from './CommentList';
import PostActions from './PostActions';

interface PostItemProps {
  post: Post;
  onDelete: () => void;
}

export default function PostItem({ post, onDelete }: PostItemProps) {
  const { _id, author, content, media, created_at, likes, totalChildren } = post;
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
      className="bg-primary-50 p-4 rounded-lg w-full max-w-xl shadow-md"
    >
      {/* Cabeçalho do Post */}
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
              {new Date(created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {user && user._id === author._id && (
          <div>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MoreVert />
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

      {/* Conteúdo do Post */}
      <p className="mb-4">{content}</p>

      {/* Mídia do Post */}
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

      {/* Ações do Post */}
      <PostActions
        likes={likes}
        liked={liked}
        onLike={handleLike}
        totalComments={totalChildren}
      />

      {/* Lista de Comentários */}
      <CommentList postId={_id} user={user} />
    </motion.div>
  );
}
