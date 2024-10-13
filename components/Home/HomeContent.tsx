'use client';

import { getUserById } from '@/api/user-endpoint.service';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import LeftBar from './LeftBar';
import NewPubli from './NewPubli';
import RightBar from './RightBar';
import { UserModel } from '@/schema/user.model';
import { GroupProvider } from '@/context/GroupContext';
import Feed from './Feed';

export default function HomeContent() {
    const [user, setUser] = useState<UserModel>();

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
        } catch (e) {


        }
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <GroupProvider>
            <div className='flex justify-center p-8 bg-primary min-h'>
                <div className='flex gap-8 justify-around w-full pl-20 pr-20'>
                    <LeftBar user={user!} />
                    <div className='w-full'>
                        <div className='pb-4 w-full'>
                            <NewPubli />
                        </div>
                        <div>
                            <Feed />
                        </div>
                    </div>
                    <RightBar />
                </div>
            </div>
        </GroupProvider>
    )
}
