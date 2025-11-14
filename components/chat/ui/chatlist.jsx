"use client";
import React from 'react';
import { base_url } from "../../../api/api";
import { getHours } from '../../../utils/getHours';
import ChatSkeleton from "./chatskeleton";
import Image from 'next/image';

export default function ChatList({chats,gettingChats,handleUserSelect,selectedUser}){

  const getLastMessage = (chat) => {
    const lastMessage = chat.mensagens?.[chat.mensagens.length - 1];
    if (!lastMessage) return '';

    switch (lastMessage.message_type) {
      case 'audio':
        return 'Áudio';
      case 'image':
        return 'Imagem';
      case 'document':
        return 'Documento';
      default:
        return lastMessage.content || '';
    }
  };

  const getLastMessageTime = (chat) => {
    const lastMessage = chat.mensagens?.[chat.mensagens.length - 1];
    return getHours(lastMessage?.created_at);
  };
  
  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
      {gettingChats ? (
        <ChatSkeleton />
      ) : (
        chats.map((chat, index) => (
          <div 
            key={`${chat.id}-${chat.username}-${index}`} 
            onClick={() => handleUserSelect(chat)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedUser?.id === chat.id ? 'bg-gray-100' : ''
            }`}
          >
            <Image 
              src={chat.foto || `avatar.png`} 
              alt={chat.nome}
              width={48}
              height={48}
              className='w-12 h-12 rounded-full object-cover'
              unoptimized
            />
            <div className="flex-1 min-w-0"> 
              <div className="flex justify-between items-center">
                <span className="font-medium truncate">{chat.nome}</span>
                <div className="flex flex-col space-y-2">
                <span className={`${chat.total_news_msgs > 0 ? "text-skyvenda-500" : "text-gray-500"} text-xs whitespace-nowrap ml-2`}>
                  {getLastMessageTime(chat)}
                </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 truncate mt-0.5">
                  {getLastMessage(chat)}
                </div>
                {chat.total_news_msgs >0 && (
                    <span className="bg-skyvenda-500 text-white rounded-full ml-2 h-[16px] min-w-[16px]  text-center text-xs">
                      {chat.total_news_msgs}
                    </span>
                  )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}