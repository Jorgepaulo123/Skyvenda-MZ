import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-200 animate-pulse">
        {/* Image skeleton */}
        <div className="absolute inset-0 bg-gray-200" />
        
        {/* Top status indicators skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-8 w-24 bg-gray-300 rounded-full" />
        </div>
        <div className="absolute top-4 right-4">
          <div className="h-11 w-11 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="mt-6">
        {/* User info skeleton */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        {/* Title and price skeleton */}
        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
            <div className="flex items-center mt-1">
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded" />
        </div>

        {/* Stats skeleton */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>

        {/* Button skeleton */}
        <div className="w-full h-14 bg-gray-200 rounded-lg mt-4" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;