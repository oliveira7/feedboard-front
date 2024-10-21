'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Home, Logout, Person, ArrowDropDown } from '@mui/icons-material';
import { Autocomplete, Avatar, CircularProgress, TextField } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/assets/logo.svg';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useGroup } from '@/context/GroupContext';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { getAll } from '@/api/user-endpoint.service';
import { debounce } from 'lodash';
import { UserModel } from '@/schema/user.model';
import { useSnackbar } from '@/context/SnackBarContext';
import ProfileEdit from '../Profile/ProfileEdit';

export default function Header() {
  const [currentPath, setCurrentPath] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useGroup();
  const [modalOpen, setModalOpen] = useState(false);
  const [userOptions, setUserOptions] = useState<UserModel[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { showError } = useSnackbar();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const fetchUsers = async (query: string) => {
    try {
      setLoadingUsers(true);
      const users = await getAll(1, 5, `search=${query}`);
      setUserOptions(users);
      setLoadingUsers(false);
    } catch (e: any) {
      setLoadingUsers(false);
      showError(e.message);
    }
  };

  const debouncedFetchUsers = useCallback(
    debounce((query: string) => {
      if (query) fetchUsers(query);
    }, 500),
    []
  );

  const handleUserSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: string | UserModel | null,
    reason: any,
    details?: any
  ) => {
    if (value && typeof value !== 'string') {
      router.push(`usuario/${value._id}`);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <header className="bg-gradient-to-br from-primary-dark to-primary-light text-white flex justify-between items-center px-6 py-2 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center max-w-52 max-h-52">
          <Link href="/privado/home">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <div className="flex items-centerrounded-lg px-2 py-1 max-w-xs">
          <Autocomplete
            freeSolo
            options={userOptions}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name) || ''}
            loading={loadingUsers}
            onChange={handleUserSelect}
            onInputChange={(event, newInputValue) => {
              setSearchQuery(newInputValue);
              debouncedFetchUsers(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar"
                sx={{
                  border: 'none',
                  height: '30px', 
                  minHeight: '30px', // Garante que a altura mínima seja aplicada
                  outline: 'none',
                  '& .MuiInputBase-root': { // Ajuste a altura interna
                    height: '30px',
                    minHeight: '30px',
                    padding: '10px', // Remove padding extra
                    fontSize: '12px', // Tamanho do texto
                    border: 'none',
                    outline: 'none',
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  className: "text-sm bg-white",
                  endAdornment: (
                    <>
                      {loadingUsers}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                  startAdornment: <Search />,
                }}
                InputLabelProps={{
                  className: "text-sm",
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="flex space-x-8 items-center">
        <NavItem icon={<Home />} label="Início" href="/privado/home" active={currentPath.includes('/home')} />

        <div className="relative flex items-center space-x-1 cursor-pointer rounded-3xl pr-4 hover:bg-primary-light" 
        onClick={() => setProfileMenuOpen((prev) => !prev)}>
          {user?.avatar_base64 ? (
            <Image
              src={user.avatar_base64}
              alt="Profile"
              className="rounded-full w-10 h-10 border-2 border-primary-50"
              width={100}
              height={100}
            />
          ) : (
            <Avatar alt="User Avatar" className="w-8 h-8" />
          )}
          <div>
            <span className="text-xs text-white">{user ? user.name : ''} </span>
            <ArrowDropDown className="text-white" />
          </div>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-32 w-40 bg-primary rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleModalOpen}
                className="text-secondary block w-full text-left px-4 py-2 text-sm hover:text-highlight"
              >
                <Person />
                Perfil
              </button>
              <button
                onClick={() => {
                  Cookies.remove('token');
                  router.push('/');
                }}
                className="text-secondary block w-full text-left px-4 py-2 text-sm hover:text-highlight"
              >
                <Logout />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <ProfileEdit modalOpen={modalOpen} handleModalClose={handleModalClose} />
    </header>
  );
}

const NavItem = ({ icon, label, href, active }: { icon: React.ReactNode; label: string; href: string; active: boolean }) => {
  const router = useRouter();

  return (
    <div
      className={`relative flex flex-col items-center cursor-pointer transition-colors ${active ? 'text-white' : 'text-neutral'
        } hover:text-white`}
      onClick={() => router.push(href)}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  );
};
