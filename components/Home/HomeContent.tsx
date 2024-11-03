'use client';

import { getUserById } from '@/api/user-endpoint.service';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import LeftBar from './LeftBar';
import NewPubli from './NewPubli';
import RightBar from './RightBar';
import { UserModel } from '@/schema/user.model';
import { useGroup } from '@/context/GroupContext';
import Feed from './Feed';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/context/SnackBarContext';

export default function HomeContent() {
  const [, setUser] = useState<UserModel>();
  const feedRef = useRef(null);
  const { setUserLog } = useGroup();
  const router = useRouter();
  const { showError } = useSnackbar();

  const getUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
      handleLogout();
      return;
    }
    const decoded = jwtDecode(token);
    const id = decoded.sub as string;
    try {
      const response = await getUserById(id);
      setUser(response);
      setUserLog(response);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showError(e.message || 'Erro ao carregar os dados do usuário.');
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex justify-center p-4 md:p-8 bg-primary min-h-screen">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between w-full max-w-7xl">
        
        {/* Left Sidebar (Hidden on small screens) */}
        <div className="hidden md:block w-1/4 order-2 md:order-1">
          <LeftBar />
        </div>

        {/* Main Feed Section with Right Sidebar on small screens */}
        <div className="flex flex-col w-full md:w-2/4 space-y-4 order-1 md:order-2">
          <div className="w-full bg-background-light p-4 rounded-lg shadow-lg">
            <NewPubli />
          </div>
          <div className="w-full bg-background-light p-4 rounded-lg shadow-lg">
            <Feed ref={feedRef} />
          </div>
        </div>

        {/* Right Sidebar (Positioned on top on small screens) */}
        <div className="w-full md:w-1/4 order-1 md:order-3 md:sticky md:top-4">
          <RightBar />
        </div>
      </div>
    </div>
  );
}
