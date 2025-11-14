"use client";
import React from 'react';
import { MessageCirclePlus } from 'lucide-react';

export default function NewChat({ toggleFriendsList }) {
  return (
    <div className="p-4 flex justify-end">
      <button
        onClick={toggleFriendsList}
        className="p-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
        title="Nova conversa"
      >
        <MessageCirclePlus size={20} />
      </button>
    </div>
  );
}