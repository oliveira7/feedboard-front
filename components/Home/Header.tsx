'use client';

import React, { useState, useEffect } from 'react';
import { Search, Home, People, Notifications } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/assets/logo.svg';
import ProfileEdit from '../Profile/ProfileEdit';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <header className="bg-primary-50 text-white flex justify-between items-center px-6 py-2 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Image src={logo} alt="Logo" width={100} height={100} />
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

        <div className="flex items-center space-x-1 cursor-pointer" onClick={handleModalOpen}>
          <Avatar src="https://via.placeholder.com/40" alt="User Avatar" className="w-8 h-8" />
          <span className="text-sm text-highlight">Eu</span>
        </div>
      </div>

      <ProfileEdit modalOpen={modalOpen} handleModalClose={handleModalClose} />
    </header>
  );
}

const NavItem = ({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active: boolean }) => {
  const router = useRouter(); // Usar o hook de navegação do Next.js

  return (
    <div
      className={`relative flex flex-col items-center cursor-pointer transition-colors ${
        active ? 'text-highlight' : 'text-neutral'
      } hover:text-highlight`} // Aplicar as classes corretas
      onClick={() => router.push(href)} // Navegação sem recarregar
    >
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  );
};
