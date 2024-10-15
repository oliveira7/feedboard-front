'use client';

import { getGroups, getGroupsByUser } from '@/api/groups-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import { GroupModel } from '@/schema/group.model';
import React, { useEffect, useState } from 'react';
import CreateGroupModal from '../Group/CreateGroupModal';
import ManageMembersModal from '../Group/MembersGroupModal';

export default function RightBar() {
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);

  const { setSelectedGroup: setContextGroup, selectedGroup: selectedGroupFromContext, setGroupsContext } = useGroup();

  const getGroupsAsync = async () => {
    try {
      const response = await getGroupsByUser();
      setGroups(response);
      setGroupsContext(response);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getGroupsAsync();
  }, [isCreateGroupModalOpen]);

  const openMembersModal = (group: GroupModel) => {
    setSelectedGroup(group);
    setIsMembersModalOpen(true);
  };

  return (
    <>
      <div className="w-full bg-primary-50 text-white rounded-lg shadow-lg p-4 h-fit">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-highlight">Feedboard Grupos</h3>
          <ul className="space-y-3">
            {groups.map((item, index) => (
              <li key={index} className="text-sm" onClick={() => setContextGroup(item._id)}>
                <a
                  className={`hover:underline font-bold cursor-pointer ${
                    selectedGroupFromContext === item._id ? 'text-highlight' : 'text-white'
                  }`}
                >
                  {item.name}
                </a>
                <p className="text-gray-400">{item.members?.length ?? '0'} • membros</p>
                <button
                  onClick={() => openMembersModal(item)}
                  className="text-highlight-dark text-xs hover:underline"
                >
                  Gerenciar membros
                </button>
              </li>
            ))}
          </ul>
          <a
            onClick={() => setIsCreateGroupModalOpen(true)}
            className="text-highlight-dark hover:underline text-sm mt-3 block cursor-pointer"
          >
            + Novo grupo
          </a>
        </div>
      </div>

      <CreateGroupModal
        isModalOpen={isCreateGroupModalOpen}
        handleClose={() => setIsCreateGroupModalOpen(false)}
      />

      {selectedGroup && (
        <ManageMembersModal
          isModalOpen={isMembersModalOpen}
          handleClose={() => setIsMembersModalOpen(false)}
          group={selectedGroup}
        />
      )}
    </>
  );
}
