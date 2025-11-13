import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Store, 
  Home, 
  ShoppingBag, 
  ClipboardList, 
  Megaphone, 
  Newspaper, 
  BarChart2,  
  Settings,Bot,
  LogOut, 
  Info,
  Wallet
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import { HomeContext } from '../../context/HomeContext';
import { FaShopify } from 'react-icons/fa';

function NavigationItem({ 
  icon: Icon, 
  label, 
  route,
  variant = 'default',
  onClick,
  badge 
}) {
  const pathname = usePathname();
  const isActive = pathname === route;
  const Component = route ? Link : 'button';
  
  return (
    <Component
      {...(route ? { href: route } : {})}
      onClick={onClick}
      className={cn(
        "w-full rounded-lg flex items-center px-6 py-3 gap-3",
        "transition-all duration-200",
        "hover:bg-gray-100",
        isActive && "bg-[#e6f2fe] text-[#0866ff]",
        variant === 'destructive' && "hover:bg-red-50 text-red-600"
      )}
    >
      <Icon className={cn(
        "w-5 h-5",
        isActive ? "text-[#0866ff]" : "text-gray-700",
        variant === 'destructive' && "text-red-600"
      )} />
      
      <span className={cn(
        "text-[15px] font-medium",
        isActive ? "text-[#0866ff]" : "text-gray-700",
        variant === 'destructive' && "text-red-600"
      )}>
        {label}
      </span>
      
      {badge !== null && badge > 0 && (
        <span className="ml-auto h-5 min-w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-1">
          {badge}
        </span>
      )}
    </Component>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { myorders } = useContext(HomeContext);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (myorders && myorders.length > 0) {
      setOrderCount(myorders.length);
    }
  }, [myorders]);

  const public_navs = [
    {
      icon: Home,
      label: "Pagina Inicial",
      route: "/"
    },
    {
      icon: Store,
      label: "Nhongistas e Lojas",
      route: "/nhonguistas"
    },
  ]

  const mainNavItems = [
    {
      icon: Home,
      label: "Pagina Inicial",
      route: "/"
    },
    {
      icon: Bot,
      label: "assistente SkAI",
      route: "/skai"
    },
    {
      icon: Store,
      label: "Nhongistas e Lojas",
      route: "/nhonguistas"
    },
    {
      icon: ShoppingBag,
      label: "Meus Produtos",
      route: "/produtos"
    },
    {
      icon: ClipboardList,
      label: "Pedidos",
      route: "/pedidos",
      badge: orderCount > 0 ? orderCount : null
    },
    {
      icon: Megaphone,
      label: "Meus Anucios",
      route: "/ads",
    },
    {
      icon: Newspaper,
      label: "Publicacoes",
      route: "/posts",
    },
    {
      icon: BarChart2,
      label: "Visão geral",
      route: "/overview"
    },
    {
      icon: Wallet,
      label: "SkyWallet",
      route: "/wallet"
    }
  ];

  const footerNavItems = [
    {
      icon: Settings,
      label: "Configurações",
      route: "/settings"
    },
    {
      icon: LogOut,
      label: "Sair",
      onClick: logout,
      variant: 'destructive'
    }
  ];

  return (
    <div className="hidden lg:fixed top-0 z-50 max_z_index_xxxl h-[100vh] w-[301px] bg-transparent lg:block 
      hover:bg-white/90 hover:left-0 -left-[300px] hover:shadow-md transition-all duration-300
      rounded-r-2xl group">
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {isAuthenticated && user ? (
          <div className="p-6">
            <Link className="flex items-center space-x-4" href={`/${user.username}`}>
              <Avatar className="h-10 w-10 ring-2 ring-indigo-100">
                <AvatarImage 
                  src={`${user.perfil}` || "https://github.com/shadcn.png"} 
                  alt={user?.nome || "User"} 
                />
                <AvatarFallback>
                  {user?.nome?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "SkyVenda MZ"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@skyvenda.mz"}
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full p-4 ">
                <FaShopify className='text-indigo-500' size={40} />
                <h1 className='text-gray-600 font-bold text-lg'>SkyVenda MZ</h1>
            </div>
)}
        
        <nav className="mt-6">
          <ul className="space-y-1">
            {isAuthenticated ?(
                <>
                    {mainNavItems.map((item) => (
                    <li key={item.label}>
                      <NavigationItem {...item} />
                    </li>
                  ))}
                </>
            ):(
                <div className="flex p-4 flex-col gap-2">
                    <div className='flex gap-2 p-4 border border-l-4 border-l-red-500 rounded-md '>
                        <Info className='text-red-500 ' size={30}/>
                        <span className='font-sans text-gray-600 '>Voce nao esta autenticado na skyvenda, faz login ou crie uma conta para sugerir melhores produtos para si</span>
                    </div>
                    <Link  href='/login' className="flex border border-indigo-500 items-center justify-center transition-all w-full text-indigo-600 p-3 rounded-md hover:bg-indigo-600 hover:text-white">
                        Login
                    </Link>
                    
                </div>
            )}
          </ul>
        </nav>
        
        <div className="absolute bottom-6 w-full">
          <ul className="space-y-1">
            {isAuthenticated&&(
                <>
                {footerNavItems.map((item) => (
                    <li key={item.label}>
                      <NavigationItem {...item} />
                    </li>
                  ))}
                  </> 
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}