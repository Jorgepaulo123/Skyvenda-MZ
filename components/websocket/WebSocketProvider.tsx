import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
// @ts-ignore - Ignorando erro de tipagem para o AuthContext
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { base_url } from '../../api/api';

interface WebSocketContextType {
  connected: boolean;
  lastMessage: any | null;
  sendMessage: (message: any) => void;
  notificationCount: number;
  resetNotificationCount: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  lastMessage: null,
  sendMessage: () => {},
  notificationCount: 0,
  resetNotificationCount: () => {}
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const disconnectSound = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar os sons
  useEffect(() => {
    console.log('WebSocket: Inicializando sons de notificação');
    notificationSound.current = new Audio('/sound.ogg');
    disconnectSound.current = new Audio('/disconnect.ogg');
  }, []);
  
  // Buscar contagem inicial de notificações não lidas
  useEffect(() => {
    if (token && user) {
      console.log('WebSocket: Buscando contagem inicial de notificações não lidas');
      
      const fetchNotificacoesNaoLidas = async () => {
        try {
          const response = await fetch(
            'https://skyvendas-production.up.railway.app/usuario/notificacoes/estatisticas',
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log('WebSocket: Estatísticas iniciais de notificações:', data);
            
            if (data && typeof data.nao_lidas === 'number') {
              console.log('WebSocket: Definindo contagem inicial para', data.nao_lidas);
              setNotificationCount(data.nao_lidas);
            }
          } else {
            console.error('WebSocket: Erro ao buscar estatísticas de notificações:', response.status);
          }
        } catch (error) {
          console.error('WebSocket: Erro ao buscar estatísticas de notificações:', error);
        }
      };
      
      fetchNotificacoesNaoLidas();
    }
  }, [token, user]);
  
  // Função para tocar o som de notificação
  const playNotificationSound = () => {
    console.log('WebSocket: Tentando tocar som de notificação');
    if (notificationSound.current) {
      notificationSound.current.currentTime = 0;
      notificationSound.current.play().catch(error => {
        console.warn('WebSocket: Erro ao tocar som de notificação:', error);
      });
    } else {
      console.warn('WebSocket: Som de notificação não inicializado');
    }
  };
  
