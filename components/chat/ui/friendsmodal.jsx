"use client";
import { Search, X, ArrowLeft, Users, Bot } from 'lucide-react';
import { base_url } from '../../../api/api';
import FriendsSkeleton from './friendsskeleton';
import Image from 'next/image';
import React from 'react';

export default function FriendsModal({ 
  showOnlineUsers, 
  setShowOnlineUsers, 
  searchQuery, 
  setSearchQuery, 
  loadingFriends, 
  filteredFriends, 
  handleFriendSelect 
}) {
  if (!showOnlineUsers) return null;

  // slide-in animation state (mobile)
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => { setEntered(true); }, []);

  return (
    <div className="fixed inset-0 z-50 md:bg-black/50">
      <div className="flex h-full w-full items-stretch justify-center">
        {/* Mobile: full page. Desktop: centered card */}
        <div
          className={
            "bg-white md:rounded-2xl md:shadow-2xl w-full h-full md:max-w-md md:h-[80vh] md:my-10 md:mx-4 flex flex-col " +
            "transform transition-transform duration-300 " +
            (entered ? "translate-x-0" : "-translate-x-full md:translate-x-0")
          }
        >
          {/* Header with back arrow and title */}
          <div className="px-4 pt-4 pb-3 border-b bg-white">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Voltar"
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                onClick={() => setShowOnlineUsers(false)}
              >
                <ArrowLeft size={20} className="text-gray-800" />
              </button>
              <h2 className="text-[17px] font-semibold text-gray-900">Nova mensagem</h2>
            </div>
          </div>

          {/* Para: search */}
          <div className="px-4 py-3 border-b bg-white">
            <div className="text-sm text-gray-500 mb-2">Para:</div>
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar"
                className="w-full h-11 pl-10 pr-4 rounded-full bg-gray-50 text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white">
            <div className="px-4 py-3">
              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition"
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Users size={20} className="text-gray-700" />
                </div>
                <div>
                  <div className="text-[15px] font-medium text-gray-900">Conversa em grupo</div>
                  <div className="text-xs text-gray-500">Crie um chat com várias pessoas</div>
                </div>
              </button>
            </div>
            <div className="px-4 pb-2">
              <button
                type="button"
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition"
              >
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Bot size={20} className="text-gray-700" />
                </div>
                <div>
                  <div className="text-[15px] font-medium text-gray-900">Conversas com IA</div>
                  <div className="text-xs text-gray-500">Fale com assistentes inteligentes</div>
                </div>
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="px-4 py-2 text-sm font-medium text-gray-500">Sugestões</div>
            {loadingFriends ? (
              <div className="p-4">
                <FriendsSkeleton />
              </div>
            ) : filteredFriends.length > 0 ? (
              <div>
                {filteredFriends.map(friend => (
                  <button
                    key={friend.id}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3"
                    onClick={() => {
                      handleFriendSelect(friend);
                      setShowOnlineUsers(false);
                    }}
                  >
                    <Image 
                      src={friend.foto_perfil || `${base_url}/avatar.png`}
                      alt={friend.nome}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-full"
                      unoptimized
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-gray-900 truncate">{friend.nome}</p>
                        {/* Opcional: badge de verificado/loja aqui */}
                      </div>
                      <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500">
                {searchQuery ? 'Nenhum amigo encontrado' : 'Nenhum amigo disponível'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

