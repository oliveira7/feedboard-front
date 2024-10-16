'use client';

import React, { useState, useEffect } from 'react';
import { Search, Home, People, Notifications, Logout, Person } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/assets/logo.svg';
import ProfileEdit from '../Profile/ProfileEdit';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useGroup } from '@/context/GroupContext';
import { b } from 'framer-motion/client';
import Link from 'next/link';


export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useGroup();

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

  return (
    <header className="bg-primary-50 text-white flex justify-between items-center px-6 py-2 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Link href="/home">
          <Image src={logo} alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <div className="flex items-center bg-primary-100 rounded-lg px-2 py-1">
          <Search className="text-primary mr-2" />
          <input
            type="text"
            placeholder="Pesquisar"
            className="bg-primary-100 text-sm text-primary outline-none"
          />
        </div>
      </div>

      <div className="flex space-x-8">
        <NavItem icon={<Home />} label="Início" href="/home" active={currentPath.includes('/home')} />
        <NavItem icon={<People />} label="Minha rede" href="/network" active={currentPath.includes('/network')} />
        <NavItem icon={<Notifications />} label="Notificações" href="/notifications" active={currentPath.includes('/notifications')} />

        <div className="relative flex items-center space-x-1 cursor-pointer" onClick={toggleProfileMenu}>
          { user?.avatar_base64 ?
              <Image
              src={user.avatar_base64}
              alt="Profile"
              className="rounded-full w-10 h-10 border-2 border-primary-50"
              width={100}
              height={100} /> : (
          <Avatar src="https://via.placeholder.com/40" alt="User Avatar" className="w-8 h-8" />
        )}
          <span className="text-sm text-highlight">{ user ? user.name : 'Eu'}</span>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-32 w-40 bg-primary-100 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleModalOpen}
                className="block w-full text-left px-4 py-2 text-sm  hover:text-highlight"
              >
               <Person /> Perfil
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm  hover:text-highlight"
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
      className={`relative flex flex-col items-center cursor-pointer transition-colors ${
        active ? 'text-highlight' : 'text-neutral'
      } hover:text-highlight`}
      onClick={() => router.push(href)}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  );
};
