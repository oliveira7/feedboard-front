import React from 'react';
import UserProfileView from '@/components/User/UserProfileView';
import Header from '@/components/Home/Header';

export default async function Usuario(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  return (
    <>
      <UserProfileView userId={id} />
    </>
  );
}
