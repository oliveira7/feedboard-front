'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { GroupModel } from '@/schema/group.model';
import { TextField, Autocomplete, CircularProgress, IconButton } from '@mui/material';
import { getGroupById, updateGroup } from '@/api/groups-endpoint.service';
import { Role, UserModel } from '@/schema/user.model';
import { Star, Close } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { getAll } from '@/api/user-endpoint.service';
import { useGroup } from '@/context/GroupContext';
import { translateRole } from '@/utils/translateRoles';
import { useSnackbar } from '@/context/SnackBarContext';

interface ManageMembersModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  group: GroupModel;
}

export default function ManageMembersModal({ isModalOpen, handleClose, group }: ManageMembersModalProps) {
  const [members, setMembers] = useState<UserModel[]>([]);
  const [newMember, setNewMember] = useState<{ id: string; name: string } | null>(null);
  const [userOptions, setUserOptions] = useState<UserModel[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { user } = useGroup();
  const { showError } = useSnackbar();

  const fetchUsers = async (query: string) => {
    try {
      setLoadingUsers(true);
      const users = await getAll(1, 5, `search=${query}`);
      setUserOptions(users);
      setLoadingUsers(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setLoadingUsers(false);
        showError(e.message || 'Erro ao buscar usuários:');
      }
    }
  };

  const debouncedFetchUsers = useCallback(
    debounce((query: string) => {
      if (query) fetchUsers(query);
    }, 500),
    []
  );

  const updateGroupMembers = async (updatedMembers: UserModel[]) => {
    try {
      const updatedData = { members: updatedMembers };
      await updateGroup(group._id, updatedData);
      setMembers(updatedMembers);
    } catch (e: unknown) {
      if (e instanceof Error) { 
        showError(e.message || 'Erro ao atualizar o grupo:');
      }
    }
  };

  const handleAddMember = async (member: { id: string; name: string; }) => {
    if (!members.find((m) => m._id === member.id)) {
      const updatedMembers = [...members, { _id: member.id, name: member.name }];
      await updateGroupMembers(updatedMembers);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const updatedMembers = members.filter((member) => member._id !== memberId);
    await updateGroupMembers(updatedMembers);
  };

  const fetchGroupById = async () => {
    try {
      const response = await getGroupById(group._id);

      const groupData = Array.isArray(response) ? response[0] : response;

      if (groupData && groupData.members && Array.isArray(groupData.members)) {
        setMembers(groupData.members);
      } else {
        showError('Membros não encontrados na resposta.');
      }
      setLoadingMembers(false);
    } catch (e) {
      if (e instanceof Error) {
        showError(e.message || 'Erro ao buscar os membros do grupo:');
        setLoadingMembers(false);
      } 
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setLoadingMembers(true);
      fetchGroupById();
    }
  }, [isModalOpen]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isModalOpen ? '' : 'hidden'}`}>
      <div className="bg-primary-50 rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-3xl relative mx-4 sm:mx-0">
        <div className="flex justify-end">
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </div>

        <h2 className="text-lg font-bold mb-4 text-center sm:text-left">Gerenciar Membros: {group.name}</h2>

        <div className="mb-4 overflow-auto max-h-60 sm:max-h-80 lg:max-h-[500px]">
          <h3 className="font-semibold mb-2 text-center sm:text-left">Membros Atuais</h3>
          {loadingMembers ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <ul className="space-y-2 sm:space-y-4">
              {members.length > 0 ? (
                members.map((member) => (
                  <li key={member._id} className="flex justify-between items-center p-4 shadow rounded-lg bg-primary-50">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold">{member.name || 'Nome não disponível'}
                        {member._id === group.created_by && (
                          <Star fontSize="small" className="text-yellow-500" />
                        )}
                      </span>
                      <p className="text-sm text-secondary">{translateRole(member.role as Role)}</p>
                      <p className="text-sm text-secondary">{member.course || 'Curso não disponível'}</p>
                    </div>
                    {user._id === group.created_by && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remover
                      </button>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-center">Nenhum membro encontrado.</p>
              )}
            </ul>
          )}
        </div>
        
        {user._id === group.created_by  && (
          <div className="mb-4 flex flex-col items-center w-2/4">
            <Autocomplete
              options={userOptions}
              getOptionLabel={(option) => option.name}
              loading={loadingUsers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Adicionar membro"
                  variant="outlined"
                  size="small"
                  fullWidth
                  onChange={(e) => debouncedFetchUsers(e.target.value)}
                />
              )}
              onChange={(event, newValue) => {
                setNewMember(newValue ? { id: newValue._id, name: newValue.name } : null);
              }}
            />
            <button
              onClick={() => newMember && handleAddMember(newMember)}
              className="bg-primary-500 text-highlight px-4 py-1 rounded-lg mt-2 w-full sm:w-auto"
            >
              Adicionar Membro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
