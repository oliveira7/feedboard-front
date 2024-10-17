import { PostModel } from '@/schema/posts.model';
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { UserModel } from '@/schema/user.model';
import { getTimeSincePost } from '@/utils/getTimeSincePost';

interface ReplyItemProps {
  reply: PostModel;
  user: UserModel;
  onDeleteReply: () => void;
}

export default function ReplyItem({ reply, user, onDeleteReply }: ReplyItemProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <div className="bg-primary-100 p-2 rounded-lg flex items-start space-x-2 justify-between">
      {/* Avatar do autor da resposta */}
      <div className="flex items-start space-x-2">
        {reply.author.avatar_base64 && (
          <img
            src={reply.author.avatar_base64}
            alt={reply.author.name}
            className="w-8 h-8 rounded-full"
          />
        )}

        {/* Conteúdo da resposta */}
        <div className="flex-1">
          <p className="text-sm font-bold text-highlight">{reply.author.name}</p>
          <p className="text-sm mt-2">{reply.content}</p>
        </div>
      </div>

      {/* Tempo e opções de deletar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">{getTimeSincePost(reply.created_at)}</span>

        {/* Opção de excluir resposta (apenas para o autor) */}
        {user && user._id === reply.author._id && (
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
                  onDeleteReply();
                  setAnchorEl(null);
                }}
              >
                Excluir resposta
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
}
