'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Typography,
} from '@mui/material';
import { AttachFile, Send } from '@mui/icons-material';
import { Editor } from '@tinymce/tinymce-react';
import { useSnackbar } from '@/context/SnackBarContext';
// import { sendMassEmail } from '@/api/email-endpoint.service';

export default function EmailMassivo() {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { showError } = useSnackbar();


  const handleAttachmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments([...attachments, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent) {
      setErrorMessage('Por favor, preencha o assunto e o conteúdo do email.');
      return;
    }

    setIsLoading(true);
    try {
      // Lógica para envio do email (descomente e ajuste de acordo com o backend)
      // const response = await sendMassEmail({
      //   subject: emailSubject,
      //   content: emailContent,
      //   attachments,
      // });
      // if (response) {
      //   setSuccessMessage('Email enviado com sucesso!');
      // }
      // Simulando sucesso
      setTimeout(() => {
        setSuccessMessage('Email enviado com sucesso!');
        setEmailSubject('');
        setEmailContent('');
        setAttachments([]);
        setIsLoading(false);
      }, 2000);
    } catch (e: unknown) {
        if (e instanceof Error) {
          showError(e.message || 'Erro ao enviar email, tente novamente.');
        }
      }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
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

        <Typography variant="body2" color="textSecondary" gutterBottom>
          Conteúdo do email:
        </Typography>
        <Editor
          apiKey="ttqmawq6mkv8qzr6zcsb939rarl5rjc77apicawdnfasoc5l"
          value={emailContent}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat',
          }}
          onEditorChange={(content: string) => setEmailContent(content)}
        />

        <Box display="flex" alignItems="center" mt={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<AttachFile />}
            color="primary"
          >
            Anexar Arquivos
            <input
              type="file"
              hidden
              multiple
              onChange={handleAttachmentUpload}
            />
          </Button>
        </Box>

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
        style={{ marginTop: '1rem', margin: 'auto' }}
        startIcon={<Send />}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Enviar Email'}
      </Button>

      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
