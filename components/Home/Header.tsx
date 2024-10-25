'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Home, Logout, Person, ArrowDropDown, PersonOutline, AdminPanelSettingsOutlined } from '@mui/icons-material';
import { Autocomplete, Avatar, TextField } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/assets/logo.svg';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getAll, getUserById } from '@/api/user-endpoint.service';
import { debounce } from 'lodash';
import { Role, UserModel } from '@/schema/user.model';
import { useSnackbar } from '@/context/SnackBarContext';
import ProfileEdit from '../Profile/ProfileEdit';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function Header() {
  const [currentPath, setCurrentPath] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userOptions, setUserOptions] = useState<UserModel[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [, setSearchQuery] = useState('');
  const { showError } = useSnackbar();
  const [user, setUser] = useState<UserModel | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(pathname);
    getUser();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname]);

  const fetchUsers = async (query: string) => {
    try {
      setLoadingUsers(true);
      const users = await getAll(1, 5, `search=${query}`);
      setUserOptions(users);
      setLoadingUsers(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        showError(e.message);
      }
      setLoadingUsers(false);
    }
  };

  const getUser = async () => {
    const token = Cookies.get('token');
    if (token) {
      const decoded: { sub: string } = jwtDecode(token);
      const id = decoded.sub;
      try {
        const response = await getUserById(id);
        setUser(response);
      } catch (e: unknown) {
        if (e instanceof Error) {
          showError(e.message || 'Erro ao carregar os dados do usuário.');
        }
      }
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
  ) => {
    if (value && typeof value !== 'string') {
      router.push(`/privado/usuario/${value._id}`);
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
      setProfileMenuOpen(false);
    }
  };

  return (
    <header className="bg-gradient-to-br from-green-400 to-green-600 text-white flex justify-between items-center px-6 py-2 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center max-w-52 max-h-52">
          <Link href="/privado/home">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <div className="flex items-center rounded-lg px-2 py-1 max-w-xs">
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
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Pesquisar"
                sx={{
                  border: 'none !important',
                  height: '30px',
                  minHeight: '30px',
                  outline: 'none !important',
                  '& .MuiInputBase-root': {
                    height: '30px',
                    minHeight: '30px',
                    padding: '10px',
                    fontSize: '12px',
                    border: 'none !important',
                    outline: 'none !important',
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  className: "text-sm bg-white",
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
        <div
          className={`nav-item ${currentPath.includes('/home') ? 'nav-item-active' : ''}`}
        >
          <NavItem
            icon={<Home />}
            label="Início"
            href="/privado/home"
            active={currentPath.includes('/home')}
          />
        </div>

        <div
          className="relative flex items-center space-x-1 cursor-pointer rounded-3xl pr-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 hover:z-50"
          ref={profileMenuRef}
          onClick={() => setProfileMenuOpen((prev) => !prev)}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="rounded-full w-10 h-10 border-4 border-primary-50 transition-transform duration-300 ease-in-out hover:scale-110"
              width={100}
              height={100}
            />
          ) : (
            <Avatar alt="User Avatar" className="w-8 h-8 transition-transform duration-300 ease-in-out hover:scale-110" />
          )}
          <div>
            <span className="text-xs text-white transition-all duration-300 ease-in-out hover:text-primary-50">
              {user ? user.name : ''} </span>
            <ArrowDropDown className="text-white transition-transform duration-300 ease-in-out hover:rotate-180" />
          </div>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-40 w-40 bg-primary rounded-lg shadow-lg py-2" style={{ zIndex: 99999 }}>
              <button
                onClick={handleModalOpen}
                className="text-secondary block w-full text-left px-4 py-2 text-sm hover:text-highlight"
              >
                <PersonOutline /> Perfil
              </button>
              {user?.role == Role.COORDINATOR && (
                <button
                  onClick={() => router.push('/privado/painel-adm')}
                  className="text-secondary block w-full text-left px-4 py-2 text-sm hover:text-highlight"
                >
                  <AdminPanelSettingsOutlined /> Painel Admin
                </button>
              )}
              <button
                onClick={() => {
                  Cookies.remove('token');
                  router.push('/');
                }}
                className="text-secondary block w-full text-left px-4 py-2 text-sm hover:text-highlight"
              >
                <Logout /> Logout
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
