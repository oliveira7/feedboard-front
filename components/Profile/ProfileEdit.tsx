'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Avatar, CircularProgress, Snackbar, Alert, Modal, Box } from '@mui/material';
import { UserModel } from '@/schema/user.model';
import Cookies from 'js-cookie';
import { getUserById, updateUser } from '@/api/user-endpoint.service';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';
import { useSnackbar } from '@/context/SnackBarContext';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  zIndex: '15',
};

export default function ProfileEdit({
  modalOpen,
  handleModalClose,
}: {
  modalOpen: boolean;
  handleModalClose: () => void;
}) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { showError } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        const decoded: { sub: string } = jwtDecode(token);
        const id = decoded.sub;
        try {
          const userData = await getUserById(id!);
          setUser(userData);
          setName(userData.name);
          setCourse(userData.course);
          setDescription(userData.description);
          setAvatarPreview(userData.avatar);
        } catch (e: unknown) {
          if (e instanceof Error) {
            setErrorMessage(e.message || 'Erro ao carregar os dados do usuário.');
          }
        }
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError('Por favor, envie um arquivo de imagem válido.');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      let response;
      if (avatarFile) {
        // Se o avatar foi alterado, usar FormData para enviar
        const formData = new FormData();
        formData.append('name', name);
        formData.append('course', course);
        formData.append('description', description);
        formData.append('avatar', avatarFile); // Adiciona o arquivo de imagem

        response = await updateUser(user!._id, formData, true); // Passar FormData
      } else {
        // Se o avatar não foi alterado, enviar como JSON
        response = await updateUser(user!._id, { name, course, description });
      }

      console.log(response);
      if (response) {
        setSnackbarOpen(true);
      }
      handleModalClose();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMessage(e.message || 'Erro ao salvar as alterações.');
      }
    } finally {
      setSaving(false);
      window.location.reload();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <div className="flex flex-col items-center">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full w-32 h-32 mb-2 border-4 border-primary-50 cursor-pointer hover:opacity-70"
                onClick={handleAvatarClick}
              />
            ) : (
              <Avatar
                sx={{ width: 80, height: 80 }}
                onClick={handleAvatarClick}
                className="cursor-pointer"
              >
                {user?.name ? user.name.charAt(0) : 'U'}
              </Avatar>
            )}

            <input
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <h2 className="text-xl font-bold mt-4">Editar Perfil</h2>
          </div>

          <form>
            <TextField
              label="Nome"
              fullWidth
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Curso"
              fullWidth
              variant="outlined"
              margin="normal"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />

            <TextField
              label="Descrição"
              fullWidth
              variant="outlined"
              margin="normal"
              multiline
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Salvar'}
            </Button>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Perfil atualizado com sucesso!
        </Alert>
      </Snackbar>

      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
