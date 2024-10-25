'use client';

import React, { useState } from "react";
import { Modal, Box, Button, IconButton, TextField, Avatar, FormControl, Skeleton } from "@mui/material";
import { EmojiEmotions, Add, Close } from "@mui/icons-material";
import Picker from 'emoji-picker-react';
import { newPost } from "@/api/post-endpoint.service";
import { useGroup } from "@/context/GroupContext";
import Image from "next/image";

export default function NewPubli() {
  const [openModal, setOpenModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const { user, setAtualizarFeed, selectedGroup } = useGroup();

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEmojiClick = (emojiObject: { emoji: string; }) => {
    setPostText(prevText => prevText + emojiObject.emoji);
    setShowEmojis(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setMediaFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
    }
  };

  const createPost = async () => {
    const formData = new FormData();
    formData.append('author', user._id);
    formData.append('content', postText);

    if (selectedGroup) { 
      formData.append('group_id', selectedGroup);
    }

    if (mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        formData.append('files', file);
      });
    }

    try {
      const response = await newPost(formData);
      console.log(response);
      setAtualizarFeed(true);
      setPostText('');
      setMediaFiles([]);
      setOpenModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-center p-4 bg-primary-50 rounded-lg shadow-md">
      {
        user && user?.avatar ? (
          user?.avatar ? (
            <Image
              src={user?.avatar}
              alt="Profile"
              className="rounded-full w-10 h-10 border-2 border-primary-50 mr-4"
              width={50}
              height={50}
            />
          ) : (
            <Avatar className="rounded-full w-10 h-10 border-2 border-primary-50 mr-4">
              {user && user.name ? user.name.charAt(0) : 'U'}
            </Avatar>
          )
        ) : (
          <Skeleton variant="circular" width={44} height={40} animation="wave" className="rounded-full mr-4"/>
        )
      }

      <div
        className="bg-primary-100 p-2 w-full rounded-lg cursor-pointer text-gray-400"
        onClick={handleOpenModal}
      >
        O que você está pensando? 🤔
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
            />
          </FormControl>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <IconButton onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiEmotions />
              </IconButton>

              {showEmojis && (
                <div className="absolute mt-10" style={{ zIndex: 9999 }}>
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <IconButton component="label">
                <Add />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </IconButton>
            </div>

            <Button
              variant="contained"
              disabled={!postText.trim() && mediaFiles.length === 0}
              onClick={createPost}
            >
              Publicar
            </Button>
          </div>

          {mediaFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {mediaFiles.map((file, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(file)} // Mostrar a pré-visualização da imagem
                  alt={`Preview ${index + 1}`}
                  className="max-h-40 rounded-lg"
                  width={100}
                  height={100}
                />
              ))}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