  // Função para resetar a contagem de notificações
  const resetNotificationCount = () => {
    console.log('WebSocket: Resetando contagem de notificações');
    setNotificationCount(0);
    
    // Também enviar requisição para marcar todas as notificações como lidas no backend
    if (token) {
      console.log('WebSocket: Enviando requisição para marcar todas as notificações como lidas');
      fetch('https://skyvendas-production.up.railway.app/usuario/notificacoes/marcar-todas-como-lidas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          console.log('WebSocket: Todas as notificações marcadas como lidas com sucesso');
        } else {
          console.error('WebSocket: Erro ao marcar notificações como lidas:', response.status);
        }
      })
      .catch(error => {
        console.error('WebSocket: Erro na requisição para marcar notificações como lidas:', error);
      });
    }
  };

  useEffect(() => {
    if (!token || !user) {
      console.log('WebSocket: Sem token ou usuário, não conectando');
      return;
    }

    console.log('WebSocket: Iniciando conexão com token e ID de usuário:', user.id);
    
    // URL do WebSocket (padronizada em /ws com token no query)
    const apiUrl = new URL(base_url);
    const proto = apiUrl.protocol === 'https:' ? 'wss' : 'ws';
    const host = apiUrl.host; // inclui porta se houver
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    const wsUrl = `${proto}://${host}/ws${query}`;
    console.log('%cWebSocket: Tentando conectar em: ' + wsUrl, 'color: blue; font-weight: bold');
    console.log('WebSocket: ID do usuário:', user.id);
    console.log('WebSocket: Token disponível:', !!token);
    
    // Criar nova conexão WebSocket
    const ws = new WebSocket(wsUrl);
    
    // Manipulador de evento de abertura da conexão
    ws.onopen = () => {
      console.log('WebSocket: Conexão estabelecida com sucesso');
      setSocket(ws);
      setConnected(true);
      
      // Enviar mensagem de autenticação se necessário
      console.log('WebSocket: Enviando token para autenticação');
      ws.send(JSON.stringify({
        type: 'authenticate',
        token: token
      }));
    };
    
    // Manipulador de evento de fechamento da conexão
    ws.onclose = (event) => {
      console.log(`WebSocket: Conexão fechada. Código: ${event.code}, Razão: ${event.reason || 'Nenhuma razão fornecida'}`);
      setConnected(false);
      setSocket(null);
      
      // Tocar som de desconexão
      if (disconnectSound.current) {
        console.log('WebSocket: Tocando som de desconexão');
        disconnectSound.current.currentTime = 0;
        disconnectSound.current.play().catch(error => {
          console.error('WebSocket: Erro ao reproduzir som de desconexão:', error);
        });
      }
      
      // Tentar reconectar após 5 segundos
      console.log('WebSocket: Tentando reconectar em 5 segundos...');
      setTimeout(() => {
        console.log('WebSocket: Tentando reconectar agora');
        // Recarregar a página para reconectar
        window.location.reload();
      }, 5000);
    };
    
    // Manipulador de erros
    ws.onerror = (error) => {
      console.error('WebSocket: Erro na conexão:', error);
    };
    
    // Manipulador de mensagens recebidas
    ws.onmessage = (event) => {
      try {
        console.log('%cWebSocket: Mensagem bruta recebida:', 'color: green; font-weight: bold', event.data);
        
        // Converter dados JSON
        const data = JSON.parse(event.data);
        console.log('%cWebSocket: Mensagem processada:', 'color: green; font-weight: bold', data);
        console.log('WebSocket: Tipo da mensagem:', data.type);
        
        // Analisar a estrutura da mensagem para depuração
        console.log('WebSocket: Estrutura da mensagem:');
        console.log('- type:', data.type);
        console.log('- title:', data.title);
        console.log('- message:', data.message);
        console.log('- data:', data.data);
        
        if (data.data) {
          console.log('WebSocket: Conteúdo do campo data:');
          if (data.data.estatisticas) {
            console.log('- estatisticas:', data.data.estatisticas);
            console.log('  - total:', data.data.estatisticas.total);
            console.log('  - nao_lidas:', data.data.estatisticas.nao_lidas);
          }
          if (data.data.notificacao) {
            console.log('- notificacao:', data.data.notificacao);
            console.log('  - aberta:', data.data.notificacao.aberta);
            console.log('  - lida:', data.data.notificacao.lida);
          }
        }
        
        // Atualizar última mensagem
        setLastMessage(data);
        
        // Processar notificações gerais
        if (data.type === 'notification' || data.type === 'notification_update' || data.type === 'notifications_update') {
          console.log('WebSocket: Processando notificação do tipo:', data.type);
          
          // Tocar som de notificação
          playNotificationSound();
          
          // Atualizar contador com base nas estatísticas do backend
          if (data.type === 'notification' || data.type === 'notification_update' || data.type === 'notifications_update') {
            console.log('WebSocket: Atualizando contador de notificações baseado nas estatísticas');
            
            // Verificar se temos estatísticas na mensagem
            if (data.data && data.data.estatisticas && typeof data.data.estatisticas.nao_lidas === 'number') {
              console.log('WebSocket: Estatísticas recebidas:', data.data.estatisticas);
              // Garantir que o valor seja um número válido e não negativo
              const naoLidas = Math.max(0, data.data.estatisticas.nao_lidas);
              console.log('WebSocket: Definindo contador para:', naoLidas);
              setNotificationCount(naoLidas);
            } else if (data.type === 'notification') {
              // Fallback: incrementar contador se não tiver estatísticas
              console.log('WebSocket: Sem estatísticas, incrementando contador manualmente');
              setNotificationCount(prev => Math.max(0, prev + 1));
            }
          }
          
          // Determinar o ícone e a cor com base no tipo de notificação
          let iconPath = '';
          let bgColor = 'bg-indigo-500';
          
          if (data.type === 'notification') {
            // Ícone de sino para novas notificações
            iconPath = 'M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z';
            bgColor = 'bg-indigo-500';
          } else if (data.type === 'notification_update') {
            // Ícone de atualização para atualizações de notificações
            iconPath = 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
            bgColor = 'bg-green-500';
          } else {
            // Ícone de informação para outros tipos
            iconPath = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
            bgColor = 'bg-blue-500';
          }
          
          console.log('WebSocket: Exibindo toast de notificação');
          // Mostrar toast de notificação que desaparece em 5 segundos
          toast(
            <div className="flex items-start p-1">
              <div className="flex-shrink-0 pt-0.5">
                <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center shadow-lg`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {data.title || 'Nova notificação'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {data.message || 'Você recebeu uma nova notificação'}
                </p>
              </div>
            </div>,
            {
              duration: 5000, // 5 segundos
              position: 'top-right',
              style: {
                background: '#fff',
                color: '#000',
                padding: '16px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: '350px',
                border: '1px solid #f0f0f0'
              },
            }
          );
          
          // Disparar evento personalizado para componentes que escutam notificações
          console.log('WebSocket: Disparando evento personalizado new-notification');
          const notificationEvent = new CustomEvent('new-notification', { 
            detail: data 
          });
          window.dispatchEvent(notificationEvent);
          console.log('WebSocket: Evento disparado com sucesso');
        }

        // Processar eventos financeiros para atualizar saldo em tempo real
        const financialTypes = new Set([
          'payment_success',
          'payment_failed',
          'withdrawal_success',
          'withdrawal_failed',
          'deposit_success',
          'deposit_failed',
        ]);

        if (financialTypes.has(data.type)) {
          // Atualiza saldo global
          console.log('WebSocket: Evento financeiro recebido, atualizando saldo:', data.type);
          window.dispatchEvent(new CustomEvent('wallet:refresh-balance', { detail: data }));

          // Toast amigável
          const success = data.type.endsWith('success');
          toast(
            <div className="flex items-start p-1">
              <div className="flex-shrink-0 pt-0.5">
                <div className={`h-10 w-10 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shadow-lg`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={success ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'} />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{data.title || (success ? 'Operação concluída' : 'Operação falhou')}</p>
                <p className="mt-1 text-sm text-gray-500">{data.message || (success ? 'Seu saldo foi atualizado.' : 'Não foi possível concluir a operação.')}</p>
              </div>
            </div>,
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: '#fff',
                color: '#000',
                padding: '16px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: '350px',
                border: '1px solid #f0f0f0'
              },
            }
          );
        }
      } catch (error) {
        console.error('WebSocket: Erro ao processar mensagem:', error);
      }
    };
    
    // Limpar ao desmontar o componente
    return () => {
      console.log('WebSocket: Limpando conexão ao desmontar componente');
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('WebSocket: Fechando conexão existente');
        ws.close();
      }
    };
  }, [token, user]);

  // Função para enviar mensagens pelo WebSocket
  const sendMessage = (message: any) => {
    console.log('WebSocket: Tentando enviar mensagem:', message);
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Enviando mensagem');
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket: Não foi possível enviar mensagem - socket não conectado');
      console.log('WebSocket: Estado atual do socket:', socket ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][socket.readyState] : 'null');
    }
  };

  return (
    <WebSocketContext.Provider value={{ 
      connected, 
      lastMessage, 
      sendMessage, 
      notificationCount,
      resetNotificationCount
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};
