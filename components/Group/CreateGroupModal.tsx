'use client';

import React, { useState } from 'react';
import { Modal, TextField, Button, CircularProgress } from '@mui/material';
import { useGroup } from '@/context/GroupContext';
import { createGroup } from '@/api/groups-endpoint.service';

interface GroupModel {
  name: string;
  created_by: string;
  password_hash: string;
  role: string;
}

interface CreateGroupModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isModalOpen, handleClose }) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {user} = useGroup();
  const [loading, setLoading ] = useState(false);

  const handleCreateGroup = async () => {
    setLoading(true)
    const groupData: GroupModel = {
      name: groupName,
      created_by: user._id,
      password_hash: user. password_hash,
      role: user.role,
    };

    const response = await createGroup(groupData);

    if (!response) {
      setError(response);
    } else {
      handleClose();
      setGroupName('');
      setError(null);
    }
    setLoading(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <div className="bg-primary-50 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-highlight text-xl mb-4">Criar novo grupo</h2>
        
        <TextField
          label="Nome do Grupo"
          variant="outlined"
          fullWidth
          className="mb-4"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />


        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex justify-center pt-4">
          <Button variant="contained" color="primary" onClick={handleCreateGroup}>
            { loading ? <CircularProgress size={25} /> : 'Criar grupo'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
