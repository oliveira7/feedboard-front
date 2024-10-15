'use client';

import { useGroup } from '@/context/GroupContext';
import { Avatar, Skeleton } from '@mui/material';
import Image from 'next/image';
import React from 'react';

export default function LeftBar() {
  const { user } = useGroup();

  return (
    <div className="w-full bg-primary-50 rounded-lg shadow-lg p-4 h-fit relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-primary-light to-primary-dark rounded-t-lg"></div>

      <div className="relative flex flex-col items-center mb-6 gap-2 pt-12">
        {user ? (
          <>
            {user?.avatar_base64 ? (
              <Image
                src={user.avatar_base64}
                alt="Profile"
                className="rounded-full w-32 h-32 mb-2 border-4 border-primary-50"
                width={30}
                height={30}
              />
            ) : (
              <Avatar className="border-4 border-primary-50 w-32 h-32">
                {user.name ? user.name.charAt(0) : 'U'}
              </Avatar>
            )}
            <h3 className="text-base font-bold">{user.name}</h3>
            <div>
              <p className="text-xs">🎓 {user.course}</p>
              <p className="text-xs"><i>💬 {user.description}</i></p>
            </div>
          </>
        ) : (
          <Skeleton variant="circular" width={128} height={128} animation="wave" />
        )}
      </div>
    </div>
  );
}
