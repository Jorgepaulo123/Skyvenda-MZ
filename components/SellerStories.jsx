import React, { useEffect, useContext } from 'react';
import { FiCheck } from 'react-icons/fi';
import sellersData from '../data/sellers.json';
import { HomeContext } from '../context/HomeContext';

function Skeleton() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />
      <div className="w-20 h-4 bg-gray-300 animate-pulse" />
      <div className="w-24 h-8 bg-gray-300 animate-pulse" />
    </div>
  );
}

function SellerStories() {
  const { loading, startLoading, stopLoading } = useContext(HomeContext);

  return (
    <div className="w-full py-4 px-4 no-scrollbar">
      <div className="flex space-x-4">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} />) // Mostra 5 skeletons
          : sellersData.sellers.map((seller) => (
              <div
                key={seller.id}
                className="flex flex-col items-center space-y-2 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                    <div className="w-full h-full rounded-full p-[2px] bg-white">
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  {seller.verified && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 truncate w-20 text-center">
                  {seller.name}
                </span>
                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-4 rounded-full transition-colors duration-200">
                  Seguir
                </button>
              </div>
            ))} 
      </div>
    </div>
  );
}

export default SellerStories;
