'use client';

import React, { useState, useEffect } from 'react';
import { CircularProgress, Avatar, Snackbar, Alert, Divider, Skeleton } from '@mui/material';
import { UserModel } from '@/schema/user.model';
import { getUserById } from '@/api/user-endpoint.service';
import Image from 'next/image';

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
      <div className="flex justify-center items-center min-h-screen">
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 h-fit relative">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 to-green-600 rounded-t-lg"></div>

        <div className="relative flex flex-col items-center mb-6 gap-4 pt-16">
          {user ? (
            <>
              {user.avatar_base64 ? (
                <Image
                  src={user.avatar_base64}
                  alt="Profile"
                  className="rounded-full w-48 h-48 mb-4 border-4 border-white shadow-lg"
                  width={192}
                  height={192}
                />
              ) : (
                <Avatar className="border-4 border-white w-48 h-48 shadow-lg">
                  {user.name ? user.name.charAt(0) : 'U'}
                </Avatar>
              )}

              {/* Informações do usuário */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.course}</p>
              </div>

              {/* Divisor */}
              <Divider className="bg-gray-300 w-full my-4" />

              {/* Descrição */}
              <div className="px-4 py-2 bg-gray-100 rounded-md shadow-inner">
                <p className="text-sm text-gray-600 italic text-center">
                  💬 {user.description || "Sem descrição disponível"}
                </p>
              </div>
            </>
          ) : (
            <Skeleton variant="circular" width={192} height={192} animation="wave" />
          )}
        </div>
      </div>
    </div>
  );
}
