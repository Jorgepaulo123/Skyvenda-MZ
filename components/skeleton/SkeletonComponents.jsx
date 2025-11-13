import React, { memo } from 'react';

const SkeletonItem = memo(() => (
  <div className="bg-white rounded-lg p-2">
    <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse"></div>
    <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
  </div>
));

const SkeletonCard = memo(() => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 3 }).map((_, idx) => (
        <SkeletonItem key={idx} />
      ))}
    </div>
  </div>
));

export const PromotionalCardsSkeleton = () => (
  <div className="max-w-screen-lg mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  </div>
);
