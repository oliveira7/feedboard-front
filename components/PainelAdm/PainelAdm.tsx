'use client';

import React, { useState } from 'react';
import { TextField, Chip, IconButton, Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { sendInvitations } from '@/api/invitations-endpoint.service';

export default function PainelAdm() {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|br)$/;
    return regex.test(email);
  };

  const extractEmails = (input: string) => {
    const emailRegex = /[^\s@]+@[^\s@]+\.(com|br)/g;
    const matches = input.match(emailRegex);
    return matches ? matches.filter((email) => validateEmail(email)) : [];
  };

  const handleAddEmails = () => {
    const newEmails = extractEmails(emailInput);
    const uniqueEmails = newEmails.filter((email) => !emails.includes(email));
    setEmails([...emails, ...uniqueEmails]);
    setEmailInput('');
  };

  const handleSendInvitations = async () => {
    if (emails.length > 0) {
      setIsLoading(true);
      const response = await sendInvitations(emails);
      if (response) {
        setSuccessMessage('Convites enviados com sucesso!');
      }
      console.log(response);
      setEmails([]);
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <div className='h-screen p-24'>
      <div className='text-center pb-10'>
        <h2 className='text-primary font-bold'>Painel Administrativo - Envio de Emails</h2>
      </div>

      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Digite um email ou vários e-mails"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          variant="outlined"
          fullWidth
          helperText="Digite múltiplos e-mails, separados por espaços ou linha"
        />
        <IconButton color="primary" onClick={handleAddEmails} disabled={!emailInput.trim()}>
          <AddCircleOutline />
        </IconButton>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {emails.map((email, index) => (
          <Chip
            key={index}
            label={email}
            onDelete={() => setEmails(emails.filter((e) => e !== email))}
            color="primary"
          />
        ))}
      </Box>

      <div className='flex justify-center'>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendInvitations}
          disabled={emails.length === 0 || isLoading}
          style={{ marginTop: '1rem', margin: 'auto' }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Enviar Convites'}
        </Button>
      </div>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
