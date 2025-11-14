"use client";
import { MessageCirclePlus } from 'lucide-react';

export default function EmptyChatState({ toggleFriendsList }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-[100px] h-[100px] rounded-full border-2 border-gray-950 flex justify-center items-center">
          <MessageCirclePlus size={50}/>
        </div>
        <h1 className='text-xl'>As tuas mensagens</h1>
        <span className='text-gray-400'>Envia fotos e mensagens privadas para um amigo ou grupo.</span>
        <button 
          className='py-2 px-4 rounded-md bg-indigo-500 text-white'
          onClick={toggleFriendsList}
        >
          Enviar mensagem
        </button>
      </div>
    </div>
  );
}
