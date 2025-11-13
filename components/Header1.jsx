import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {FiPlus, FiShoppingCart, FiSearch, FiHome, FiBell, FiMenu, FiUser, FiSettings, FiHelpCircle, FiLogOut, FiGrid, FiEdit3 } from 'react-icons/fi';
import Cart from './Cart';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import PopUpMenu from './popupmenu/popup_menu';
import PopupMenuDeskTop from './popupmenu/popupmenu_desktop';
import PopupMenuMobile from './popupmenu/popup_menu_mobile';
import { suggestedProducts } from '../data/sugest';
import { Notifications } from './popupmenu/notifications';
import SearchCard from './popupmenu/searchCard';
import PublishProductCard from './PublishProduct';
import { useWebSocket } from './websocket/WebSocketProvider';

import { MessageCircle,Menu, Bell, Home } from 'lucide-react';
import { FaPlus } from 'react-icons/fa';

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchCard, setShowSearchCard] = useState(false);
  const [showPostDialog,setShowPostDialog]= useState(false);
  
  const [isNotificationOpen,setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const menuClickedRef = useRef(false);
  const {user,isAuthenticated,logout}=useContext(AuthContext)
  const NotificationRef = useRef(null);
  const SearchcardRef = useRef(null);
  const location = useLocation();
  
  // Usar o hook useWebSocket para obter a contagem de notificações
  const { notificationCount, resetNotificationCount } = useWebSocket();
  
  // Forçar o valor para zero se não for um número válido ou for menor que zero
  const safeCount = (!notificationCount || isNaN(notificationCount) || notificationCount < 0) ? 0 : notificationCount;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se o clique foi em um item do menu, não fechamos o menu
      if (menuClickedRef.current) {
        menuClickedRef.current = false;
        return;
      }

      // Se o clique foi fora do menu, fechamos ele
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        
      }
      if(NotificationRef.current && !NotificationRef.current.contains(event.target)){
        setIsNotificationOpen(false)
      }
      if(SearchcardRef.current && !SearchcardRef.current.contains(event.target)){
        setShowSearchCard(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigate = (route) => {
    // Marcamos que o clique foi em um item do menu
    menuClickedRef.current = true;
    navigate(route);
    // Fechamos o menu após um pequeno delay para garantir que o handleClickOutside não interfira
    setTimeout(() => {
      setIsProfileOpen(false);
     
    }, 100);
  };



  const handleSearchSelect = (product) => {
    setSearchTerm(product);
    navigate(`/search?q=${product}`);
    setIsSearchOpen(false);
    setShowSuggestions(false)
  };
  const hangleNotification = () => {
    // Check if mobile view (can use window.innerWidth or a media query)
    if (window.innerWidth < 768) {
      handleNavigate('/notifications');
    } else {
      setIsNotificationOpen(!isNotificationOpen);
    }
  };

  const toggleProfileMenu = () => {
    menuClickedRef.current = true;
    setIsProfileOpen(!isProfileOpen);
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <header className="border-b border-gray-300 shadow-sm top-0 z-50 bg-gradient-to-r backdrop:blur-md from-pink-50 to-red-50 ">
      <div className="container mx-auto px-4">
      {showSearchCard && (<div ref={SearchcardRef}> 
        <SearchCard />
      </div>)}
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-center py-2">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => handleNavigate('/')} 
              className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              SkyVenda MZ
            </button>
          </div>
          <div className="flex-grow mx-4 relative max-w-[400px] w-full">
            <div className="relative search-container">
            <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true); 
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsSearchOpen(false)
                    navigate(`/search?q=${searchTerm}`)
                  }
                }}
                onFocus={()=>setShowSearchCard(!showSearchCard)}
              />

              <button  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500">
                <FiSearch size={20} />
              </button>
              
              
            </div>
            {searchTerm && showSuggestions &&(
              <ul className="absolute z-10 bg-white w-full mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestedProducts
                  .filter((product) =>
                    product.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleSearchSelect(product)
                        setShowSuggestions(false)
                        
                      }}
                    >
                      {product}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => setShowPostDialog(true)} className="text-white flex gap-2
             bg-gray-800 hover:bg-gray-600 px-3 py-2 rounded-full ">
              <FiPlus size={24} className='font-bold'/>
              <span>postar</span>
            </button>
            
            <div className='hover:bg-indigo-200 w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-r from-pink-100 to-red-100'>
              <button onClick={() => {
                hangleNotification();
                // Resetar contador de notificações ao clicar no sino
                resetNotificationCount();
              }} className="text-gray-600 hover:text-blue-600 relative">
                <FiBell size={24} />
                {safeCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-[18px] h-[18px] flex items-center justify-center">
                    {safeCount > 99 ? '99+' : safeCount}
                  </span>
                )}
              </button>
            </div>

            <div className='hover:bg-indigo-200 w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-r from-pink-100 to-red-100'>
              <button 
                onClick={() => handleNavigate('/chat')} 
                className={`text-gray-600 hover:text-blue-600 relative ${
                  isActiveRoute('/chat') ? 'text-indigo-600' : ''
                }`}
              >
                <MessageCircle 
                  size={24} 
                  fill={isActiveRoute('/chat') ? 'currentColor' : 'none'} 
                />
                {/* Ponto de notificação de chat removido */}
              </button>
            </div>

            <div className='hover:bg-indigo-200 w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-r from-pink-100 to-red-100'>
              <button
                onClick={() => handleNavigate('/menu')}
                className="text-gray-600 hover:text-blue-600 relative cursor-pointer"
              >
                <FiShoppingCart size={24} />
                {/* Ponto de notificação do carrinho removido */}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          {/* Top Row */}
          <div className="flex justify-between items-center py-4">
            <button 
              onClick={() => handleNavigate('/')} 
              className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              SkyVenda MZ
            </button>
            <div className="flex items-center">
              <button onClick={() =>setShowPostDialog(true)} className="text-gray-600 mr-4 bg-gradient-to-r from-pink-100 to-red-100 p-2 rounded-full">
                <FaPlus size={24} />
              </button>
              <button onClick={() => navigate('/m/search')} className="text-gray-600 mr-4 bg-gradient-to-r from-pink-100 to-red-100 p-2 rounded-full">
                <FiSearch size={24} />
              </button>
              <button
                onClick={() => handleNavigate('/menu')}
                className="text-gray-600 relative hchild bg-gradient-to-r from-pink-100 to-red-100 p-2 rounded-full"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Search Bar (conditionally rendered) */}
          {isSearchOpen==true && (
            <div className="py-2">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                  
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsSearchOpen(false)
                    navigate(`/search?q=${searchTerm}`)
                  }
                }}
              />
            </div>
          )}

          {/* Bottom Row */}
          <div className="flex justify-between items-center py-2 pb-4">
            <button 
              onClick={() => handleNavigate('/')} 
              className={`text-gray-600 ${
                isActiveRoute('/') ? 'text-indigo-600' : ''
              }`}
            >
              <Home 
                size={30} 
                fill={isActiveRoute('/') ? 'currentColor' : 'none'} 
              />
            </button>

            <button 
              onClick={() => handleNavigate('/chat')} 
              className={`text-gray-600 relative ${
                isActiveRoute('/chat') ? 'text-indigo-600' : ''
              }`}
            >
              <div className="relative hchild">
                <MessageCircle 
                  size={30} 
                  fill={isActiveRoute('/chat') ? 'currentColor' : 'none'} 
                />
                {safeCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500
                 text-white text-xs rounded-full min-w-[18px] max-w-[20px] h-[18px] flex items-center justify-center">
                    {safeCount > 99 ? '99+' : safeCount}
                  </span>
                )}
              </div>
            </button>

            <button 
              onClick={() => handleNavigate('/friends')} 
              className={`text-gray-600 ${
                isActiveRoute('/friends') ? 'text-indigo-600' : ''
              }`}
            >
              <FiUser 
                size={30}
              />
            </button>

            <button 
              onClick={() => handleNavigate('/notifications')} 
              className={`text-gray-600 relative ${
                isActiveRoute('/notifications') ? 'text-indigo-600' : ''
              }`}
            >
              <div className="relative hchild">
                <Bell 
                  size={30} 
                  fill={isActiveRoute('/notifications') ? 'currentColor' : 'none'} 
                />
                {safeCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-[18px] h-[18px] flex items-center justify-center">
                    {safeCount > 99 ? '99+' : safeCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => handleNavigate('/menu')}
              className="text-gray-600 relative hchild mr-2"
            >
              <FiShoppingCart size={30} />
              {/* Ponto de notificação do carrinho removido */}
            </button>
          </div>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        {/* Publish Product Card */}
      <PublishProductCard 
        isOpen={showPostDialog}
        onClose={() => setShowPostDialog(false)}
      />
      
    </header>
  );
}

export default Header;