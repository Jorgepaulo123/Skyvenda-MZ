import React from 'react';
import { Home, Search, Compass, Film, Heart, PlusSquare, MessageCircle, Menu, Instagram } from 'lucide-react';
import { useState } from 'react';
import { FaShopify } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Layout2({children}) {
  return (
    <div className='w-full min-h-screen bg-white'>
      {/* Main Content Area with no sidebar */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}