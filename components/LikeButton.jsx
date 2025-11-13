import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export function LikeButton({ initialLikes, isLiked: initialIsLiked }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-2 text-gray-600 hover:text-red-500"
    >
      <Heart
        className={`h-6 w-6 transition-colors ${
          isLiked ? 'fill-red-500 text-red-500' : ''
        }`}
      />
      <span>{likes}</span>
    </button>
  );
}