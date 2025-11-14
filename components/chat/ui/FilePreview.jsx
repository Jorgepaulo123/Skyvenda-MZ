"use client";
import { File, X } from 'lucide-react';
import Image from 'next/image';

export default function FilePreview({ mediaPreview, mediaType, selectedFile, cancelMedia }) {
  if (!mediaPreview || mediaType === 'audio') return null;

  return (
    <div className="px-4 py-2 border-t bg-gray-50">
      <div className="flex items-center justify-between p-2 border rounded-lg bg-white">
        <div className="flex items-center gap-2">
          {mediaType === 'image' ? (
            <div className="relative">
              <Image 
                src={mediaPreview} 
                alt="Preview" 
                width={80}
                height={80}
                className="h-20 w-auto rounded object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <File size={24} className="text-gray-500" />
              <span className="text-sm text-gray-600">{selectedFile?.name}</span>
            </div>
          )}
        </div>
        <button
          onClick={cancelMedia}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 flex items-center gap-1"
        >
          <X size={16} />
          <span className="text-sm">Remover</span>
        </button>
      </div>
    </div>
  );
}
