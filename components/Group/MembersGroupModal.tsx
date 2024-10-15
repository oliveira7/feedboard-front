import React, { useState } from 'react';
import { GroupModel } from '@/schema/group.model';
import { TextField, Autocomplete } from '@mui/material';

interface ManageMembersModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  group: GroupModel;
}

const dummyUsers = [
  { id: '1', name: 'Maria Silva' },
  { id: '2', name: 'João Souza' },
  { id: '3', name: 'Ana Oliveira' },
  { id: '4', name: 'Pedro Costa' }
];

export default function ManageMembersModal({ isModalOpen, handleClose, group }: ManageMembersModalProps) {
  const [members, setMembers] = useState<{ _id: string; name: string }[]>(() => {
    return (group.members || []).map(member => 
      typeof member === 'string' ? { _id: member, name: member } : member
    );
  });
  const [newMember, setNewMember] = useState<{ id: string; name: string } | null>(null);

  const handleAddMember = (member: any) => {
    if (!members.find((m) => m._id === member.id)) {
      setMembers([...members, { _id: member.id, name: member.name }]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((member) => member._id !== memberId));
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isModalOpen ? '' : 'hidden'}`}>
      <div className="bg-primary-50 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Gerenciar Membros: {group.name}</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Membros Atuais</h3>
          <ul className="space-y-2">
            {members.map((member, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{member.name}</span>
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <Autocomplete
            options={dummyUsers}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Adicionar membro" variant="outlined" size="small" />
            )}
            onChange={(event, newValue) => {
              setNewMember(newValue);
            }}
          />
          <button
            onClick={() => newMember && handleAddMember(newMember)}
            className="bg-primary-500 text-highlight px-4 py-1 rounded-lg mt-2"
          >
            Adicionar Membro
          </button>
        </div>

        <button
          onClick={handleClose}
          className="bg-gray-500 text-white px-4 py-1 rounded-lg"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
