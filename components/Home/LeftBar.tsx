import { UserModel } from '@/schema/user.model';
import { Avatar, Skeleton } from '@mui/material';
import Image from 'next/image';
import React from 'react';

interface LeftBarProps {
  user: UserModel
}

export default function LeftBar({ user }: LeftBarProps) {
  return (
    <div className="w-64 bg-primary-100 text-black rounded-lg shadow-lg p-4 h-fit">
      <div className="flex flex-col items-center mb-6">
      {user ? (
        <>
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt="Profile"
              className="rounded-full w-20 h-20 mb-4"
              width={80} // Ajuste o tamanho conforme necessário
              height={80}
            />
          ) : (
            <Avatar sx={{ width: 80, height: 80 }}>
              {user.name ? user.name.charAt(0) : 'U'}
            </Avatar>
          )}
          <h3 className="text-lg font-bold text-primary">{user.name}</h3>
          <p className="text-gray-400 text-sm">{user.description}</p>
          <p className="text-gray-400 text-sm">{user.course}</p>
        </>
      ) : (
        <Skeleton variant="circular" width={80} height={80} animation="wave" />
      )}
      </div>

    </div>
  );
}
