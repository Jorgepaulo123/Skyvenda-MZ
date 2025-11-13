import React from "react";
import { FiUser } from 'react-icons/fi';
import { profileMenuItems } from "../../data/PopUpMenu";

export default function PopupMenuDeskTop({ user, isAuthenticated, logout,perfil, handleNavigate }) {
 return (
    <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-xl border border-gray-100 py-2 animate-fadeIn popup-menu">
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 p-[2px]">
                    <img
                      src={`https://skyvendamz.up.railway.app/perfil/${user.perfil}`}
                      alt="Profile"
                      className="w-full h-full rounded-full border-2 border-white"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center text-white">
                    <FiUser size={20} />
                  </div>
                )}
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>

    <div className="py-2">
      {profileMenuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            if(item.label!="Terminar Sessão"){
              handleNavigate(item.route)
            }else{
              logout()
            }
          }}
          className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${item.className || ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <item.icon size={18} />
          </div>
          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
 );
}