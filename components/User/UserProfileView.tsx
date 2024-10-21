'use client';

import React, { useState, useEffect } from 'react';
import { CircularProgress, Avatar, Snackbar, Alert, Box } from '@mui/material';
import { UserModel } from '@/schema/user.model';
import Cookies from 'js-cookie';
import { getUserById } from '@/api/user-endpoint.service';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';

interface UserProfileViewProps { 
    userId: string;
}

export default function UserProfileView({ userId }: UserProfileViewProps) {
  const [user, setUser] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (error) {
        setErrorMessage('Erro ao carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (errorMessage) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col items-center">
      {user?.avatar_base64 ? (
        <Image
          src={user.avatar_base64}
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full w-32 h-32 mb-2 border-4 border-primary-50"
        />
      ) : (
        <Avatar sx={{ width: 80, height: 80 }}>
          {user?.name ? user.name.charAt(0) : 'U'}
        </Avatar>
      )}

      <h2 className="text-xl font-bold mt-4">{user?.name}</h2>
      <p className="text-gray-600">Curso: {user?.course}</p>
      <p className="text-gray-600">Descrição: {user?.description}</p>
    </div>
  );
}
