import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-6 h-6 rounded-full absolute border-4 border-gray-200"></div>
        <div className="w-6 h-6 rounded-full animate-spin absolute border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default React.memo(LoadingSpinner);