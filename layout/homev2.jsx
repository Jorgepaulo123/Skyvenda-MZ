import React, { useEffect, useState,useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {ArrowRight, Bell, CarFront, Check, ChevronLeft, ChevronRight, ChevronRightCircle, Heart, Home, List, MapPinIcon, Menu, MessageCircle, PlusIcon, RefreshCcw, Search, ShoppingCart, User2 } from 'lucide-react'
import { FaCaretDown, FaPlus, FaShopify } from 'react-icons/fa'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import AdsMore from '../components/ads/ads'
import { base_url } from '../config/api'
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { useWebSocket } from '../components/websocket/WebSocketProvider'

export default function Homev2() {
    const [cat,setCat]=useState('')
    const [search,setSearch]=useState('')
    const [province,setProvince]=useState('niassa')
      const [searchTerm, setSearchTerm] = useState('');
      const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    
    
    
      const isActiveRoute = (path) => location.pathname === path;
  
  return (
    <div className='w-full h-[100vh] bg-white overflow-y-scroll relative '>
      <div className="border  max_z_index_xxl w-[200px] bg-transparent h-[100vh] hover:bg-slate-100 fixed -left-[198px] hover:left-0 transition-all rounded-r-xl"></div>
        <div className="flex flex-col ">
            {/* inicio do pequeno header */}
            <div className="border-b border-gray-100 hidden md:block">  
                <div className="flex  h-[40px] items-center justify-between container mx-auto py-2">
                    <span className='text-sm text-gray-600 font-sans'>Bem Vindo Na SkyVenda MZ</span>
                    <div className="flex items-center justify-center gap-4 font-sans text-gray-600">
                    <Link>
                        <span className='hover:text-indigo-500'>Contacte-nos</span>
                    </Link>
                    <Link>
                        <span className='hover:text-indigo-500'>Blog</span>
                    </Link>
                    <Link>
                        <span className='hover:text-indigo-500'>Minha Conta</span>
                    </Link>
                    <div className='flex gap-2'><Link className='hover:text-indigo-500 flex gap-1'><User2/>Entrar</Link>/<Link className='hover:text-indigo-500'>Registar</Link></div>
                </div>
                </div>    
            </div>
            {/* fim do pequeno header */}

            {/* mobile header */}

            {/* Mobile Header */}
        <div className="md:hidden max_z_index px-4 border-b  border-gray-300 shadow-sm top-0 z-50 bg-gradient-to-r backdrop:blur-md from-pink-50 to-red-50">
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
                {/* Ponto de notificação do chat removido */}
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
              onClick={() => {
                handleNavigate('/notifications');
                // Resetar contador de notificações ao clicar no sino
                resetNotificationCount();
              }} 
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



            {/* end mobile header */}
            {/* header desktop */}
            <div className="w-full py-4 fixed top-0 bg-white hidden md:block max_z_index_xl shadow-sm">
                <div className="container mx-auto flex justify-between">
                <div className="flex items-center gap-2 lg:min-w-[300px] ">
                    <FaShopify className='text-indigo-500' size={40}/>
                    <h1 className='text-gray-600 font-bold text-lg'>SkyVenda MZ</h1>
                </div>
                {/* O input e select */}
                <div className="flex items-center space-x-2 border rounded-full px-4 w-[600px] py-1">
                <Select value={cat} onValueChange={(value) => setCat(value)}  >
                    <SelectTrigger className="border-none shadow-none focus:ring-0 focus:outline-none max-w-[200px]">
                        <SelectValue placeholder="Todas categorias"  />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="eletronicas">Eletrônicas</SelectItem>
                        <SelectItem value="veiculos">Veículos</SelectItem>
                        <SelectItem value="imoveis">Imóveis</SelectItem>
                    </SelectContent>
                </Select>
                <div className="w-[1px] h-[26px] bg-gray-300"/>

                <input
                    value={search}
                    className="border-none shadow-none focus:ring-0 focus:outline-none outline-none focus:border-transparent flex-1"
                    onChange={(e) => setSearch(e.target.value)}
                    type="text" 
                    placeholder="Casas à venda" 
                />
                <div className="h-[27px]">
                <Search className='text-gray-600 hover:text-indigo-500'/>
                </div>


                </div>
                {/* O input e select */}

                {/* outros */}
                <div className="flex lg:min-w-[300px] items-center gap-5">
                    <div className="flex gap-2 bg-indigo-500 rounded-full px-3 py-2 text-white font-bold hover:bg-indigo-600">
                        <PlusIcon/>
                        <span>postar</span>
                    </div>

                    <div className="flex justify-between flex-1">
                        <div className="relative  h-[30px] flex items-center justify-center">
                            <MessageCircle size={30} className='text-gray-700  hover:text-indigo-600'/>
                            {/* Ponto de notificação do chat removido */}
                        </div>

                        <div className="relative  h-[30px] flex items-center justify-center" onClick={() => resetNotificationCount()}>
                            <Bell size={30} className='text-gray-700  hover:text-indigo-600'/>
                            {safeCount > 0 && (
                                <div className="bg-red-500 text-white text-xs rounded-full absolute justify-center -top-0 -right-1 px-[1px] min-w-[15px] flex items-center">
                                    <span>{safeCount > 99 ? '99+' : safeCount}</span>
                                </div>
                            )}
                        </div>

                        <div className="relative  h-[30px] flex items-center justify-center">
                            <ShoppingCart size={30} className='text-gray-700  hover:text-indigo-600'/>
                            {/* Ponto de notificação do carrinho removido */}
                        </div>
                    </div>
                </div>
                {/* fim outros  */}
                </div>
            </div>
            
            {/* terceiro header */}
            <div className="py-1 bg-indigo-100 h-[60px] hidden md:flex mt-10">
                <div className="container mx-auto flex items-center gap-5 justify-between">
                    <div className="flex gap-8 justify-center items-center">
                        {/* inicio do dropdown */}
                    <div className="group relative cursor-pointer py-2 w-[250px] font-sans max_z_index">
                        <div className="flex items-center justify-between space-x-2 bg-indigo-500 px-4 text-white rounded-md">
                            <List/>
                            <a className="menu-hover my-2 py-1 text-base font-medium text-white lg:mx-4" onClick="">
                                Todas As Categorias
                            </a>
                            <FaCaretDown/>
                        </div>
                        <div
                            className="invisible absolute  flex w-full flex-col bg-white py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Moda</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Eletrônicos</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Casa e Jardim</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Saúde e Beleza</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Brinquedos e Jogos</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Culinária</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Telefonia</Link>
                            </div>
                            <div className="border-b border-gray-100 hover:text-indigo-600 py-3">
                                <Link className=''>Esportes e Lazer</Link>
                            </div>

                        </div>
                    </div>
                    {/* fim do dropdown */}
                    {/* menus */}
                    <div className="flex space-x-8 font-sans">
                        <Link className='hover:text-indigo-500'>Home</Link>
                        <Link className='hover:text-indigo-500'>Lojas</Link>
                        <Link className='hover:text-indigo-500'>Nhonguistas</Link>
                        <Link className='hover:text-indigo-500'>Meus produtos</Link>
                    </div>
                    {/* menus */}
                    </div>
                    <div className="flex space-x-8 text-gray-600">
                        <div className="flex gap-2 items-center hover:text-indigo-500 min-w-[200px]">
                            <div className="flex items-center justify-center rounded-full bg-white p-2">
                            <MapPinIcon/>
                            </div>
                            <Select value={province} onValueChange={(value) => setProvince(value)}  >
                                <SelectTrigger className="border-none shadow-none focus:ring-0 focus:outline-none max-w-[200px]">
                                    <SelectValue placeholder="Todas categorias"  />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="niassa">Niassa</SelectItem>
                                    <SelectItem value="cabo_delgado">Cabo Delgado</SelectItem>
                                    <SelectItem value="nampula">Nampula</SelectItem>
                                    <SelectItem value="zambezia">Zambézia</SelectItem>
                                    <SelectItem value="tete">Tete</SelectItem>
                                    <SelectItem value="manica">Manica</SelectItem>
                                    <SelectItem value="sofala">Sofala</SelectItem>
                                    <SelectItem value="inhambane">Inhambane</SelectItem>
                                    <SelectItem value="gaza">Gaza</SelectItem>
                                    <SelectItem value="maputo">Maputo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 items-center hover:text-indigo-500 min-w-[200px]">
                            <div className="flex items-center justify-center rounded-full bg-white p-2">
                            <RefreshCcw/>
                            </div>
                            <span>Visto recentemente</span>
                        </div>
                    </div>
                </div>

                </div>
            </div>
            {/* terceiro header */}
        <main className='bg-[#fefdff]'>
          {/* por categoria */}
        <div className="container mx-auto pt-8 flex gap-8 px-2 lg:px-0 flex-col X">
            <AdsMore/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,4,4].map((index)=>(
              <div className=" bg-white p-2 border border-gray-200" key={index}> 
                <label className='font-bold'>Titulo da categoria</label>
                  <div className="grid grid-cols-3 gap-1 h-[200px]" >
                  {[2,3,3].map((i)=>(
                    <div className="p-2 flex flex-col items-center " key={i}>
                    <div className="bg-gray-100 w-full h-full">
                      <img className='w-full h-full' src={`${base_url}/default.png`}/>
                    </div>
                    <label className='text-sm text-gray-700 mt-2'>Camera h1d</label>
                    <label className='font-bold text-indigo-700'>89000 MT</label>
                  </div>
                  ))}
              </div>
              </div>
            ))}
            </div>
        </div>
        {/* por categoria */}
          <div className="container mx-auto py-8 px-2 md:px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 h-[300px] sm:h-[280px] md:h-[185px] lg:h-[220px] gap-5">
                <div className=" h-full rounded-md banner1 flex justify-end">
                  <div className="p-8 flex flex-col justify-between mr-10">
                    <div className="">
                    <h1 className='text-white/80 font-sans text-xl'>MELHOR NHONGUISTA</h1>
                    <h1 className='text-white font-bold text-4xl'>Nova Colecao</h1>
                    <p className='text-sm text-white'>Vendas com 30% de desconto</p>
                    </div>
                    <div className="">
                      <button className='bg-white flex p-2 rounded-full items-center px-4 gap-1 transition-all font-bold '>
                        <span>Ver Agora</span>
                        <div className="bg-blue-500 p-1 rounded-full">
                          <ArrowRight className='text-white'/>
                        </div>
      
                      </button>
                    </div>

                  </div>
                  

                </div>
                <div className=" h-full bg-gray-600 rounded-md banner2 flex justify-end">
                <div className="p-8 flex flex-col justify-between mr-10">
                    <div className="">
                    <h1 className='text-white/80 font-sans text-xl'>MELHOR NHONGUISTA</h1>
                    <h1 className='text-white font-bold text-4xl'>Nova Colecao</h1>
                    <p className='text-sm text-white'>Vendas com 30% de desconto</p>
                    </div>
                    <div className="">
                      <button className='bg-white flex p-2 rounded-full items-center px-4 gap-1 transition-all font-bold '>
                        <span>Ver Agora</span>
                        <div className="bg-blue-500 p-1 rounded-full">
                          <ArrowRight className='text-white'/>
                        </div>
      
                      </button>
                    </div>

                  </div>
                </div>

              </div>
          </div>
          {/* just for you */}
          <div className="container mx-auto font-bold py-4">
            <h1 className='text-2xl text-gray-600 pb-4'>Boladas para si</h1>
            {/* card */}
            <div className="flex gap-4">
            {[1,1,1,1,1,1].map((index)=>(
              <div className="flex flex-col bg-white rounded-lg w-[240px] p-2" key={index}>
              <div className="relative w-full h-[240px] bg-gray-100 rounded-lg">
                <div className="bg-red-100 p-2 rounded-full flex items-center justify-center absolute right-2 top-2 w-[30px] h-[30px] ">
                  <Heart className='text-red-600'/>
                </div>
              </div>
              <div className="flex flex-col p-2">
                <p className='text-slate-700'>Smartphone</p>
                <div className="flex justify-between">
                  <div className="flex">
                  <h4 className='text-sm'>⭐⭐⭐⭐⭐ 2</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={18} className='text-indigo-500 font-bold'/>
                    <span>in stock</span>
                  </div>
                </div>
                <div className="flex text-gray-700">
                  5000 MT
                </div>
                <button className='border w-full py-2 rounded-md
                 border-indigo-500 text-indigo-500 hover:bg-indigo-600 hover:text-white hover:border-none '>Compar Agora</button>

              </div>

            </div>
            ))}
            </div>
            {/* card */}
          </div>
        </main>
    </div>
  )
}
