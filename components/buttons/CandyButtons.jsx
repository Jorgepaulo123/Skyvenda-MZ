import React from 'react';
import { Plus } from 'lucide-react';

export const CandyButton = () => (
  <button className="relative px-4 py-2 rounded-full bg-white text-fuchsia-600 font-semibold group hover:shadow-[0_0_25px_rgba(192,38,211,0.3)] transition-all">
    <span className="flex items-center gap-2 relative z-10">
      <Plus className="w-5 h-5" />
      Postar
    </span>
    <div className="absolute -inset-[1px] bg-gradient-to-r from-fuchsia-500 via-purple-500
     to-indigo-500 rounded-lg opacity-40 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200
      animate-gradient-xy" />
    <div className="absolute inset-0 bg-white rounded-full" />
  </button>
);