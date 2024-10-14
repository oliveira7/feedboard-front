'use client';

import React, { useState } from "react";
import { Modal, Box, Button, IconButton, TextField, Avatar, MenuItem, FormControl, Select, InputAdornment } from "@mui/material";
import { EmojiEmotions, Add, Close } from "@mui/icons-material";
import Picker from 'emoji-picker-react';
import { newPost } from "@/api/post-endpoint.service";
import { CreatePostModel } from "../../schema/posts.model";
import { useGroup } from "@/context/GroupContext";
import Image from "next/image";
import { GroupModel } from "@/schema/group.model";

export default function NewPubli() {
  const [openModal, setOpenModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [media, setMedia] = useState<{ base64: string; type: 'image' | 'video' }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { user, setAtualizarFeed, selectedGroupList, groupsContext } = useGroup();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEmojiClick = (emojiObject: any) => {
    setPostText(prevText => prevText + emojiObject.emoji);
    setShowEmojis(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setMedia([{ base64: base64String, type: 'image' }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = async () => {
    const post: CreatePostModel = {
      user_id: user._id,
      content: postText,
      media: media.length ? media : undefined,
      group_id: selectedGroup || undefined,
    };

    try {
      const response = await newPost(post);
      setAtualizarFeed(true);
      setPostText('');
      setMedia([]);
      setOpenModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center p-4 bg-primary-50 rounded-lg shadow-md">
      {user && user?.avatar_url ? (
        <Image
          src={user?.avatar_url}
          alt="Profile"
          className="rounded-full w-20 h-20 mb-4"
          width={40}
          height={40}
        />
      ) : (
        <Avatar sx={{ width: 40, height: 40 }}>
          {user && user.name ? user.name.charAt(0) : 'U'}
        </Avatar>
      )}
      <div
        className="bg-primary-100 text-gray-400 p-2 w-full rounded-lg cursor-pointer"
        onClick={handleOpenModal}
      >
        Comece uma publicação
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-publicacao"
        aria-describedby="modal-publicacao-descricao"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-highlight">Nova Publicação</h2>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </div>

          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              id="outlined-multiline-static"
              label="Sobre o que você quer falar?"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <FormControl variant="outlined" fullWidth>
                      <Select
                        value={selectedGroup || ''}
                        onChange={(e) => setSelectedGroup(e.target.value as string)}
                        displayEmpty
                        sx={{
                          minWidth: '120px',
                          height: '40px',
                          borderRadius: '4px',
                        }}
                      >
                        <MenuItem value="">
                          <em>Nenhum</em>
                        </MenuItem>
                        {groupsContext?.map((group: GroupModel) => (
                          <MenuItem key={group._id} value={group._id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <IconButton onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiEmotions />
              </IconButton>

              {showEmojis && (
                <div className="absolute mt-10">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <IconButton component="label">
                <Add />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </IconButton>
            </div>

            <Button
              variant="contained"
              disabled={!postText.trim() && media.length === 0}
              onClick={createPost}
            >
              Publicar
            </Button>
          </div>

          {media.length > 0 && (
            <div className="mt-4">
              <img
                src={media[0].base64}
                alt="Preview"
                className="max-h-40 rounded-lg"
              />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
