import { Bell } from 'lucide-react';
import { useWebSocket } from './websocket/WebSocketProvider';
import { useEffect, useState } from 'react';

export function NotificationBell() {
  // Usar o hook useWebSocket para obter a contagem de notificações
  const { notificationCount, resetNotificationCount } = useWebSocket();
  // Estado local para controlar a exibição do badge
  const [showBadge, setShowBadge] = useState(false);
  
  // Forçar o valor para zero se não for um número válido ou for menor que zero
  const safeCount = (!notificationCount || isNaN(notificationCount) || notificationCount < 0) ? 0 : notificationCount;
  
  // Atualizar o estado do badge apenas quando o contador mudar
  useEffect(() => {
    console.log('NotificationBell: Contador atual:', safeCount);
    
    // Só mostrar o badge se o contador for maior que zero
    if (safeCount > 0) {
      setShowBadge(true);
    } else {
      setShowBadge(false);
    }
  }, [safeCount]);

  // Função para lidar com o clique no sino
  const handleClick = () => {
    // Resetar a contagem de notificações no WebSocketProvider
    resetNotificationCount();
    // Forçar a remoção do badge imediatamente
    setShowBadge(false);
    console.log('NotificationBell: Resetando contador e ocultando badge');
  };

  return (
    <div className="relative">
      <button
        className="p-2.5 rounded-full hover:bg-indigo-50 transition-colors relative group"
        aria-label="Notifications"
        onClick={handleClick}
      >
        <Bell className="w-5 h-5 text-gray-600 group-hover:text-gray-700" />
        
        {/* Só mostrar o badge se showBadge for true */}
        {showBadge && (
          <div className="absolute -top-2 -right-1 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-indigo-500 text-[10px] font-bold text-white border-2 border-white">
              {safeCount > 99 ? '99+' : safeCount}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}