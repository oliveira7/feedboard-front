'use client';

import { useGroup } from '@/context/GroupContext';
import { Avatar, Divider, Skeleton } from '@mui/material';
import Image from 'next/image';
import React from 'react';

export default function LeftBar() {
  const { user } = useGroup();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 h-fit relative">
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-green-400 to-green-600 rounded-t-lg"></div>

      <div className="relative flex flex-col items-center mb-6 gap-4 pt-16">
        {user ? (
          <>
            {user?.avatar_base64 ? (
              <Image
                src={user.avatar_base64}
                alt="Profile"
                className="rounded-full w-32 h-32 mb-4 border-4 border-white shadow-lg"
                width={128}
                height={128}
              />
            ) : (
              <Avatar className="border-4 border-white w-32 h-32 shadow-lg">
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
          <Skeleton variant="circular" width={128} height={128} animation="wave" />
        )}
      </div>
    </div>
  );
}
