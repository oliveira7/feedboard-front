'use client';

import React from 'react'
import HomeContent from './HomeContent'
import { GroupProvider } from '@/context/GroupContext';

export default function HomeProviderContent() {
  return (
    <>
      <GroupProvider>
        <HomeContent />
      </GroupProvider>
    </>
  )
}
