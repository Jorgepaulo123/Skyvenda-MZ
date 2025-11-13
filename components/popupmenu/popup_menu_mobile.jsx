import React from "react";
import { FiUser, FiChevronLeft, FiSearch } from 'react-icons/fi';
import { profileMenuItems } from "../../data/PopUpMenu";
import { sidebarMenuItems } from "../../data/SidebarMenu";
import Link from "next/link";

export default function PopupMenuMobile({ user, isAuthenticated, logout, handleNavigate }) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center space-x-2">
            <button onClick={() => handleNavigate('/')} className="p-2">
              <FiChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-semibold">Menu</h2>
          </div>
          <Link href="/search" className="p-2">
            <FiSearch size={22} />
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 p-[2px]">
                <img
                  src={`https://skyvendamz.up.railway.app/perfil/${user.perfil}`}
                  alt="Profile"
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                  onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + user.name}
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                <FiUser size={24} />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Link href="/profile" className="ml-auto p-2 rounded-full bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Best Nhonguistas Section */}
        <div className="px-4 py-4 border-b border-gray-100">
          <Link href="/nhonguistas" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium">Melhores Nhonguistas</h3>
              <p className="text-xs text-gray-500">Encontre os melhores vendedores</p>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-2 p-3">
          <Link href="/produtos" className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{user.total_produtos || 4}</span>
            <span className="text-sm text-gray-600">Produtos</span>
          </Link>
          <Link href="/pedidos" className="bg-pink-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-pink-600">{user.total_pedidos || 3}</span>
            <span className="text-sm text-gray-600">Pedidos</span>
          </Link>
          <Link href="/chat" className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-green-600">{user.total_mensagens || 0}</span>
            <span className="text-sm text-gray-600">Mensagens</span>
          </Link>
          <Link href="/friends" className="bg-purple-50 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">{user.total_amigos || 0}</span>
            <span className="text-sm text-gray-600">Amigos</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="px-2 py-3">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Menu Principal</h3>
          <div className="space-y-1">
            {sidebarMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.route}
                className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${item.highlight ? 'bg-blue-50' : ''} ${item.className || ''}`}
                onClick={(e) => {
                  if (item.label === 'Sair') {
                    e.preventDefault();
                    logout();
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-full ${item.highlight ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} flex items-center justify-center mr-3`}>
                  <item.icon size={18} />
                </div>
                <span className={`text-sm font-medium ${item.highlight ? 'text-blue-700' : 'text-gray-700'}`}>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            {profileMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.route}
                className={`flex items-center px-3 py-2 rounded-md hover:bg-gray-100 ${item.className || ''}`}
                onClick={(e) => {
                  if (item.label === 'Terminar Sessão') {
                    e.preventDefault();
                    logout();
                  }
                }}
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <item.icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="px-4 py-3 border-t border-gray-100">
          <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Configurações</h3>
          <div className="space-y-2">
            <Link href="/settings" className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <FiSettings size={18} />
                </div>
                <span className="text-sm font-medium text-gray-700">Configurações</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>

            <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Modo Escuro</span>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" name="toggle" id="darkMode" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                <label htmlFor="darkMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
              </div>
            </div>
            <Link href="/languages" className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-100">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l-.8 2H12a1 1 0 110 2H8.2l-.8 2H10a1 1 0 110 2H7.8l-.8 2H8a1 1 0 110 2H3a1 1 0 01-1-1v-1a1 1 0 01.4-.8l7-7a1 1 0 011.4 0L13.4 7H17a1 1 0 110 2h-2.8l-1.8 1.8a1 1 0 01-1.4 0L9.2 9H7a1 1 0 110-2h1.2l.8-2H7a1 1 0 01-1-1V2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Idiomas</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>

          </div>
        </div>
      </div>
    );
  }