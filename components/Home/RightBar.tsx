'use client';

import { getGroups } from '@/api/groups-endpoint.service';
import { GroupModel } from '@/schema/group.model';
import React, { useEffect, useState } from 'react';

export default function RightBar() {
  const  [groups, setGroups] = useState<GroupModel[]>([]);

  const getGroupsAsync = async () => { 
      try {
          const response = await getGroups();
          setGroups(response);
      } catch (e) {
          console.error(e);
      }
  }

  useEffect(() => { 
      getGroupsAsync();
  }, []);
  
  return (
    <div className="w-64 bg-gray-100 text-white rounded-lg shadow-lg p-4 h-fit">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Feedboard Grupos</h3>
        <ul className="space-y-3">
          {groups.map((item, index) => (
            <li key={index} className="text-sm">
              <a href="#" className="hover:underline font-bold text-white">
                {item.name}
              </a>
              <p className="text-gray-400">{item.members?.length ?? '0'} • membros</p>
            </li>
          ))}
        </ul>
        <a href="#" className="text-primary-dark hover:underline text-sm mt-3 block">Exibir mais</a>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold mb-2">Jogos de hoje</h4>
        <ul className="space-y-3">
          {games.map((game, index) => (
            <li key={index} className="flex items-center">
              <div className="w-8 h-8 bg-gray-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-white font-bold">{game.icon}</span>
              </div>
              <div className="flex-1">
                <a href="#" className="font-bold text-white hover:underline">{game.title}</a>
                <p className="text-gray-400 text-sm">{game.description}</p>
              </div>
              {game.isNew && (
                <span className="text-sm text-gray-900 bg-primary-100 rounded-full px-2 py-0.5 ml-2">
                  Novo
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const newsItems = [
  {
    title: "Criadores para seguir",
    time: "há 15 h",
    readers: "20.782",
  },
  {
    title: "Top Startups",
    time: "há 15 h",
    readers: "2.150",
  },
  {
    title: "Vagas de trainee e estágio",
    time: "há 6 h",
    readers: "6.848",
  },
  {
    title: "Prêmio Nobel",
    time: "há 15 h",
    readers: "891",
  },
  {
    title: "Cerco às bets",
    time: "há 11 h",
    readers: "886",
  },
];

// Dados simulados para Jogos de Hoje
const games = [
  {
    title: "Tango",
    description: "Harmonize a grade",
    icon: "🎮",
    isNew: true,
  },
  {
    title: "Queens",
    description: "Coroar cada região",
    icon: "👑",
    isNew: false,
  },
];
