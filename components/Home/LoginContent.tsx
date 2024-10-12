'use client';

import { getUserById } from '@/api/user-endpoint.service';
import { Feed } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import LeftBar from './LeftBar';
import NewPubli from './NewPubli';
import RightBar from './RightBar';
import { UserModel } from '@/schema/user.model';

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
        <div className='flex justify-center gap-8 p-8 bg-primary'>
            <LeftBar user={user!}/>
            <div className='w-3/4'>
                <div className='pb-4'>
                    <NewPubli />
                </div>
                <div>
                    <Feed />
                </div>
            </div>
            <RightBar />
        </div>
    )
}
