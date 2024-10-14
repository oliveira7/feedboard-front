import Header from '@/components/Home/Header'
import HomeContent from '@/components/Home/HomeContent'
import HomeProviderContent from '@/components/Home/HomeProviderContent'
import { GroupProvider } from '@/context/GroupContext'
import React from 'react'


export default function Home() {
    return (
        <>  <Header />
            <HomeProviderContent />
        </>
    )
}
