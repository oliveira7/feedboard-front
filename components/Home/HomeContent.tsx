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

export default function HomeContent() {
  const [user, setUser] = useState<UserModel>();
  const feedRef = useRef<any>(null);
  const { setUserLog } = useGroup();

  const getUser = async () => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Token is undefined');
    }
    const decoded = jwtDecode(token);
    const id = decoded.sub;
    try {
      const response = await getUserById(id!)
      setUser(response);
      setUserLog(response);
    } catch (e) {


    }
  }

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
