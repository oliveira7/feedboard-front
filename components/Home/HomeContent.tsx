'use client';

import { getUserById } from '@/api/user-endpoint.service';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react'
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
    const id = decoded.sub;
    try {
      const response = await getUserById(id!)
      setUser(response);
      setUserLog(response);
    } catch (e: any) {
      showError(e.message)
    }
  }

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div className="flex justify-center p-8 bg-primary min-h-screen">
      <div className="flex gap-8 justify-between w-full max-w-7xl">
        <div className="w-1/4">
          <LeftBar />
        </div>

        <div className="flex flex-col w-2/4 space-y-4">
          <div className="w-full bg-background-light p-4 rounded-lg shadow-lg">
            <NewPubli />
          </div>

          <div className="w-full bg-background-light p-4 rounded-lg shadow-lg">
            <Feed ref={feedRef} />
          </div>
        </div>

        <div className="w-1/4">
          <RightBar />
        </div>
      </div>
    </div>
  )
}
