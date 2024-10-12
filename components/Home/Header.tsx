import React from 'react';
import { Search, Home, People, Work, Chat, Notifications, Apps } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Image from 'next/image';
import logo from '../../public/assets/logo.svg';

export default function Header() {
  return (
    <header className="bg-gray-100 text-white flex justify-between items-center px-6 py-2 shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Image src={logo} alt="Logo" className="w-8 h-8" />
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
        <NavItem icon={<Home className="text-primary" />} label="Início" />
        <NavItem icon={<People className="text-primary" />} label="Minha rede" />
        <NavItem icon={<Work className="text-primary" />} label="Vagas" />
        <NavItem icon={<Chat className="text-primary" />} label="Mensagens" />
        <NavItem icon={<Notifications className="text-primary" />} label="Notificações" />
        
        <div className="flex items-center space-x-1 cursor-pointer">
          <Avatar src="https://via.placeholder.com/40" alt="User Avatar" className="w-8 h-8" />
          <span className="text-sm text-primary">Eu</span>
        </div>
      </div>
    </header>
  );
}

const NavItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => {
  return (
    <div className="relative flex flex-col items-center cursor-pointer text-primary group">
      {icon}
      <span className="text-xs">{label}</span>
      
      {/* Linha que aparece no hover */}
      <span className="absolute bottom-0 left-0 w-0 h-1 bg-primary-light duration-300 group-hover:w-full"></span>
    </div>
  );
};

