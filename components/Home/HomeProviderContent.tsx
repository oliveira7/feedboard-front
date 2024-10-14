'use client';

import { GroupProvider } from '@/context/GroupContext'
import React from 'react'
import HomeContent from './HomeContent'

export default function HomeProviderContent() {
  return (
    <>
    <GroupProvider>
        <HomeContent />
    </GroupProvider>
</>  )
}
