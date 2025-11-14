"use client";

import React, { useState, useEffect } from 'react';
import SponsoredProductCard from './SponsoredProductCard';
const ResponsiveComponent = ({ index, adsData }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Atualiza a largura da tela
  useEffect(() => {
    // window só existe no cliente
    const compute = () => {
      if (typeof window !== 'undefined') {
        setIsSmallScreen(window.innerWidth <= 300);
      }
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <>
      {isSmallScreen ? (
        <div className="hidden">
          <Oferta_diaria key={index} />
        </div>
      ) : (
        <div className="block">
          <SponsoredProductCard
            key={`sponsored-${index}`}
            product={adsData.ads[Math.floor(Math.random() * adsData.ads.length)]}
          />
        </div>
      )}
    </>
  );
};

export default ResponsiveComponent;
