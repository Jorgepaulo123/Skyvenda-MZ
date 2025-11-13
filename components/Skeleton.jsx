import React from 'react';

function Skeleton({ type }) {
  const cardSkeleton = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="w-full h-[80px] bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );

  const productSkeleton = (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return type === 'card' ? cardSkeleton : productSkeleton;
}

export default Skeleton;