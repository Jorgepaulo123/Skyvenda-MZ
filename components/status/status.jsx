import React, { useState, useRef } from 'react';
import { Store, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export function Stories({ stories }) {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg border border-gray-100 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg border border-gray-100 transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth justify-center items-center"
      >
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex-shrink-0 group cursor-pointer"
          >
            <div className="relative w-28 h-40 rounded-xl overflow-hidden">
              <img
                src={story.imageUrl}
                alt={story.username}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
              
              <div className="absolute top-3 left-1/2 -translate-x-1/2">
                <div className={`${story.isVerified ? 'ring-4' : 'ring-2'} ${story.isVerified ? 'ring-blue-500' : 'ring-gray-300'} rounded-full p-0.5 bg-white`}>
                  <img
                    src={story.avatarUrl}
                    alt={`${story.username}'s avatar`}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  {story.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Store className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {story.isPromoted && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>PROMO</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-white text-xs font-medium px-2 truncate">
                  {story.username}
                </p>
                {story.location && (
                  <p className="text-gray-300 text-[10px] px-2 truncate">
                    {story.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}