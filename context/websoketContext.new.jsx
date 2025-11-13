import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { base_url } from "../api/api";
import api from "../api/api";

// Configurações do WebSocket
const WS_CONFIG = {
  MAX_RECONNECT_ATTEMPTS: 10,    // Máximo de tentativas de reconexão
  BASE_RECONNECT_DELAY: 1000,    // Delay inicial (1 segundo)
  MAX_RECONNECT_DELAY: 30000,    // Delay máximo (30 segundos)
  PING_INTERVAL: 15000,          // Intervalo de ping (15 segundos)
  PONG_TIMEOUT: 30000            // Timeout para pong (30 segundos)
};

const WebSocketContext = createContext(null);

// Ensure proper protocol conversion by using replace with full protocol strings
const WS_URL = base_url.replace('http://', 'ws://').replace('https://', 'wss://');

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [webSocketConnected, setWebSocketConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { token, isAuthenticated, user } = useAuth();
  const [newMessage, setNewMessage] = useState(0);
  const [newNotification, setNewNotification] = useState(0);
  const [userTyping, setUserTyping] = useState(null);
  const [userRecording, setUserRecording] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const notificationSound = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);
  const pingInterval = useRef(null);
  const lastPongTime = useRef(Date.now());
  const messageQueue = useRef([]);

  // Inicializa o som de notificação
  useEffect(() => {
    const audio = new Audio('/sound.ogg');
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', () => {
      setSoundLoaded(true);
      notificationSound.current = audio;
    });
    audio.addEventListener('error', (e) => {
      console.error('Erro ao carregar o som:', e);
    });

    return () => {
      if (notificationSound.current) {
        notificationSound.current.pause();
        notificationSound.current = null;
      }
    };
  }, []);

  // Função para tocar o som
  const playNotificationSound = useCallback(async () => {
    try {
      if (soundLoaded && notificationSound.current) {
        notificationSound.current.currentTime = 0;
        await notificationSound.current.play();
      }
    } catch (error) {
      console.warn('Não foi possível tocar o som de notificação:', error);
    }
  }, [soundLoaded]);

  // Função para enviar mensagem via WebSocket com sistema de fila
  const sendWebSocketMessage = useCallback((type, content, toUser, additionalData = {}) => {
    const message = {
      type,
      to_user: toUser,
      content,
      timestamp: Date.now(),
      ...additionalData
    };

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      // Adiciona à fila se não estiver conectado
      console.log('WebSocket não conectado. Adicionando mensagem à fila:', message);
      messageQueue.current.push(message);
      
      // Tenta reconectar se não estiver já tentando
      if (!isConnecting && !webSocketConnected) {
        connectWebSocket();
      }
    }
  }, [socket, isConnecting, webSocketConnected]);

  // Função para processar mensagens recebidas
  const handleSocketMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket: Mensagem recebida:", data);
      
      // Atualiza o timestamp do último pong
      if (data.type === 'pong') {
        lastPongTime.current = Date.now();
        return;
      }

      switch(data.type) {
        case 'message':
          handleIncomingMessage(data);
          break;
        
        case 'message_status':
          updateMessageById(data.data.message_id, msg => ({
            ...msg,
            is_delivered: true,
            file_url: data.data.file_url && data.data.file_url.trim() !== '' ? 
                    data.data.file_url : msg.file_url
          }));
          break;
        
        case 'messages_read':
          if (data.data?.message_ids?.length) {
            data.data.message_ids.forEach(msgId => {
              updateMessageById(msgId, msg => ({
                ...msg,
                is_read: true
              }));
            });
          }
          break;
        
        case 'message_deleted':
          handleMessageDeleted(data.data);
          break;
        
        case 'user_typing':
          setUserTyping(data.data.username);
          setTimeout(() => setUserTyping(null), 3000);
          break;
        
        case 'recording':
          setUserRecording(data.data.status === 'start' ? data.data.username : null);
          break;
        
        case 'user_status':
          if (data.data?.user_id && data.data?.status) {
            console.log(`Usuário ${data.data.username} está ${data.data.status}`);
          }
          break;
        
        case 'notification':
          playNotificationSound();
          setNewNotification(prev => prev + 1);
          break;
        
        default:
          console.log('Tipo de mensagem desconhecido:', data);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem do WebSocket:', error);
    }
  }, [handleIncomingMessage, updateMessageById, handleMessageDeleted, playNotificationSound]);

  // Função melhorada de conexão WebSocket
  const connectWebSocket = useCallback(() => {
    if (webSocketConnected || isConnecting || !isAuthenticated || !token || !isOnline) return;

    setIsConnecting(true);
    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket conectado!");
      setWebSocketConnected(true);
      setIsConnecting(false);
      reconnectAttempts.current = 0;

      // Inicia o intervalo de ping
      pingInterval.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
          
          // Verifica se não recebeu pong em tempo hábil
          if (Date.now() - lastPongTime.current > WS_CONFIG.PONG_TIMEOUT) {
            console.log('Não recebeu pong em 30 segundos, reconectando...');
            ws.close();
          }
        }
      }, WS_CONFIG.PING_INTERVAL);

      // Processa mensagens na fila
      while (messageQueue.current.length > 0) {
        const queuedMessage = messageQueue.current.shift();
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(queuedMessage));
        }
      }
    };

    ws.onmessage = handleSocketMessage;

    ws.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
      setWebSocketConnected(false);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado!");
      setWebSocketConnected(false);
      setIsConnecting(false);

      // Limpa o intervalo de ping
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
      }

      // Tenta reconectar com backoff exponencial
      if (isOnline && isAuthenticated && reconnectAttempts.current < WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(
          WS_CONFIG.BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current),
          WS_CONFIG.MAX_RECONNECT_DELAY
        );
        
        console.log(`Tentando reconectar em ${delay/1000} segundos... (Tentativa ${reconnectAttempts.current + 1}/${WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`);
        
        reconnectTimer.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          connectWebSocket();
        }, delay);
      } else if (reconnectAttempts.current >= WS_CONFIG.MAX_RECONNECT_ATTEMPTS) {
        console.log('Número máximo de tentativas de reconexão atingido. Por favor, atualize a página.');
      }
    };

    setSocket(ws);
  }, [token, isAuthenticated, isOnline, webSocketConnected, isConnecting, handleSocketMessage]);

  // Gerenciamento de estado online/offline
  useEffect(() => {
    const handleOnline = () => {
      console.log("Conexão de internet restaurada");
      setIsOnline(true);
      if (!webSocketConnected && !isConnecting) {
        connectWebSocket();
      }
    };

    const handleOffline = () => {
      console.log("Conexão de internet perdida");
      setIsOnline(false);
      if (socket) {
        socket.close();
        setSocket(null);
        setWebSocketConnected(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Inicia conexão WebSocket se estiver online
    if (isOnline && !webSocketConnected && !isConnecting) {
      connectWebSocket();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Limpa todos os recursos
      if (socket) {
        socket.close();
        setWebSocketConnected(false);
      }
      
      if (pingInterval.current) {
        clearInterval(pingInterval.current);
        pingInterval.current = null;
      }
      
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      
      // Limpa a fila de mensagens e reseta tentativas
      messageQueue.current = [];
      reconnectAttempts.current = 0;
    };
  }, [connectWebSocket, socket, webSocketConnected, isConnecting]);

  const contextValue = {
    socket,
    isOnline,
    webSocketConnected,
    reconnect: connectWebSocket,
    newMessage,
    setNewMessage,
    userTyping,
    setUserTyping,
    userRecording,
    setUserRecording,
    chats,
    setChats,
    selectedUser,
    setSelectedUser,
    updateMessageById,
    sendWebSocketMessage,
    handleIncomingMessage,
    notificationSound,
    newNotification
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
