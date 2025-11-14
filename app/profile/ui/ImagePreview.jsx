import React from 'react';
import { X } from 'lucide-react';

export default function ImagePreview({ file, onRemove, label }) {
  if (!file) return null;

  return (
    <div className="relative">
      <img
        src={URL.createObjectURL(file)}
        alt={label}
        className="w-full h-40 object-cover rounded-lg"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-sm text-gray-500 mt-1 text-center">{label}</p>
    </div>
  );
}