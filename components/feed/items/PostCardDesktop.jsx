import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

const gradientStyles = {
  purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  blue: 'bg-gradient-to-br from-blue-500 to-blue-800',
  green: 'bg-gradient-to-br from-green-500 to-green-600',
  pink: 'bg-gradient-to-br from-pink-500 to-pink-700',
  orange: 'bg-gradient-to-br from-yellow-500 to-orange-600',
  red: 'bg-gradient-to-br from-red-500 to-red-600',
  default: 'bg-gradient-to-br from-gray-500 to-gray-600'
};

export default function PostCardDesktop({ data }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleUserPress = () => {
    console.log('User pressed:', data.user?.id);
    // navigate(`/profile/${data.user?.id}`);
  };

  const gradientClass = gradientStyles[data.gradient_style] || gradientStyles.default;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          onClick={handleUserPress}
          className="flex items-center space-x-3 flex-1"
        >
          <img
            src={data.user?.avatar || 'https://via.placeholder.com/40x40?text=U'}
            alt={data.user?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900 text-sm">
              {data.user?.name || 'Usuário'}
            </h3>
            <p className="text-xs text-gray-500">{data.time}</p>
          </div>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Post Content - Larger but not square */}
      <div className={`mx-4 mb-4 p-6 rounded-xl ${gradientClass} min-h-[200px] flex items-center justify-center`}>
        <p className="text-white text-center text-base leading-relaxed font-medium">
          {data.content}
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart 
              size={22} 
              className={liked ? 'text-red-500 fill-current' : ''} 
            />
            <span className="text-sm font-medium">{data.likes || 0}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
            <MessageCircle size={22} />
            <span className="text-sm font-medium">{data.comments || 0}</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
            <Share2 size={22} />
          </button>
        </div>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="text-gray-600 hover:text-indigo-500 transition-colors"
        >
          <svg 
            width={22} 
            height={22} 
            viewBox="0 0 24 24" 
            fill={bookmarked ? 'currentColor' : 'none'}
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
