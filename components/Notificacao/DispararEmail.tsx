"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useSnackbar } from "@/context/SnackBarContext";
import { sendInformations } from "@/api/invitations-endpoint.service";

export default function EmailMassivo() {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { showError } = useSnackbar();

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent) {
      setErrorMessage("Por favor, preencha o assunto e o conteúdo do email.");
      return;
    }

    setIsLoading(true);
    try {
      await sendInformations(emailSubject, emailContent);
      setSuccessMessage("Emails enviados com sucesso!");
      setEmailSubject("");
      setEmailContent("");
      setAttachments([]);
      setIsLoading(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showError(e.message || "Erro ao disparar emails.");
      }
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen p-6 sm:p-24 flex flex-col items-center">
      <div className="text-center pb-6 sm:pb-10 w-full">
        <h2 className="text-primary font-bold text-lg sm:text-xl">
          Painel Administrativo - Envio de Email Massivo
        </h2>
      </div>

      <Box className="w-full max-w-md sm:max-w-lg mb-4">
        <TextField
          label="Assunto"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Conteúdo do Email"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          margin="normal"
        />

        <Box mt={2}>
          {attachments.map((file, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderBottom="1px solid #ddd"
              py={1}
            >
              <Typography variant="body2">{file.name}</Typography>
              <IconButton
                onClick={() => handleRemoveAttachment(index)}
                color="secondary"
              >
                ✖
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSendEmail}
        disabled={isLoading}
        style={{ marginTop: "1rem", margin: "auto" }}
        startIcon={<Send />}
      >
        {isLoading ? <CircularProgress size={24} /> : "Enviar Email"}
      </Button>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
