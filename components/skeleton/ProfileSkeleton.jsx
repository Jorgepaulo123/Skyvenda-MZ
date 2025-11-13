import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Cover Photo Skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      
      {/* Profile Section */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
        {/* Avatar Skeleton */}
        <div className="absolute -top-16 left-4 sm:left-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white animate-pulse"></div>
        </div>
        
        {/* Profile Info Skeleton */}
        <div className="ml-0 sm:ml-40 pt-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          {/* Stats Bar */}
          <div className="flex space-x-6 mb-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;