'use client';

import HomeContent from '@/components/Home/HomeContent'
import { GroupProvider } from '@/context/GroupContext'
import React from 'react'


export default function Home() {
    return (
        <>
            <GroupProvider>
                <HomeContent />
            </GroupProvider>
        </>
    )
}
