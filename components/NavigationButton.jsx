import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NavigationButton({ direction, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl ${
        direction === 'left' ? 'left-4' : 'right-4'
      }`}
    >
      {direction === 'left' ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  );
}