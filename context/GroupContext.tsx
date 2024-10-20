'use client';

import { GroupModel } from '@/schema/group.model';
import { UserModel } from '@/schema/user.model';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

const GroupContext = createContext<any>(null);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [user, setUserLog] = useState<UserModel>();
  const [atualizarFeed, setAtualizarFeed] = useState(false);
  const [groupsContext, setGroupsContext] = useState<GroupModel[]>();
  
  const [expandedCommentsByPost, setExpandedCommentsByPost] = useState<{ [key: string]: boolean }>({});


  const toggleExpandComment = (postId: string) => {
    setExpandedCommentsByPost((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <GroupContext.Provider
      value={{
        selectedGroup,
        setSelectedGroup,
        user,
        setUserLog,
        atualizarFeed,
        setAtualizarFeed,
        groupsContext,
        setGroupsContext,
        expandedCommentsByPost,
        toggleExpandComment,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
}
