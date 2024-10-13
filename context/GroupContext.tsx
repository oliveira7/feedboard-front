import { UserModel } from '@/schema/user.model';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

const GroupContext = createContext<any>(null);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [user, setUserLog ] = useState<UserModel>(); 


  return (
    <GroupContext.Provider value={{ selectedGroup, setSelectedGroup, user, setUserLog }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
}
