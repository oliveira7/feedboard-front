import React from 'react';
import UserProfileView from '@/components/User/UserProfileView';
import Header from '@/components/Home/Header';

export default function Usuario({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <Header />
      <UserProfileView userId={id} />
    </>
  );
}
