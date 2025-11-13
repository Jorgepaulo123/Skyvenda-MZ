import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  
  const updateChats = (newChats) => {
    setChats(newChats);
  };

  const addMessage = (chatId, message) => {
    setChats(prevChats => {
      // Lógica para adicionar mensagem...
    });
  };

  const value = {
    chats,
    setChats: updateChats,
    addMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext); 