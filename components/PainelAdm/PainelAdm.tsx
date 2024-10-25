'use client';

import React, { useState } from 'react';
import { TextField, Chip, IconButton, Box } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

export default function PainelAdm() {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  const handleAddEmail = () => {
    if (emailInput && validateEmail(emailInput) && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]);
      setEmailInput('');
    }
  };

  const handleDeleteEmail = (emailToDelete: string) => {
    setEmails(emails.filter(email => email !== emailToDelete));
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddEmail();
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <h2>Painel Administrativo - Envio de Emails</h2>
      
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Digite um email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          fullWidth
          helperText={emailInput && !validateEmail(emailInput) ? 'Email inválido' : ''}
        />
        <IconButton color="primary" onClick={handleAddEmail}>
          <AddCircleOutline />
        </IconButton>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {emails.map((email, index) => (
          <Chip
            key={index}
            label={email}
            onDelete={() => handleDeleteEmail(email)}
            color="primary"
          />
        ))}
      </Box>
    </Box>
  );
}
