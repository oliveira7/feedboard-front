'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Avatar, CircularProgress, Snackbar, Alert } from '@mui/material';
import { UserModel } from '@/schema/user.model';
import Cookies from 'js-cookie';
import { getUserById, updateUser } from '@/api/user-endpoint.service';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';

export default function ProfileEdit() {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para os valores dos campos
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      if (token) {
        const decoded = jwtDecode(token);
        const id = decoded.sub;
        try {
          const userData = await getUserById(id!);
          setUser(userData);
          setName(userData.name);
          setCourse(userData.course);
          setDescription(userData.description);
          setAvatarBase64(userData.avatar_url);
        } catch (error) {
          setErrorMessage('Erro ao carregar os dados do usuário.');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(user!._id, { name, course, description, avatar_url: avatarBase64 });
      setSnackbarOpen(true);
    } catch (error) {
      setErrorMessage('Erro ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="flex flex-col items-center">
          {avatarBase64 ? (
            <Image src={avatarBase64} alt="Profile" width={80} height={80} className="rounded-full" />
          ) : (
            <Avatar sx={{ width: 80, height: 80 }}>
              {user?.name ? user.name.charAt(0) : 'U'}
            </Avatar>
          )}
          <h2 className="text-xl font-bold text-gray-800 mt-4">Editar Perfil</h2>

          {/* Input para upload de imagem */}
          <input
            accept="image/*"
            type="file"
            onChange={handleImageUpload}
            className="mt-2"
          />
        </div>

        <form>
          {/* Nome */}
          <TextField
            label="Nome"
            fullWidth
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Curso */}
          <TextField
            label="Curso"
            fullWidth
            variant="outlined"
            margin="normal"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          {/* Descrição */}
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

          {/* Botão de salvar */}
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
      </div>

      {/* Snackbar para mostrar feedback */}
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

      {/* Snackbar para erros */}
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
    </div>
  );
}
