import React from 'react';
import { Home, Search, Compass, Film, Heart, PlusSquare, MessageCircle, Menu, Instagram } from 'lucide-react';
import { useState } from 'react';
import { FaShopify } from 'react-icons/fa';
import Link from 'next/link';

export default function ChatLayout({children}) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: <Home size={24} />, to: '/', label: 'Home' },
    { icon: <Search size={24} />, to: '/search', label: 'Search' },
    { icon: <Compass size={24} />, to: '/explore', label: 'Explore' },
    { icon: <Film size={24} />, to: '/reels', label: 'Reels' },
    { icon: <MessageCircle size={24} />, to: '/chat', label: 'Messages' },
    { icon: <Heart size={24} />, to: '/notifications', label: 'Notifications' },
    { icon: <PlusSquare size={24} />, to: '/create', label: 'Create' },
  ];

  return (
    <div className='w-full min-h-screen bg-white md:flex'>
      {/* Sidebar */}
      <div className="w-[72px] lg:w-[80px] h-screen border-r border-gray-300 pt-2 px-3 fixed left-0 bg-white hidden md:block">
        {/* Logo */}
        <div className="pt-8 pb-6 mb-4">
          <div className="flex   gap-2 items-center text-indigo-500 justify-center">
            <FaShopify className="w-8 h-8" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.to}
              className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors justify-center"
              title={item.label}
            >
              <div className="text-black">{item.icon}</div>
            </Link>
          ))}
        </div>

        {/* Menu Button */}
        <div className="absolute bottom-5">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg justify-center cursor-pointer transition-colors">
            <Menu size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Area with proper margin for sidebar */}
      <div className="md:ml-[72px] lg:ml-[80px] flex-1">
        {children}
      </div>
    </div>
  );
}