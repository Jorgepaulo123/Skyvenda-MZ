"use client";
import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft,Edit,Info, 
  MessageCirclePlus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useWebSocket } from '../../context/websoketContext';
import api, { base_url } from '../../api/api';
import MessageItem from '../../components/chat/ui/MessageItem';
import ChatList from '../../components/chat/ui/chatlist';
import FriendsModal from '../../components/chat/ui/friendsmodal';
import ChatInput from '../../components/chat/ui/ChatInput';
import FilePreview from '../../components/chat/ui/FilePreview';
import EmptyChatState from '../../components/chat/ui/EmptyChatState';
import { generateMessageId, blobToBase64 } from '@/utils/messageUtils';
import { createFilePreview, cleanupMedia } from '@/utils/fileUtils';
import { drawWaveform, processAudioRecording, cleanupAudioRecording, toggleAudioPlayback, cleanupAudioStates, formatAudioDuration } from '@/utils/audioUtils';
import { getLastMessage, filterFriends, createNewChat, updateChatsWithMessage } from '@/utils/chatUtils';
import UserHeader from '../../components/chat/ui/userheader';
import UserInfoSidebar from '../../components/chat/ui/userInfo';
import { HomeContext } from '../../context/HomeContext';


const API_URL = base_url; 

export default function Chat() {
  const { user, token, loading: authLoading, isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();
  const [messageInput, setMessageInput] = useState('');
  
  const [showUser, setShowUser] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [view, setView] = useState('chats');
  const [gettingChats, setGettingChats] = useState(true);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioStates, setAudioStates] = useState({});
  const [pendingUploads, setPendingUploads] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);
  const {socket,newMessage,setNewMessage,userTyping,chats,setChats,setUserTyping,selectedUser, setSelectedUser,userRecording,setUserRecording,} = useWebSocket();
  const notificationSound = useRef(null);
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser?.mensagens]);

  // Ensure AuthContext is loaded when accessing /chat directly
  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token]);

  // Redirect unauthenticated users to login once auth finishes loading
  useEffect(() => {
    if (!authLoading && (!token || !isAuthenticated)) {
      router.push('/login');
    }
  }, [authLoading, token, isAuthenticated, router]);


  useEffect(() => {
    fetchChats();
    fetchFriends();
  }, [token]);

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const response = await axios.get(`${API_URL}/get_friends`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const fetchChats = async () => {
    setGettingChats(true);
    try {
      const response = await axios.get(`${API_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Raw chats from API:", response.data.map(c => ({id: c.id, type: typeof c.id, username: c.username})));
      
      // Clean up the response data to avoid duplicates by username
      const uniqueChats = [];
      const usernames = new Set();
      const seenIds = new Set();
      
      // First pass to collect unique usernames for chats
      response.data.forEach(chat => {
        // Always normalize IDs to strings
        const normalizedId = String(chat.id);
        const chatWithNormalizedId = {
          ...chat,
          id: normalizedId  // Ensure ID is a string
        };
        
        // Check by both ID and username for duplicates
        const isDuplicate = 
          (chat.username && usernames.has(chat.username)) || 
          seenIds.has(normalizedId);
          
        if (!isDuplicate) {
          if (chat.username) {
            usernames.add(chat.username);
          }
          seenIds.add(normalizedId);
          uniqueChats.push(chatWithNormalizedId);
        } else {
          // This is a duplicate - find the existing chat
          let existingChat;
          
          if (chat.username && usernames.has(chat.username)) {
            existingChat = uniqueChats.find(c => c.username === chat.username);
          } else if (seenIds.has(normalizedId)) {
            existingChat = uniqueChats.find(c => c.id === normalizedId);
          }
          
          if (existingChat) {
            // Merge the messages from both chats
            const allMessages = [...(existingChat.mensagens || []), ...(chat.mensagens || [])];
            
            // Sort messages by date
            allMessages.sort((a, b) => 
              new Date(a.created_at) - new Date(b.created_at)
            );
            
            // Update the existing chat with all messages
            existingChat.mensagens = allMessages;
            
            // Update total_news_msgs
            existingChat.total_news_msgs = (existingChat.total_news_msgs || 0) + (chat.total_news_msgs || 0);
          }
        }
      });
      
      console.log("Normalized chat data:", uniqueChats.map(c => ({id: c.id, type: typeof c.id, username: c.username})));
      setChats(uniqueChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setGettingChats(false);
    }
  };
  

  const handleUserSelect = (chat) => {
    if(chat.total_news_msgs > 0){
      socket.send(JSON.stringify({
        type: "read_all",
        content: "read...",
        to_user: chat.id  // Changed from selectedUser.id to chat.id
      }));
    }
    // Atualiza apenas mensagens que não são do usuário atual (são do amigo)
    const updatedChat = {
      ...chat,
      total_news_msgs: 0,
      mensagens: chat.mensagens?.map(msg => ({
        ...msg,
        is_read: msg.sender_id === chat.id ? true : msg.is_read // Apenas mensagens do amigo
      }))
    };
  
    setSelectedUser(updatedChat);
    setShowOnlineUsers(false);
    setView('messages');
  
    // Atualiza também na lista de chats
    setChats(prevChats => {
      return prevChats.map(c => {
        if (c.id === chat.id) {
          return updatedChat;
        }
        return c;
      });
    });
  };

  const handleFriendSelect = (friend) => {
    const newChat = createNewChat(friend);
    setSelectedUser(newChat);
    setShowOnlineUsers(false);
    setView('messages');
  };

  const handleSendMessageWithFile = async () => {
    if (!selectedUser || !mediaPreview) return;

    const messageId = generateMessageId();
    const newMessage = {
      id: messageId,
      message_id: messageId,
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: messageInput || '',
      message_type: mediaType,
      file_url: null,
      file_name: selectedFile?.name || null,
      file_size: selectedFile?.size || null,
      is_delivered: false,
      reaction: null,
      is_read: false,
      created_at: new Date().toISOString(),
      status: 'uploading'
    };

    // Atualiza a lista de chats
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.id === selectedUser.id);
      if (chatIndex !== -1) {
        const updatedChat = {
          ...prevChats[chatIndex],
          mensagens: [...prevChats[chatIndex].mensagens, newMessage]
        };
        return [
          updatedChat,
          ...prevChats.filter((_, i) => i !== chatIndex)
        ];
      }
      return prevChats;
    });

    // Atualiza o usuário selecionado
    setSelectedUser(prev => ({
      ...prev,
      mensagens: [...prev.mensagens, newMessage]
    }));

    try {
      // Cria o FormData
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('message_id', messageId);
      formData.append('receiver_id', selectedUser.id);
      formData.append('content', messageInput || '');

      // Log do FormData antes do envio
      console.log("=== CONTEÚDO DO FORMDATA ===");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1], 
          pair[1] instanceof Blob ? 
            `(tipo: ${pair[1].type}, tamanho: ${pair[1].size})` : 
            ''
        );
      }
      
      const response = await axios.post(
        `${API_URL}/mensagens/enviar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      updateMessageById(messageId, msg => ({
        ...msg,
        file_url: response.data.file_url,
        file_name: response.data.file_name || msg.file_name,
        file_size: response.data.file_size || msg.file_size,
        status: 'sent'
      }));

      // Envia a mensagem via WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "message",
          to_user: selectedUser.id,
          message_id: messageId,
          content: messageInput || '',
          message_type: mediaType,
          file_url: response.data.file_url,
          file_name: response.data.file_name || selectedFile?.name || '',
          file_size: response.data.file_size || selectedFile?.size || 0,
          file_type: selectedFile?.type || ''
        }));
      }

      // Limpa os estados
      setMessageInput('');
      setMediaPreview(null);
      setMediaType(null);
      setSelectedFile(null);
      
      // Rola para o final da conversa
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem com arquivo:', error);
      console.error('Detalhes do erro:', error.response?.data || error.message);
      
      // Atualiza o status da mensagem para erro
      updateMessageById(messageId, msg => ({
        ...msg,
        status: 'error'
      }));
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedUser) return;
  
    const messageId = generateMessageId();
    const newMessage = {
      id: messageId,
      message_id: messageId,
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: messageInput,
      message_type: 'text',
      file_url: null,
      file_name: null,
      file_size: null,
      is_delivered: false,
      reaction: null,
      is_read: false,
      created_at: new Date().toISOString(),
      status: 'sent'
    };
  
    try {
      // Enviar mensagem via WebSocket
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: "message",
          to_user: selectedUser.id,
          message_id: messageId,
          content: messageInput,
          message_type: 'text',
          file_url: null,
          file_name: null,
          file_size: null,
        }));
      }

      // Atualiza a lista de chats reordenando para colocar o chat no topo
      setChats((prevChats) => {
        const existingChatIndex = prevChats.findIndex(
          (chat) => chat.id === selectedUser.id
        );

        if (existingChatIndex !== -1) {
          const chat = prevChats[existingChatIndex];
          const updatedChat = {
            ...chat,
            mensagens: [...chat.mensagens, newMessage],
          };

          // Move o chat atualizado para o topo
          return [
            updatedChat,
            ...prevChats.filter((_, i) => i !== existingChatIndex),
          ];
        } else {
          // Se não existir, adiciona-o no início da lista
          return [
            {
              ...selectedUser,
              mensagens: [newMessage],
            },
            ...prevChats,
          ];
        }
      });

      // Atualiza também o chat selecionado para mostrar a nova mensagem
      setSelectedUser((prevUser) => ({
        ...prevUser,
        mensagens: [...(prevUser.mensagens || []), newMessage],
      }));

      // Limpa o input
      setMessageInput('');

      // Scroll automático
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Atualiza o status da mensagem para erro
      updateMessageById(messageId, msg => ({
        ...msg,
        status: 'error'
      }));
    }
  };

  const handleTyping = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !selectedUser) return;

    socket.send(JSON.stringify({
      type: "typing",
      content: "typing...",
      to_user: selectedUser.id
    }));
  };
  const handleRecording = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !selectedUser) return;
    socket.send(JSON.stringify({
      type: "recording",
      content: "recording...",
      to_user: selectedUser.id
    }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = await createFilePreview(file);
    if (fileData) {
      setMediaPreview(fileData.preview);
      setMediaType(fileData.type);
      setSelectedFile(fileData.file);
    }
  };

  const cancelMedia = () => {
    cleanupMedia(audioRef, mediaPreview, mediaType, mediaInputRef);
    setMediaPreview(null);
    setMediaType(null);
    setSelectedFile(null);
  };

  const startRecording = async () => {
    try {
      // Send recording status to other user
      if (socket && socket.readyState === WebSocket.OPEN && selectedUser) {
        socket.send(JSON.stringify({
          type: "recording",
          content: "recording...",
          to_user: selectedUser.id,
          status: "start"
        }));
        console.log("enviou gravando")
      }

      cancelMedia();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream);
        console.log("MediaRecorder criado com sucesso");
        console.log("Formato:", mediaRecorder.mimeType);
      } catch (e) {
        console.error("Erro ao criar MediaRecorder:", e);
        throw e;
      }

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      setIsRecording(true);
      setRecordingDuration(0);

      // Start recording
      mediaRecorder.start(100);
      drawWaveform(analyserRef, canvasRef, isRecording, animationFrameRef);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões do navegador.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
  
    try {

      // Send recording status to other user
      if (socket && socket.readyState === WebSocket.OPEN && selectedUser) {
        socket.send(JSON.stringify({
          type: "recording",
          content: "recording...",
          to_user: selectedUser.id,
          status: "stop"
        }));
      }
      const tracks = mediaRecorderRef.current.stream.getTracks();
      cleanupAudioRecording(mediaRecorderRef.current, analyserRef, audioContextRef, tracks);
      setIsRecording(false);
  
      // Create audio file after a short delay to ensure all data is collected
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const audioData = processAudioRecording(audioChunksRef.current);
          if (audioData) {
            setSelectedFile(audioData.blob);
            setMediaPreview(audioData.url);
            setMediaType('audio');
            setDuration(recordingDuration);
          }
          
          // Clear recording state
          audioChunksRef.current = [];
          mediaRecorderRef.current = null;
        }
      }, 200);
  
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
    }
  };
  

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;

      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#ffebee';  // Light red background
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#ef5350';  // Red line
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  }, [isRecording]);

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Clean up audio states when switching chats
  useEffect(() => {
    // Clean up previous audio states
    cleanupAudioStates(audioStates);
    
    // Initialize audio states for the new chat
    if (selectedUser?.mensagens) {
      const audioMessages = selectedUser.mensagens.filter(msg => msg.message_type === 'audio');
      setAudioStates(prevStates => {
        const newStates = {};  // Start fresh with each chat
        audioMessages.forEach(msg => {
          newStates[msg.id] = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            audio: null
          };
        });
        return newStates;
      });
    } else {
      setAudioStates({});  // Reset if no messages
    }
  }, [selectedUser?.id]); // Only run when switching chats

  // Handle audio playback
  const handleToggleAudio = useCallback((messageId, audioUrl) => {
    if (!messageId || !audioUrl) {
      console.error('Missing messageId or audioUrl:', { messageId, audioUrl });
      return;
    }

    // Ensure the audio state exists before toggling
    setAudioStates(prevStates => {
      const newStates = { ...prevStates };
      if (!newStates[messageId]) {
        newStates[messageId] = {
          isPlaying: false,
          currentTime: 0,
          duration: 0,
          audio: null
        };
      }
      return newStates;
    });

    // Use a timeout to ensure the state is updated before toggling
    setTimeout(() => {
      toggleAudioPlayback(messageId, audioUrl, audioStates, setAudioStates);
    }, 0);
  }, [audioStates]);

  // Cleanup audio resources on unmount
  useEffect(() => {
    return () => {
      cleanupAudioStates(audioStates);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Limpa recursos quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (mediaPreview && mediaType === 'audio') {
        URL.revokeObjectURL(mediaPreview);
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleBackClick = () => {
    if (view === 'info') {
      setView('messages');
      setShowUser(false);
    } else if (view === 'messages') {
      setView('chats');
      setSelectedUser(null);
    }
  };

  const toggleFriendsList = () => {
    setShowOnlineUsers(!showOnlineUsers);
  };

  const filteredFriends = React.useMemo(() => {
    const q = String(searchQuery || '').toLowerCase().trim();
    if (!q) return friends;
    try {
      return friends.filter(f =>
        String(f.nome || '').toLowerCase().includes(q) ||
        String(f.username || '').toLowerCase().includes(q)
      );
    } catch {
      return friends;
    }
  }, [friends, searchQuery]);

  const getLastMessage = (chat) => {
    if (!chat.mensagens || chat.mensagens.length === 0) return '';
    const lastMsg = chat.mensagens[chat.mensagens.length - 1];
    return lastMsg.content;
  };

  // Handle clipboard paste
  const handlePaste = useCallback(async (e) => {
    const clipboardItems = e.clipboardData.items;
    const imageItem = Array.from(clipboardItems).find(
      item => item.type.startsWith('image/')
    );

    if (imageItem) {
      e.preventDefault();
      const blob = imageItem.getAsFile();
      const reader = new FileReader();
      
      reader.onload = () => {
        setMediaPreview({
          url: reader.result,
          type: 'image',
          file: blob
        });
      };
      
      reader.readAsDataURL(blob);
    }
  }, []);

  // Add paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  // Função para atualizar a mensagem após o upload
  const updateMessageAfterUpload = (messageId, uploadResponse) => {
    setChats(prevChats => updateMessageById(prevChats, messageId, msg => ({
      ...msg,
      file_url: uploadResponse.file_url,
      file_name: uploadResponse.file_name || msg.file_name,
      file_size: uploadResponse.file_size || msg.file_size,
      status: 'sent'
    })));

    setSelectedUser(prevUser => ({
      ...prevUser,
      mensagens: prevUser.mensagens.map(msg => {
        if (msg.id === messageId || msg.message_id === messageId) {
          return {
            ...msg,
            file_url: uploadResponse.file_url,
            file_name: uploadResponse.file_name || msg.file_name,
            file_size: uploadResponse.file_size || msg.file_size,
            status: 'sent'
          };
        }
        return msg;
      })
    }));
  };

  // Função para marcar a mensagem com erro
  const updateMessageWithError = (messageId) => {
    setChats(prevChats => updateMessageById(prevChats, messageId, msg => ({ ...msg, status: 'error' })));

    setSelectedUser(prevUser => ({
      ...prevUser,
      mensagens: prevUser.mensagens.map(msg => {
        if (msg.id === messageId || msg.message_id === messageId) {
          return { ...msg, status: 'error' };
        }
        return msg;
      })
    }));
  };

  // Função para atualizar mensagens por ID em todos os locais (chats e selectedUser)
  const updateMessageById = (messageId, updateFn) => {
    // Atualiza na lista de chats
    setChats(prevChats => {
      return prevChats.map(chat => {
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
    });

    // Atualiza no usuário selecionado, se existir
    if (selectedUser) {
      setSelectedUser(prevUser => {
        if (!prevUser.mensagens) return prevUser;
        
        return {
          ...prevUser,
          mensagens: prevUser.mensagens.map(msg => {
            if (msg.message_id === messageId || msg.id === messageId) {
              // Aplica a função de atualização
              return updateFn(msg);
            }
            return msg;
          })
        };
      });
    }
  };

  // While auth is loading, render nothing or a lightweight placeholder to avoid flicker
  if (authLoading) {
    return (
      <div className='flex h-screen items-center justify-center text-gray-500'>
        Carregando...
      </div>
    );
  }

  // If not authenticated, halt render (router will navigate)
  if (!token || !isAuthenticated) {
    return null;
  }

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Chat list sidebar */}
      <div className={`w-full md:w-[350px] flex flex-col border-r border-gray-200 ${
        view !== 'chats' ? 'hidden md:flex' : ''
      }`}>
        <UserHeader user={user} onNewChat={() => setShowOnlineUsers(true)} />
        <div className="flex justify-between p-4">
          <span className='font-bold'>Mensagens</span>
          <span className='font-bold text-skyvenda-500'>Pedidos</span>
        </div>
        <ChatList chats={chats} gettingChats={gettingChats} handleUserSelect={handleUserSelect} selectedUser={selectedUser} getLastMessage={getLastMessage}/>
      </div>

      {/* Main chat area */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden ${
        view !== 'messages' ? 'hidden md:flex' : ''
      }`}>
        {!selectedUser ? (
          <EmptyChatState toggleFriendsList={toggleFriendsList} />
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat messages */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                  <ArrowLeft 
                    className="cursor-pointer md-hidden" 
                    onClick={handleBackClick}
                  />
                  <Image 
                    src={selectedUser.foto || `${base_url}/avatar.png`}
                    alt={selectedUser.nome}
                    width={40}
                    height={40}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                    unoptimized
                  />
                  <Link href={`/${selectedUser.username}`} className='font-semibold hover:underline hover:text-indigo-500'>
                    {selectedUser.nome}
                  </Link>
                  {userTyping === selectedUser.username && (
                    <span className="text-sm text-skyvenda-500">digitando...</span>
                  )}

                  {userRecording === selectedUser.username && (
                    <span className="text-sm text-skyvenda-500">gravando...</span>
                  )}
                </div>
                {!showUserInfo && (
                  <Info 
                  className="cursor-pointer" 
                  onClick={() => {
                    setShowUserInfo(true)
                    setView('info')
                  }}
                />
                )}
              </div>

              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedUser.mensagens && selectedUser.mensagens.length > 0 ? (
                  selectedUser.mensagens.map((message) => (
                    <MessageItem 
                      key={message.id} 
                      message={message}
                      audioStates={audioStates}
                      onToggleAudio={handleToggleAudio}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageCirclePlus size={40} className="mb-2" />
                    <p>Comece uma conversa com {selectedUser.nome}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <FilePreview 
                mediaPreview={mediaPreview}
                mediaType={mediaType}
                selectedFile={selectedFile}
                cancelMedia={cancelMedia}
              />

              <ChatInput 
                isRecording={isRecording}
                recordingDuration={recordingDuration}
                formatTime={formatTime}
                canvasRef={canvasRef}
                stopRecording={stopRecording}
                mediaPreview={mediaPreview}
                mediaType={mediaType}
                toggleAudioPlayback={toggleAudioPlayback}
                audioStates={audioStates}
                duration={duration}
                cancelMedia={cancelMedia}
                handleSendMessageWithFile={handleSendMessageWithFile}
                mediaInputRef={mediaInputRef}
                handleFileSelect={handleFileSelect}
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleTyping={handleTyping}
                startRecording={startRecording}
                handleSendMessage={handleSendMessage}
              />
            </div>
          </div>
        )}
      </div>

      <UserInfoSidebar
        showUser={showUserInfo}
        selectedUser={selectedUser}
        view={view}
        onBackClick={() => {
          setShowUserInfo(false) 
          setView('messages');
        }}
        onAddFavorite={() => {}}
        onBlock={() => {}}
        onReport={() => {}}
        onDeleteMessages={() => {}}
      />

      <FriendsModal 
        showOnlineUsers={showOnlineUsers}
        setShowOnlineUsers={setShowOnlineUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loadingFriends={loadingFriends}
        filteredFriends={filteredFriends}
        handleFriendSelect={handleFriendSelect}
      />
      <audio ref={notificationSound} src='sound.ogg' preload="auto" className='hidden'/>
    </div>
  );
}