import React, { useState } from 'react';
import { NavigationButton } from './NavigationButton';
import { Thumbnail } from './Thumbnail';

export function ImageGallery({ mainImage, images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const allImages = [mainImage, ...images].filter(Boolean);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {allImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Product view ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        
        {allImages.length > 1 && (
          <>
            <NavigationButton direction="left" onClick={previousImage} />
            <NavigationButton direction="right" onClick={nextImage} />
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, idx) => (
            <Thumbnail
              key={image}
              src={image}
              index={idx}
              isActive={idx === currentIndex}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}