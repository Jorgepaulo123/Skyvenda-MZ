import React, { useState, useEffect } from 'react';
import SponsoredProductCard from './SponsoredProductCard';
const ResponsiveComponent = ({ index, adsData }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 300);

  // Atualiza a largura da tela
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 300);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
