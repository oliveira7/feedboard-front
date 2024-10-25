'use client';

import { getGroupsByUser } from '@/api/groups-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import { GroupModel } from '@/schema/group.model';
import React, { useEffect, useState } from 'react';
import CreateGroupModal from '../Group/CreateGroupModal';
import ManageMembersModal from '../Group/MembersGroupModal';
import { AddCircleOutline, ArrowBack } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { UserModel } from '@/schema/user.model';
import { useSnackbar } from '@/context/SnackBarContext';

export default function RightBar() {
  const [groups, setGroups] = useState<GroupModel[]>([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupModel | null>(null);
  const { user } = useGroup();
  const { showError } = useSnackbar();

  const { setSelectedGroup: setContextGroup, selectedGroup: selectedGroupFromContext, setGroupsContext, setAtualizarFeed } = useGroup();

  const getGroupsAsync = async () => {
    try {
      const response = await getGroupsByUser();
      setGroups(response);
      setGroupsContext(response);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showError(e.message || 'Erro ao buscar grupos');
      }
    }
  };

  useEffect(() => {
    getGroupsAsync();
  }, [isCreateGroupModalOpen]);

  const openMembersModal = (group: GroupModel) => {
    setSelectedGroup(group);
    setIsMembersModalOpen(true);
  };

  const backToFeed = () => {
    setContextGroup(null);
    setAtualizarFeed(true);
  }
  
  const formatMembers = (members: UserModel[]) => { 
    if (members.length > 1) {
      return `${members.length} • membros`
    } else {
      return `Apenas 1 membro`
    }
  }

  return (
    <>
      <div className="w-full bg-primary-50 rounded-lg shadow-lg p-4 h-fit">
        <div className="mb-6">
          <div className="flex items-center w-full justify-between">
            <h3 className="text-lg font-bold text-highlight">Feedboard Grupos</h3>

            <Tooltip title="Novo grupo" arrow>
              <IconButton onClick={() => setIsCreateGroupModalOpen(true)}>
                <AddCircleOutline className="text-highlight" />
              </IconButton>
            </Tooltip>
          </div>
          <hr className="border-primary-100 pt-4 border-gray-300" />

          {groups?.length > 0 ? (
            <ul className="space-y-3">
              {groups.map((item, index) => (
                <li key={index} className="text-sm" onClick={() => setContextGroup(item._id)}>
                  <a
                    className={`hover:underline font-bold cursor-pointer ${selectedGroupFromContext === item._id ? 'text-highlight' : 'text-default'
                      }`}
                  >
                    {item.name}
                  </a>
                  <p className="text-gray-300 text-sx">{formatMembers(item.members || [])}</p>
                  {user?._id === item.created_by && (
                    <button
                      onClick={() => openMembersModal(item)}
                      className="text-highlight-dark text-xs hover:underline"
                    >
                      Gerenciar membros
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-sm text-gray-400 mt-4">
              <p>Poxa, você ainda não entrou em nenhum grupo <span className="text-lg">😔</span></p>
            </div>
          )}
        </div>

        {groups.length > 0 && (
          <div onClick={backToFeed} className="flex cursor-pointer items-center text-sm hover:text-highlight">
            <ArrowBack
              sx={{
                fontSize: 16,
                marginRight: 1,
              }}
            />
            Voltar para o feedboard
          </div>
        )}
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
