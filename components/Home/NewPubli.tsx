'use client';

import React, { useState } from "react";
import { Modal, Box, Button, IconButton, TextField } from "@mui/material";
import { EmojiEmotions, Add, Close } from "@mui/icons-material";
import Picker from 'emoji-picker-react';

export default function NewPubli() {
  const [openModal, setOpenModal] = useState(false);
  const [postText, setPostText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEmojiClick = (event: any, emojiObject: any) => {
    setPostText(prevText => prevText + emojiObject.emoji);
    setShowEmojis(false);
  };

  return (
    <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md">
      <img 
        src="https://via.placeholder.com/40" 
        alt="Profile" 
        className="rounded-full mr-4"
      />
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
            <h2 className="text-lg font-bold text-primary">Nova Publicação</h2>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </div>

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

              <IconButton>
                <Add />
              </IconButton>
            </div>

            <Button
              variant="contained"
              disabled={!postText.trim()}
              onClick={() => {
                console.log("Postar:", postText);
                setOpenModal(false);
              }}
            >
              Publicar
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
