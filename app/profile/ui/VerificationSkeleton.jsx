import React from 'react';

const SkeletonInput = () => (
  <div className="mb-6 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-100 rounded-md w-full"></div>
  </div>
);

const SkeletonButton = () => (
  <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
);

const VerifiedCardSkeleton = () => (
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="p-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
);

const PendingCardSkeleton = () => (
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="p-8">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-2 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
      </div>
    </div>
  </div>
);

const UserFormSkeleton = () => (
  <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 animate-pulse">
    <div className="space-y-6">
      <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-8"></div>
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonButton />
    </div>
  </div>
);

const VerificationSkeleton = ({ type = 'form' }) => {
  const skeletons = {
    verified: <VerifiedCardSkeleton />,
    pending: <PendingCardSkeleton />,
    form: <UserFormSkeleton />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {skeletons[type] || skeletons.form}
      </div>
    </div>
  );
};

export default VerificationSkeleton;