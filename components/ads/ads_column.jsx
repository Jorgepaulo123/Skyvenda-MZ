"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
export function AdsColumn({ ads }) {
  const [displayedAds, setDisplayedAds] = useState([]);
 

  useEffect(() => {
    const selectRandomAds = () => {
      const shuffled = [...ads].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    };
  
    // Initial selection
    setDisplayedAds(selectRandomAds());

    // Update every 5 seconds
    const interval = setInterval(() => {
      setDisplayedAds(selectRandomAds());
    }, 5000);

    return () => clearInterval(interval);
  }, [ads]);

  return (
    <div className="w-full h-[350px] rounded-md bg-white/30 border-blue-200 shadow-md p-4 space-y-2 overflow-y-auto">
      <label className="text-black">Melhores Boladas</label>
      {displayedAds.map((item, index) => (
        <Link href={`/product/${item.produto.slug}`} key={`sideAd-${index}`}>
        <div
          className="flex gap-2 h-[90px] bg-white/40 p-3 border rounded-md hover:bg-indigo-100 transition-colors duration-200"
          
        >
          <img
            src={item.produto.thumb?.startsWith('http') ? item.produto.thumb : `${item.produto.capa}`}
            onError={e=>e.target.src='https://skyvenda.vercel.app/no-image.png'}
            className="w-[80px] object-cover rounded-sm"
            alt={item.produto.nome}
          />
          <div className="flex-col">
            <p className="font-bold line-clamp-1">{item.produto.nome}</p>
            <label className="text-wrap text-sm text-gray-500 line-clamp-2">
              {item.produto.descricao}
            </label>
          </div>
          
        </div>
        </Link>
      ))
      
      }
    </div>
    
  );
}