"use client";
import { Bell, Home, Menu, MessageCircle, PlusIcon, Search, ShoppingCart } from 'lucide-react'
import React, { useRef, useState, useContext,useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FaPlus, FaShopify } from 'react-icons/fa'
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AuthContext, useAuth } from '../../context/AuthContext'
import PublishProductCard from '../PublishProduct'
import { HomeContext } from '../../context/HomeContext';
// Usando o WebSocketProvider do contexto Next
import { useWebSocket } from '../../context/websoketContext';
import { Notifications } from '../popupmenu/notifications';

export default function Header() {
    const [cat, setCat] = useState('')
    const [search, setSearch] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showPostDialog,setShowPostDialog]= useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    // Usando o hook useWebSocket para obter a contagem de notificações
    const { newNotification, setNewNotification } = useWebSocket();
    
    // Forçar o valor para zero se não for um número válido ou for menor que zero
    const safeCount = (!newNotification || isNaN(newNotification) || newNotification < 0) ? 0 : newNotification;
    
    const {isAuthenticated}=useAuth()
    // Header agora é completamente fixo no topo - sem scroll
    const headerRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();
    const isActiveRoute = (path) => pathname === path;

    return (
        <>
            {/* header desktop */}
            <div 
                ref={headerRef}
                className="w-full py-3 fixed top-0 left-0 right-0 bg-white hidden md:block max_z_index_xl"
            >
                <div className="container mx-auto flex justify-between">
                    <Link href={'/'} className="flex items-center gap-2 lg:min-w-[300px] ">
                        <FaShopify className='text-[#7a4fed]' size={40} />
                        <h1 className='text-gray-600 font-bold text-lg'>SkyVenda MZ</h1>
                    </Link>
                    {/* O input e select */}
                    <div className="flex items-center space-x-2 border rounded-full px-4 lg:w-[600px] md:w-[00px] py-1">
                        <Select value={cat} onValueChange={(value) => setCat(value)}
                         onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setIsSearchOpen(false)
                                router.push(`/search?q=${search}`)
                            }
                            }} >
                            <SelectTrigger className="border-none shadow-none focus:ring-0 focus:outline-none max-w-[200px]">
                                <SelectValue placeholder="Todas categorias" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="eletronicas">Eletrônicas</SelectItem>
                                <SelectItem value="veiculos">Veículos</SelectItem>
                                <SelectItem value="imoveis">Imóveis</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="w-[1px] h-[26px] bg-gray-300" />

                        <input
                            value={search}
                            className="border-none shadow-none focus:ring-0 focus:outline-none outline-none focus:border-transparent flex-1"
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Casas à venda"
                        />
                        <div className="h-[27px]">
                            <Search className='text-gray-600 hover:text-indigo-500' onClick={()=>{
                                router.push(`/search?q=${search}`)
                            }} />
                        </div>


                    </div>
                    {/* O input e select */}

                    {/* outros */}
                    <div className="flex lg:min-w-[300px] items-center gap-5">
                        <div className="flex gap-2 bg-[#7a4fed] rounded-full px-3 py-2 text-white font-bold hover:bg-indigo-600 " 
                        onClick={()=>{
                            if(isAuthenticated){
                                setShowPostDialog(true)
                            }else{
                                router.push('/login')
                            }
                        }}>
                            <PlusIcon />
                            <span>postar</span>
                        </div>

                        <div className="flex justify-between flex-1">
                            <Link  href='/chat' className="relative  h-[30px] flex items-center justify-center">
                                <MessageCircle size={30} className='text-gray-700  hover:text-indigo-600' />
                                {/* Ponto de notificação do chat removido */}
                            </Link>

                            <div className="relative h-[30px] flex items-center justify-center">
                                <div onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    // Resetar contador de notificações ao clicar no sino
                                    setNewNotification(0);
                                }} className="cursor-pointer">
                                    <Bell size={30} className='text-gray-700 hover:text-indigo-600' />
                                    {safeCount > 0 && (
                                        <div className="bg-red-500 text-white text-xs rounded-full absolute justify-center -top-0 -right-1 w-[15px] h-[15px] flex items-center">
                                            <span>{safeCount > 99 ? '99+' : safeCount}</span>
                                        </div>
                                    )}
                                </div>
                                {showNotifications && (
                                    <div className="absolute top-full right-0 mt-2 z-50">
                                        <Notifications onClose={() => setShowNotifications(false)} />
                                    </div>
                                )}
                            </div>

                            <div className="relative  h-[30px] flex items-center justify-center">
                                <ShoppingCart size={30} className='text-gray-700  hover:text-indigo-600 cursor-pointer' onClick={() => router.push('/pedidos')} />
                                {/* Ponto de notificação do carrinho removido */}
                            </div>
                        </div>
                    </div>
                    {/* fim outros  */}
                </div>
            </div>

            {/* Mobile Header */}
            <div 
                className="md:hidden max_z_index px-4 border-b border-gray-300 shadow-sm fixed top-0 left-0 right-0 z-50 bg-gradient-to-r backdrop:blur-md bg-white"
            >
                {/* Top Row */}
                <div className="flex justify-between items-center py-4">
                    <Link
                        href={'/'}
                        className="text-xl font-bold text-[#7a4fed] font-sans flex gap-1 items-center"
                    >
                        <FaShopify size={30}/>
                        <span>SkyVenda MZ</span>
                    </Link>
                    <div className="flex items-center">
                        <button onClick={() => setShowPostDialog(true)} className="text-gray-600 mr-4 bg-[#FDE68A20] p-2 rounded-full">
                            <FaPlus size={24} />
                        </button>
                        <button onClick={() => router.push('/m/search')} className="text-gray-600 mr-4 bg-[#FDE68A20] p-2 rounded-full">
                            <FiSearch size={24} />
                        </button>
                        <button
                            onClick={() => router.push('/menu')}
                            className="text-gray-600 relative  bg-[#FDE68A20] p-2 rounded-full"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                {/* Search Bar (conditionally rendered) */}
                {isSearchOpen == true && (
                    <div className="py-2">
                        <input
                            type="text"
                            placeholder="Pesquisar produtos..."
                            className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                // setShowSuggestions(true)

                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setIsSearchOpen(false)
                                    router.push(`/search?q=${searchTerm}`)
                                }
                            }}
                        />
                    </div>
                )}

                {/* Bottom Row */}
                <div className="flex justify-between items-center py-2 pb-4">
                    <button
                        onClick={() => router.push('/')}
                        className={`text-gray-600 ${isActiveRoute('/') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <Home
                            size={30}
                            fill={isActiveRoute('/') ? 'currentColor' : 'none'}
                        />
                    </button>

                    <button
                        onClick={() => router.push('/chat')}
                        className={`text-gray-600 relative ${isActiveRoute('/chat') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <Link href={'/chat'} className="relative ">
                            <MessageCircle
                                size={30}
                                fill={isActiveRoute('/chat') ? 'currentColor' : 'none'}
                            />
                            {/* Ponto de notificação do chat removido */}
                        </Link>
                    </button>

                    <button
                        onClick={() => router.push('/friends')}
                        className={`text-gray-600 ${isActiveRoute('/friends') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <FiUser
                            size={30}
                        />
                    </button>

                    <button
                        onClick={() => {
                            router.push('/notifications');
                            // Resetar contador de notificações ao clicar no sino
                            setNewNotification(0);
                        }}
                        className={`text-gray-600 relative ${isActiveRoute('/notifications') ? 'text-indigo-600' : ''
                            }`}
                    >
                        <div className="relative ">
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
                        onClick={() => router.push('/menu')}
                        className="text-gray-600 relative  mr-2"
                    >
                        <FiShoppingCart size={30} onClick={() => router.push('/pedidos')} />
                        {/* Ponto de notificação do carrinho removido */}
                    </button>
                </div>
            </div>
            
            {/* end mobile header */}
            <PublishProductCard 
                isOpen={showPostDialog}
                onClose={() => setShowPostDialog(false)}
            />
        </>
    )
}
