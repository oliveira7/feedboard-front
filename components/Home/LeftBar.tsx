'use client';

import { useGroup } from '@/context/GroupContext';
import { Avatar, Divider, Skeleton } from '@mui/material';
import Image from 'next/image';
import React from 'react';

export default function LeftBar() {
  const { user } = useGroup();

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-4 md:p-6 h-fit relative max-w-xs mx-auto md:mx-0">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-br from-green-400 to-green-600 rounded-t-lg"></div>

      <div className="relative flex flex-col items-center mb-6 gap-4 pt-20 md:pt-16">
        {user ? (
          <>
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile"
                className="rounded-full w-24 h-24 md:w-32 md:h-32 mb-4 border-4 border-white shadow-lg"
                width={128}
                height={128}
              />
            ) : (
              <Avatar    
                sx={{
                  width: { xs: 96, md: 128 },
                  height: { xs: 96, md: 128 },
                  border: '4px solid white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                {user.name ? user.name.charAt(0) : 'U'}
              </Avatar>
            )}
            
            <div className="text-center">
              <h3 className="text-md md:text-lg font-bold text-gray-800">{user.name}</h3>
              <p className="text-xs md:text-sm text-gray-500">{user.course}</p>
            </div>

            <Divider className="bg-gray-300 w-full my-2 md:my-4" />

            <div className="px-3 py-2 bg-gray-100 rounded-md shadow-inner w-full text-center">
              <p className="text-xs md:text-sm text-gray-600 italic">
                💬 {user.description || "Sem descrição disponível"}
              </p>
            </div>
          </>
        ) : (
          <>
            <Skeleton variant="circular" width={96} height={96} className="md:w-32 md:h-32" animation="wave" />

            <Skeleton variant="text" width={80} height={24} className="md:w-24 md:h-28" animation="wave" />

            <Skeleton variant="text" width={60} height={16} className="md:w-20 md:h-20" animation="wave" />

            <Divider className="bg-gray-300 w-full my-2 md:my-4" />

            <Skeleton variant="rectangular" width="100%" height={40} className="md:h-60" animation="wave" />
          </>
        )}
      </div>
    </div>
  );
}
