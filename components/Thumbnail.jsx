import React from 'react';

export function Thumbnail({ src, isActive, onClick, index }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
        isActive ? 'border-blue-600' : 'border-transparent'
      }`}
    >
      <img
        src={src}
        alt={`Product thumbnail ${index + 1}`}
        className="h-full w-full object-cover"
      />
    </button>
  );
}