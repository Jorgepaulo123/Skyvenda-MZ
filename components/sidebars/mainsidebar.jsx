import React, { useContext, useEffect, useState } from 'react';
import { 
  Store, 
  Home, 
  ShoppingBag, 
  ClipboardList, 
  Megaphone, 
  Newspaper, 
  BarChart2, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../context/AuthContext';
import { HomeContext } from '../../context/HomeContext';

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
  const { myorders } = useContext(HomeContext);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (myorders && myorders.length > 0) {
      setOrderCount(myorders.length);
    }
  }, [myorders]);
  
  return (
    <Component
      {...(route ? { href: route } : {})}
      onClick={onClick}
      className={cn(
        "w-full h-11 rounded-lg flex items-center px-3 gap-3",
        "transition-all duration-200 relative group/item",
        "hover:bg-[#f2f2f2]",
        isActive && "bg-[#e6f2fe] text-[#0866ff]",
        variant === 'destructive' && "hover:bg-red-50 text-gray-700 hover:text-red-600"
      )}
    >
      <div className="relative flex items-center justify-center ">
        <Icon className={cn(
          "h-[22px] w-[22px]",
          isActive ? "text-[#0866ff]" : "text-[#050505]",
          variant === 'destructive' && "group-hover/item:text-red-600"
        )} />
        
        {badge !== null && badge > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-1">
            {badge}
          </span>
        )}
      </div>
      
      <span className={cn(
        "text-[15px] font-medium whitespace-nowrap opacity-0",
        "group-hover/sidebar:opacity-100 transition-opacity duration-300",
        isActive ? "text-[#0866ff]" : "text-[#050505]",
        variant === 'destructive' && "group-hover/item:text-red-600"
      )}>
        {label}
      </span>
      
      <div className={cn(
        "absolute left-16 px-3 py-2 bg-[#1c1e21] text-white text-sm rounded-lg",
        "whitespace-nowrap opacity-0 scale-95 pointer-events-none",
        "transition-all duration-200",
        "group-hover/item:opacity-100 group-hover/item:scale-100",
        "group-hover/sidebar:opacity-0"
      )}>
        {label}
      </div>
    </Component>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { myorders } = useContext(HomeContext);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (myorders && myorders.length > 0) {
      setOrderCount(myorders.length);
    }
  }, [myorders]);

  const mainNavItems = [
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
      icon: Users,
      label: "Vendedores",
      route: "/vendedores"
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
    <aside className={cn(
      "w-[62px] hover:w-[280px] h-screen bg-[#ffffff] border-r border-[#e4e6eb]",
      "transition-all duration-300 group/sidebar overflow-hidden",
    )}>
      <div className="flex flex-col h-full">
        {isAuthenticated && user ? (
          <div className="p-2 mb-2 bg-re">
            <div className="relative flex gap-3  rounded-lg hover:bg-gray-50 transition-colors items-center">
              <div className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-white">
                  <AvatarImage 
                    src={`https://storage.googleapis.com/meu-novo-bucket-123/perfil/${user.perfil}` || "https://github.com/shadcn.png"} 
                    alt={user?.nome || "User"} 
                  />
                  <AvatarFallback>
                    {user?.nome?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className={cn(
                  "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white z-10",
                  user?.isOnline ? "bg-green-500" : "bg-green-500"
                )} />
              </div>
              
              <div className="flex flex-col min-w-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "SkyVenda MZ"}
                  </p>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@skyvenda.mz"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 py-3">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-[13px] text-rose-600 mb-2">
                Você não está autenticado na Skyvenda. Faça login ou crie uma conta para sugerirmos melhores produtos para si.
                
              </p>
              <Link href="/login" className="inline-block text-center w-full text-[14px] rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-1.5">
                Login
              </Link>
            </div>
            {/* Links exigidos pelo Google logo abaixo da informação de login */}
            <div className="mt-2 text-xs text-gray-600">
              <Link href="/privacidade" className="text-indigo-600 hover:underline">Política de Privacidade</Link>
              <span className="mx-2 text-gray-400">•</span>
              <Link href="/termos" className="text-indigo-600 hover:underline">Termos de Serviço</Link>
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 space-y-0.5">
          {mainNavItems.map((item) => (
            <NavigationItem 
              key={item.label}
              {...item}
            />
          ))}
        </nav>

        <div className="mt-auto px-2 pb-4 space-y-0.5">
          {footerNavItems.map((item) => (
            <NavigationItem 
              key={item.label}
              {...item}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar