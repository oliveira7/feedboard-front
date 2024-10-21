'use client';

import { GroupProvider } from '@/context/GroupContext'
import React from 'react'
import HomeContent from './HomeContent'
import Header from './Header';
import { SnackbarProvider } from '@/context/SnackBarContext';

export default function HomeProviderContent() {
  return (
    <>
      <HomeContent />
    </>
  )
}
