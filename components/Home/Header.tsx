'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Home, Logout, Person, DarkMode, LightMode, ArrowDropDown } from '@mui/icons-material';
import { Autocomplete, Avatar } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/assets/logo.svg';
import ProfileEdit from '../Profile/ProfileEdit';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useGroup } from '@/context/GroupContext';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { getAll } from '@/api/user-endpoint.service';
import { debounce } from 'lodash';
import { UserModel } from '@/schema/user.model';
import { useSnackbar } from '@/context/SnackBarContext';

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useGroup();
  const { themeMode, toggleTheme } = useTheme();
  const [userOptions, setUserOptions] = useState<UserModel[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { showError } = useSnackbar();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  const fetchUsers = async (query: string) => {
    try {
      setLoadingUsers(true);
      const users = await getAll(1, 5, `search=${query}`);
      console.log(users);
      setUserOptions(users);
      setLoadingUsers(false);
    } catch (e: any) {
      setLoadingUsers(false);
      showError(e.message)
    }
  };

  const debouncedFetchUsers = useCallback(
    debounce((query: string) => {
      if (query) fetchUsers(query);
    }, 500),
    []
  );

  return (
    <header className="bg-gradient-to-br from-primary-dark to-primary-light text-white flex justify-between items-center px-6 py-2 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center max-w-52 max-h-52">
          <Link href="/home">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <div className="flex items-center bg-white rounded-lg px-2 py-1">
          <Search className="text-highlight mr-2" />
          <Autocomplete
              options={userOptions}
              getOptionLabel={(option) => option.name}
              loading={loadingUsers}
              renderInput={(params) => (
                <input
                type="text"
                placeholder="Pesquisar"
                className="bg-white text-sm text-highlight outline-none"
                onChange={(e) => debouncedFetchUsers(e.target.value)}
              />
              )}
            />
        </div>
      </div>

      <div className="flex space-x-8 items-center">
        <NavItem icon={<Home />} label="Início" href="/home" active={currentPath.includes('/home')} />

        <div className="relative flex items-center space-x-1 cursor-pointer rounded-3xl pr-4 hover:bg-primary-light" onClick={toggleProfileMenu}>
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
                onClick={handleLogout}
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

const NavItem = ({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active: boolean }) => {
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
