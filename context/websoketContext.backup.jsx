import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { base_url } from "../api/api";
import api from "../api/api";

const WebSocketContext = createContext(null);

// Ensure proper protocol conversion by using replace with full protocol strings
const WS_URL = base_url.replace('http://', 'ws://').replace('https://', 'wss://');

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [webSocketConnected, setWebSocketConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { token, isAuthenticated, user } = useAuth();
  const [newMessage, setNewMessage] = useState(0);
  const [newNotification,setNewNotification] = useState(0);
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

  const handleIncomingMessage = useCallback(async (messageData) => {
    const { from_user, content } = messageData;
    console.log("Received message from user ID:", from_user, "Type:", typeof from_user);
    console.log("Full message data:", messageData);

    // Toca o som de notificação se não for o chat ativo
    const isActiveChat = selectedUser && (String(selectedUser.id) === String(from_user));
    if (!isActiveChat) {
      await playNotificationSound();
    }

    // Normalize ID - ensure it's always a string
    const normalizedUserId = String(from_user);
    
    // Check if we already have this message to prevent duplicates
    const isDuplicate = (existingChats) => {
      return existingChats.some(chat => 
        chat.mensagens && chat.mensagens.some(msg => 
          (messageData.message_id && msg.message_id === messageData.message_id) ||
          (messageData.id && msg.id === messageData.id)
        )
      );
    };

    // First check if the user already exists in our chats
    const userExists = (existingChats) => {
      return existingChats.some(chat => String(chat.id) === normalizedUserId);
    };
    
    // Create new message object
    const newMessage = {
      id: messageData.id || Date.now(),
      message_id: messageData.message_id || null,
      sender_id: normalizedUserId,
      receiver_id: user?.id,
      content: content,
      message_type: messageData.message_type || 'text',
      file_url: messageData.file_url || null,
      file_name: messageData.file_name || null,
      file_size: messageData.file_size || null,
      is_delivered: true,
      reaction: messageData.reaction || null,
      is_read: isActiveChat, // Mark as read only if it's the active chat
      created_at: messageData.created_at || new Date().toISOString(),
      reply_to_id: messageData.reply_to_id || null,
      status: 'received'
    };

    // Check if we need to fetch user info
    if (!userExists(chats) && !isDuplicate(chats)) {
      try {
        console.log("Fetching info for new user:", normalizedUserId);
        const response = await api.get(`/usuario/perfil/${normalizedUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("User info received:", response.data);
        
        // Now update the chats with the new user info and message
        setChats(prevChats => {
          // Check again if the user was added while we were fetching
          if (userExists(prevChats) || isDuplicate(prevChats)) {
            // User was added while we were fetching, just update the existing chat
            return prevChats.map(chat => {
              if (String(chat.id) === normalizedUserId) {
                // Check if message already exists
                const messageExists = chat.mensagens.some(msg => 
                  (messageData.message_id && msg.message_id === messageData.message_id) ||
                  (messageData.id && msg.id === messageData.id)
                );
                
                if (messageExists) {
                  return chat; // Don't add duplicate message
                }
                
                // Add message to existing chat
                const updatedChat = {
                  ...chat,
                  mensagens: [...chat.mensagens, newMessage],
                  total_news_msgs: isActiveChat ? chat.total_news_msgs : (chat.total_news_msgs || 0) + 1
                };
                
                // Update selected user if needed
                if (selectedUser && String(selectedUser.id) === normalizedUserId) {
                  setSelectedUser(updatedChat);
                }
                
                return updatedChat;
              }
              return chat;
            });
          }
          
          // Create new chat with the user info
          const newChat = {
            id: normalizedUserId,
            nome: response.data.nome,
            username: response.data.username,
            foto: response.data.foto_perfil,
            mensagens: [newMessage],
            total_news_msgs: 1
          };
          
          // Update selected user if needed
          if (selectedUser && String(selectedUser.id) === normalizedUserId) {
            setSelectedUser(newChat);
          }
          
          // Add new chat to the top of the list
          return [newChat, ...prevChats];
        });
      } catch (error) {
        console.error('Error fetching new user info:', error);
      }
    } else {
      // User exists, just update the chat with the new message
      setChats(prevChats => {
        // Check for duplicate message
        if (isDuplicate(prevChats)) {
          return prevChats; // Don't add duplicate message
        }
        
        // Find the chat to update
        const chatIndex = prevChats.findIndex(chat => String(chat.id) === normalizedUserId);
        
        if (chatIndex !== -1) {
          // Update existing chat
          const chat = prevChats[chatIndex];
          const updatedChat = {
            ...chat,
            mensagens: [...chat.mensagens, newMessage],
            total_news_msgs: isActiveChat ? chat.total_news_msgs : (chat.total_news_msgs || 0) + 1
          };
          
          // Update selected user if needed
          if (selectedUser && String(selectedUser.id) === normalizedUserId) {
            setSelectedUser(updatedChat);
          }
          
          // Move updated chat to the top
          const newChats = prevChats.filter((_, i) => i !== chatIndex);
          return [updatedChat, ...newChats];
        }
        
        return prevChats;
      });
    }
  }, [user, selectedUser, token, playNotificationSound, chats]);

  const updateMessageById = useCallback((messageId, updateFn) => {
    if (!messageId) return;
    
    // Se temos um chat selecionado, atualizamos ele primeiro
    if (selectedUser) {
      setSelectedUser(prev => {
        if (!prev.mensagens) return prev;
        
        const updatedMensagens = prev.mensagens.map(msg => {
          if (msg.message_id === messageId || msg.id === messageId) {
            return updateFn(msg);
          }
          return msg;
        });
        
        return {
          ...prev,
          mensagens: updatedMensagens
        };
      });
    }
    
    // Depois atualizamos os chats
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (!chat.mensagens) return chat;
        
        const updatedMensagens = chat.mensagens.map(msg => {
          if (msg.message_id === messageId || msg.id === messageId) {
            return updateFn(msg);
          }
          return msg;
        });
        
        return {
          ...chat,
          mensagens: updatedMensagens
        };
      });

      return updatedChats;
    });
  }, [selectedUser]);

  // Função para lidar com notificações
  const handleNotification = useCallback((notification) => {
    if (notification.type === 'user_connected' || notification.type === 'user_disconnected') {
      // Implemente a lógica de status online/offline aqui
    }
    playNotificationSound();
  }, [playNotificationSound]);

  // Função para enviar mensagem via WebSocket
  const sendWebSocketMessage = useCallback((type, content, toUser, additionalData = {}) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type,
        to_user: toUser,
        content,
        ...additionalData
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const connectWebSocket = useCallback(() => {
    // Não tentar conectar se já estiver conectado ou em processo de reconexão
    if (webSocketConnected || isReconnecting || !isAuthenticated || !token || !isOnline) return;

    setIsReconnecting(true);
    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket conectado!");
      setWebSocketConnected(true);
      setIsReconnecting(false);
    };
  
    // We'll handle all messages in the event listener instead of here
    // to avoid duplicate processing

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
      setWebSocketConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado!");
      setWebSocketConnected(false);
      if (isOnline && isAuthenticated) {
        console.log("Tentando reconectar em 10 segundos...");
        setTimeout(() => {
          setIsReconnecting(false);
          connectWebSocket();
        }, 10000); // 10 segundos entre tentativas
      }
    };

    setSocket(ws);
    return ws;
  }, [token, isAuthenticated, isOnline, webSocketConnected, isReconnecting, handleIncomingMessage, updateMessageById]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Conexão de internet restaurada");
      setIsOnline(true);
      if (!webSocketConnected) {
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

    // Iniciar conexão WebSocket se estiver online
    let ws = null;
    if (isOnline && !webSocketConnected) {
      ws = connectWebSocket();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (ws) {
        ws.close();
        setWebSocketConnected(false);
        console.log("WebSocket fechado!");
      }
    };
  }, [connectWebSocket, socket, webSocketConnected]);

  const handleMessageDeleted = useCallback((data) => {
    const { message_id, deleted_by, deleted_for_all } = data;
    
    if (!message_id) {
      console.error("Received message deletion notification without message_id");
      return;
    }
    
    console.log("===== RECEBIDA NOTIFICAÇÃO DE MENSAGEM DELETADA =====");
    console.log("Dados da mensagem deletada:", data);
    console.log("Tipo do message_id:", typeof message_id);
    
    // Converter para string para garantir comparações consistentes
    const deletedId = String(message_id);
    
    // Process deletion only if it's for all users
    if (deleted_for_all) {
      console.log("Processando exclusão para todos os usuários");
      
      // Update selectedUser if we have it open
      if (selectedUser) {
        console.log("Atualizando usuário selecionado:", selectedUser.id);
        
        setSelectedUser(prev => {
          if (!prev || !prev.mensagens) {
            console.log("Nenhuma mensagem no chat selecionado");
            return prev;
          }
          
          const mensagensAntes = prev.mensagens.length;
          
          // Filtra as mensagens com o ID específico
          const filteredMessages = prev.mensagens.filter(msg => {
            // Garantir que a comparação seja string vs string
            const msgId = String(msg.message_id || '');
            const isToKeep = msgId !== deletedId;
            
            if (!isToKeep) {
              console.log(`Mensagem ${msgId} será removida do chat selecionado`);
            }
            
            return isToKeep;
          });
          
          const mensagensDepois = filteredMessages.length;
          console.log(`Removed message ${deletedId} from selected chat. 
                      Mensagens antes: ${mensagensAntes}, 
                      depois: ${mensagensDepois},
                      diferença: ${mensagensAntes - mensagensDepois}`);
          
          return {
            ...prev,
            mensagens: filteredMessages
          };
        });
      } else {
        console.log("Nenhum chat selecionado atualmente");
      }
      
      // Update all chats
      setChats(prevChats => {
        console.log("Atualizando todos os chats:", prevChats.length);
        
        const updatedChats = prevChats.map(chat => {
          if (!chat || !chat.mensagens) {
            return chat;
          }
          
          const mensagensAntes = chat.mensagens.length;
          
          // Filtra as mensagens mantendo apenas as que NÃO têm o message_id correspondente
          const filteredMessages = chat.mensagens.filter(msg => {
            // Garantir que estamos comparando strings
            const msgId = String(msg.message_id || '');
            const isToKeep = msgId !== deletedId;
            
            if (!isToKeep && chat.id) {
              console.log(`Mensagem ${msgId} será removida do chat ${chat.id}`);
            }
            
            return isToKeep;
          });
          
          const mensagensDepois = filteredMessages.length;
          const diff = mensagensAntes - mensagensDepois;
          
          if (diff > 0) {
            console.log(`Chat ${chat.id} - Mensagens antes: ${mensagensAntes}, depois: ${mensagensDepois}, removidas: ${diff}`);
          }
          
          return {
            ...chat,
            mensagens: filteredMessages
          };
        });
        
        console.log("Chats atualizados após exclusão");
        return updatedChats;
      });
    } else {
      console.log("A exclusão é apenas para um usuário, não precisamos processar");
    }
    
    console.log("===== FIM DO PROCESSAMENTO DE MENSAGEM DELETADA =====");
  }, [selectedUser]);

  useEffect
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";
import { base_url } from "../api/api";
import api from "../api/api";

const WebSocketContext = createContext(null);

// Ensure proper protocol conversion by using replace with full protocol strings
const WS_URL = base_url.replace('http://', 'ws://').replace('https://', 'wss://');

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [webSocketConnected, setWebSocketConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { token, isAuthenticated, user } = useAuth();
  const [newMessage, setNewMessage] = useState(0);
  const [newNotification,setNewNotification] = useState(0);
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

  const handleIncomingMessage = useCallback(async (messageData) => {
    const { from_user, content } = messageData;
    console.log("Received message from user ID:", from_user, "Type:", typeof from_user);
    console.log("Full message data:", messageData);

    // Toca o som de notificação se não for o chat ativo
    const isActiveChat = selectedUser && (String(selectedUser.id) === String(from_user));
    if (!isActiveChat) {
      await playNotificationSound();
    }

    // Normalize ID - ensure it's always a string
    const normalizedUserId = String(from_user);
    
    // Check if we already have this message to prevent duplicates
    const isDuplicate = (existingChats) => {
      return existingChats.some(chat => 
        chat.mensagens && chat.mensagens.some(msg => 
          (messageData.message_id && msg.message_id === messageData.message_id) ||
          (messageData.id && msg.id === messageData.id)
        )
      );
    };

    // First check if the user already exists in our chats
    const userExists = (existingChats) => {
      return existingChats.some(chat => String(chat.id) === normalizedUserId);
    };
    
    // Create new message object
    const newMessage = {
      id: messageData.id || Date.now(),
      message_id: messageData.message_id || null,
      sender_id: normalizedUserId,
      receiver_id: user?.id,
      content: content,
      message_type: messageData.message_type || 'text',
      file_url: messageData.file_url || null,
      file_name: messageData.file_name || null,
      file_size: messageData.file_size || null,
      is_delivered: true,
      reaction: messageData.reaction || null,
      is_read: isActiveChat, // Mark as read only if it's the active chat
      created_at: messageData.created_at || new Date().toISOString(),
      reply_to_id: messageData.reply_to_id || null,
      status: 'received'
    };

    // Check if we need to fetch user info
    if (!userExists(chats) && !isDuplicate(chats)) {
      try {
        console.log("Fetching info for new user:", normalizedUserId);
        const response = await api.get(`/usuario/perfil/${normalizedUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("User info received:", response.data);
        
        // Now update the chats with the new user info and message
        setChats(prevChats => {
          // Check again if the user was added while we were fetching
          if (userExists(prevChats) || isDuplicate(prevChats)) {
            // User was added while we were fetching, just update the existing chat
            return prevChats.map(chat => {
              if (String(chat.id) === normalizedUserId) {
                // Check if message already exists
                const messageExists = chat.mensagens.some(msg => 
                  (messageData.message_id && msg.message_id === messageData.message_id) ||
                  (messageData.id && msg.id === messageData.id)
                );
                
                if (messageExists) {
                  return chat; // Don't add duplicate message
                }
                
                // Add message to existing chat
                const updatedChat = {
                  ...chat,
                  mensagens: [...chat.mensagens, newMessage],
                  total_news_msgs: isActiveChat ? chat.total_news_msgs : (chat.total_news_msgs || 0) + 1
                };
                
                // Update selected user if needed
                if (selectedUser && String(selectedUser.id) === normalizedUserId) {
                  setSelectedUser(updatedChat);
                }
                
                return updatedChat;
              }
              return chat;
            });
          }
          
          // Create new chat with the user info
          const newChat = {
            id: normalizedUserId,
            nome: response.data.nome,
            username: response.data.username,
            foto: response.data.foto_perfil,
            mensagens: [newMessage],
            total_news_msgs: 1
          };
          
          // Update selected user if needed
          if (selectedUser && String(selectedUser.id) === normalizedUserId) {
            setSelectedUser(newChat);
          }
          
          // Add new chat to the top of the list
          return [newChat, ...prevChats];
        });
      } catch (error) {
        console.error('Error fetching new user info:', error);
      }
    } else {
      // User exists, just update the chat with the new message
      setChats(prevChats => {
        // Check for duplicate message
        if (isDuplicate(prevChats)) {
          return prevChats; // Don't add duplicate message
        }
        
        // Find the chat to update
        const chatIndex = prevChats.findIndex(chat => String(chat.id) === normalizedUserId);
        
        if (chatIndex !== -1) {
          // Update existing chat
          const chat = prevChats[chatIndex];
          const updatedChat = {
            ...chat,
            mensagens: [...chat.mensagens, newMessage],
            total_news_msgs: isActiveChat ? chat.total_news_msgs : (chat.total_news_msgs || 0) + 1
          };
          
          // Update selected user if needed
          if (selectedUser && String(selectedUser.id) === normalizedUserId) {
            setSelectedUser(updatedChat);
          }
          
          // Move updated chat to the top
          const newChats = prevChats.filter((_, i) => i !== chatIndex);
          return [updatedChat, ...newChats];
        }
        
        return prevChats;
      });
    }
  }, [user, selectedUser, token, playNotificationSound, chats]);

  const updateMessageById = useCallback((messageId, updateFn) => {
    if (!messageId) return;
    
    // Se temos um chat selecionado, atualizamos ele primeiro
    if (selectedUser) {
      setSelectedUser(prev => {
        if (!prev.mensagens) return prev;
        
        const updatedMensagens = prev.mensagens.map(msg => {
          if (msg.message_id === messageId || msg.id === messageId) {
            return updateFn(msg);
          }
          return msg;
        });
        
        return {
          ...prev,
          mensagens: updatedMensagens
        };
      });
    }
    
    // Depois atualizamos os chats
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (!chat.mensagens) return chat;
        
        const updatedMensagens = chat.mensagens.map(msg => {
          if (msg.message_id === messageId || msg.id === messageId) {
            return updateFn(msg);
          }
          return msg;
        });
        
        return {
          ...chat,
          mensagens: updatedMensagens
        };
      });

      return updatedChats;
    });
  }, [selectedUser]);

  // Função para lidar com notificações
  const handleNotification = useCallback((notification) => {
    if (notification.type === 'user_connected' || notification.type === 'user_disconnected') {
      // Implemente a lógica de status online/offline aqui
    }
    playNotificationSound();
  }, [playNotificationSound]);

  // Função para enviar mensagem via WebSocket
  const sendWebSocketMessage = useCallback((type, content, toUser, additionalData = {}) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type,
        to_user: toUser,
        content,
        ...additionalData
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const connectWebSocket = useCallback(() => {
    // Não tentar conectar se já estiver conectado ou em processo de reconexão
    if (webSocketConnected || isReconnecting || !isAuthenticated || !token || !isOnline) return;

    setIsReconnecting(true);
    const ws = new WebSocket(`${WS_URL}/ws?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket conectado!");
      setWebSocketConnected(true);
      setIsReconnecting(false);
    };
  
    // We'll handle all messages in the event listener instead of here
    // to avoid duplicate processing

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
      setWebSocketConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket desconectado!");
      setWebSocketConnected(false);
      if (isOnline && isAuthenticated) {
        console.log("Tentando reconectar em 10 segundos...");
        setTimeout(() => {
          setIsReconnecting(false);
          connectWebSocket();
        }, 10000); // 10 segundos entre tentativas
      }
    };

    setSocket(ws);
    return ws;
  }, [token, isAuthenticated, isOnline, webSocketConnected, isReconnecting, handleIncomingMessage, updateMessageById]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Conexão de internet restaurada");
      setIsOnline(true);
      if (!webSocketConnected) {
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

    // Iniciar conexão WebSocket se estiver online
    let ws = null;
    if (isOnline && !webSocketConnected) {
      ws = connectWebSocket();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (ws) {
        ws.close();
        setWebSocketConnected(false);
        console.log("WebSocket fechado!");
      }
    };
  }, [connectWebSocket, socket, webSocketConnected]);

  const handleMessageDeleted = useCallback((data) => {
    const { message_id, deleted_by, deleted_for_all } = data;
    
    if (!message_id) {
      console.error("Received message deletion notification without message_id");
      return;
    }
    
    console.log("===== RECEBIDA NOTIFICAÇÃO DE MENSAGEM DELETADA =====");
    console.log("Dados da mensagem deletada:", data);
    console.log("Tipo do message_id:", typeof message_id);
    
    // Converter para string para garantir comparações consistentes
    const deletedId = String(message_id);
    
    // Process deletion only if it's for all users
    if (deleted_for_all) {
      console.log("Processando exclusão para todos os usuários");
      
      // Update selectedUser if we have it open
      if (selectedUser) {
        console.log("Atualizando usuário selecionado:", selectedUser.id);
        
        setSelectedUser(prev => {
          if (!prev || !prev.mensagens) {
            console.log("Nenhuma mensagem no chat selecionado");
            return prev;
          }
          
          const mensagensAntes = prev.mensagens.length;
          
          // Filtra as mensagens com o ID específico
          const filteredMessages = prev.mensagens.filter(msg => {
            // Garantir que a comparação seja string vs string
            const msgId = String(msg.message_id || '');
            const isToKeep = msgId !== deletedId;
            
            if (!isToKeep) {
              console.log(`Mensagem ${msgId} será removida do chat selecionado`);
            }
            
            return isToKeep;
          });
          
          const mensagensDepois = filteredMessages.length;
          console.log(`Removed message ${deletedId} from selected chat. 
                      Mensagens antes: ${mensagensAntes}, 
                      depois: ${mensagensDepois},
                      diferença: ${mensagensAntes - mensagensDepois}`);
          
          return {
            ...prev,
            mensagens: filteredMessages
          };
        });
      } else {
        console.log("Nenhum chat selecionado atualmente");
      }
      
      // Update all chats
      setChats(prevChats => {
        console.log("Atualizando todos os chats:", prevChats.length);
        
        const updatedChats = prevChats.map(chat => {
          if (!chat || !chat.mensagens) {
            return chat;
          }
          
          const mensagensAntes = chat.mensagens.length;
          
          // Filtra as mensagens mantendo apenas as que NÃO têm o message_id correspondente
          const filteredMessages = chat.mensagens.filter(msg => {
            // Garantir que estamos comparando strings
            const msgId = String(msg.message_id || '');
            const isToKeep = msgId !== deletedId;
            
            if (!isToKeep && chat.id) {
              console.log(`Mensagem ${msgId} será removida do chat ${chat.id}`);
            }
            
            return isToKeep;
          });
          
          const mensagensDepois = filteredMessages.length;
          const diff = mensagensAntes - mensagensDepois;
          
          if (diff > 0) {
            console.log(`Chat ${chat.id} - Mensagens antes: ${mensagensAntes}, depois: ${mensagensDepois}, removidas: ${diff}`);
          }
          
          return {
            ...chat,
            mensagens: filteredMessages
          };
        });
        
        console.log("Chats atualizados após exclusão");
        return updatedChats;
      });
    } else {
      console.log("A exclusão é apenas para um usuário, não precisamos processar");
    }
    
    console.log("===== FIM DO PROCESSAMENTO DE MENSAGEM DELETADA =====");
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    
    const handleSocketMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket: Mensagem recebida:", data);
        
        switch(data.type) {
          case 'message':
            // We already handle this in the onmessage handler of the socket
            // Don't call handleIncomingMessage again to avoid duplicates
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
            // Handle messages being read by the other user
            if (data.data && data.data.message_ids && Array.isArray(data.data.message_ids)) {
              data.data.message_ids.forEach(msgId => {
                updateMessageById(msgId, msg => ({
                  ...msg,
                  is_read: true
                }));
              });
            }
            break;
            
          case 'message_deleted':
            console.log("===== MENSAGEM DELETADA RECEBIDA =====");
            console.log("Dados:", data.data);
            handleMessageDeleted(data.data);
            console.log("===== FIM PROCESSAMENTO MENSAGEM DELETADA =====");
            break;
            
          case 'user_typing':
            setUserTyping(data.data.username);
            // Auto-clear typing indicator after 3 seconds
            setTimeout(() => setUserTyping(null), 3000);
            break;
            
          case 'recording':
            if (data.data.status === 'start') {
              setUserRecording(`${data.data.username}`);
            } else if (data.data.status === 'stop') {
              setUserRecording(null);
            }
            break;
            
          case 'user_status':
            // Handle user online/offline status updates
            if (data.data && data.data.user_id && data.data.status) {
              console.log(`User ${data.data.username} is now ${data.data.status}`);
              // You could update a list of online users here
            }
            break;
            
          case 'notification':
            playNotificationSound();
            setNewNotification(prev => prev + 1);
            break;
            
          default:
            console.log('Unknown message type:', data);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    socket.addEventListener('message', handleSocketMessage);
    
    return () => {
      socket.removeEventListener('message', handleSocketMessage);
    };
  }, [socket, handleIncomingMessage, updateMessageById, handleMessageDeleted, playNotificationSound]);

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
