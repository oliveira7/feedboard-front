'use client';

import { GroupProvider } from '@/context/GroupContext'
import React from 'react'
import HomeContent from './HomeContent'
import Header from './Header';

export default function HomeProviderContent() {
  return (
    <>
      <GroupProvider>
        <Header />
        <HomeContent />
      </GroupProvider>
    </>)
}
