import { BadgeCheck, Bell, Globe, Lock, Megaphone, MessageSquare, Shield, User, UserCheck, Menu, X, FileEdit } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { FaShieldAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'

export default function SettingLayout({ children }) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    // Detectar se é dispositivo móvel baseado no tamanho da tela
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const menuItems = [
        {
            icon: <User size={20} />,
            label: 'Editar Perfil',
            path: '/accounts/edit'
        },
        {
            icon: <FileEdit size={20} />,
            label: 'Revisão de Perfil',
            path: '/profile/review'
        },
        {
            icon: <FaShieldAlt size={20} />,
            label: 'Segurança e PIN',
            path: '/settings/security'
        },
        {
            icon: <Bell size={20} />,
            label: 'Notificações',
            path: '/accounts/notifications'
        },
        {
            icon: <Shield size={20} />,
            label: 'Privacidade da Conta',
            path: '/accounts/privacy'
        },
        {
            icon: <Lock size={20} />,
            label: 'Bloqueados',
            path: '/accounts/blocked'
        },
        {
            icon: <MessageSquare size={20} />,
            label: 'Comentários',
            path: '/accounts/comments'
        },
        {
            icon: <Globe size={20} />,
            label: 'Idioma',
            path: '/accounts/language'
        },
        {
            icon: <BadgeCheck size={20} />,
            label: 'Selo de Verificação',
            path: '/accounts/verification'
        }
    ];

    return (
        <div className='h-[100vh] flex bg-white overflow-y-hidden relative'>
            {/* Botão de menu móvel */}
            <button 
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 bg-indigo-500 text-white p-2 rounded-full shadow-lg"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Overlay para fechar o menu quando clicado fora (apenas em mobile) */}
            {sidebarOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`h-[100vh] w-[280px] md:w-[350px] bg-gray-50 border-r p-4 md:p-8 gap-4 overflow-y-auto fixed md:static z-40 transition-all duration-300 ${sidebarOpen ? 'left-0' : '-left-[280px] md:left-0'}`}>
                <h1 className='text-2xl font-bold'>Definições</h1>
                <div className="w-full  shadow-xl bg-white rounded-3xl hover:bg-gray-100 shadow-gray-100 hover:shadow-gray-200 p-5 flex flex-col justify-between">
                    <div>
                        <span className="font-bold text-xl">
                            <span className="text-indigo-500">Sky</span>Venda <span className="text-indigo-500">MZ</span>
                        </span>
                        <h1 className="font-bold text-lg mt-2">Centro de Configurações</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Configure facilmente os seus dados da SkyVenda MZ.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-indigo-500 cursor-pointer transition">
                            <User className="text-gray-400" size={25}/>
                            <span>Dados Pessoais</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-indigo-500 cursor-pointer transition">
                            <FaShieldAlt className="text-gray-400" size={24}/>
                            <span>Segurança e Palavra-passe</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm hover:text-indigo-500 cursor-pointer transition">
                            <Megaphone className="text-gray-400" size={25}/>
                            <span>Preferências da publicidade</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    {menuItems.map((item, index) => (
                        <Link
                            to={item.path}
                            key={index}
                            className={`flex gap-2 items-center rounded-md py-4 px-6 cursor-pointer transition ${
                                location.pathname === item.path
                                    ? 'bg-gray-200 text-indigo-500'
                                    : 'hover:bg-gray-200 text-gray-600'
                            }`}
                        >
                            <span className={`${location.pathname === item.path ? 'text-indigo-500' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex flex-1 overflow-y-auto pl-0 md:pl-[350px] w-full transition-all duration-300">
                <div className="container mx-auto p-4 pt-16 md:pt-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
