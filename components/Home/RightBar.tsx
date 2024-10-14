'use client';

import { getGroups } from '@/api/groups-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import { GroupModel } from '@/schema/group.model';
import React, { useEffect, useState } from 'react';
import CreateGroupModal from '../Group/CreateGroupModal';

export default function RightBar() {
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setSelectedGroup } = useGroup();

  const getGroupsAsync = async () => {
    try {
      const response = await getGroups();
      console.log(response);
      setGroups(response);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getGroupsAsync();
  }, [setIsModalOpen]);

  return (
    <>
      <div className="w-full bg-primary-50 text-white rounded-lg shadow-lg p-4 h-fit">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-highlight">Feedboard Grupos</h3>
          <ul className="space-y-3">
            {groups.map((item, index) => (
              <li key={index} className="text-sm" onClick={() => setSelectedGroup(item._id)}>
                <a href="#" className="hover:underline font-bold text-white">
                  {item.name}
                </a>
                <p className="text-gray-400">{item.members?.length ?? '0'} • membros</p>
              </li>
            ))}
          </ul>
          <a onClick={() => setIsModalOpen(true)} className="text-highlight-dark hover:underline text-sm mt-3 block cursor-pointer">+ Novo grupo</a>
        </div>
      </div>
      <CreateGroupModal
        isModalOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </>
  );
}