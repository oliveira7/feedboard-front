'use client';

import React, { useState, useEffect } from 'react';
import { CircularProgress, Avatar, Snackbar, Alert, Divider, Skeleton } from '@mui/material';
import { UserModel } from '@/schema/user.model';
import { getUserById } from '@/api/user-endpoint.service';
import Image from 'next/image';
import Feed from '../Home/Feed';

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
      } catch (e: unknown) {
        if (e instanceof Error) {
          setErrorMessage(e.message || 'Erro ao carregar os dados do usuário.');
        }
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
    <div className="flex flex-col justify-around md:flex-row items-start min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-lg shadow-lg p-4 mb-4 md:mb-0">
        <div className="relative w-full h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-t-lg"></div>

        <div className="relative flex flex-col items-center mb-4 gap-4 pt-12">
          {user ? (
            <>
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  className="rounded-full w-32 h-32 mb-4 border-4 border-white shadow-lg"
                  width={128}
                  height={128}
                />
              ) : (
                <Avatar className="border-4 border-white w-32 h-32 shadow-lg" 
                sx={{
                  width: 128,
                  height: 128,
                }}>
                  {user.name ? user.name.charAt(0) : 'U'}
                </Avatar>
              )}

              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.course}</p>
              </div>

              <Divider className="bg-gray-300 w-full my-4" />

              <div className="px-4 py-2 bg-gray-100 rounded-md shadow-inner text-center">
                <p className="text-sm text-gray-600 italic">
                  💬 {user.description || 'Sem descrição disponível'}
                </p>
              </div>
            </>
          ) : (
            <Skeleton variant="circular" width={128} height={128} animation="wave" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 bg-background-light p-4 rounded-lg shadow-lg max-w-lg w-full md:max-w-lg">
      <Feed idUserPage={userId} />
      </div>
      <div>
        {''}
      </div>
    </div>
  );
}
