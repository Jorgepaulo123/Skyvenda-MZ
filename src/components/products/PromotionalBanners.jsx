import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PromotionalBanners() {
  const [anuncios, setAnuncios] = useState([]);
  const [currentIndexes, setCurrentIndexes] = useState([0, 1]);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const response = await axios.get('https://skyvenda-mz.up.railway.app/produtos/anuncios/listar');
        setAnuncios(response.data);
      } catch (error) {
        console.error('Erro ao carregar anúncios:', error);
      }
    };

    fetchAnuncios();
  }, []);

  // Rotate advertisements every 6 seconds
  useEffect(() => {
    if (anuncios.length <= 2) return; // Don't rotate if we have 2 or fewer ads

    const interval = setInterval(() => {
      setCurrentIndexes(prevIndexes => {
        const [first, second] = prevIndexes;
        const nextFirst = (first + 2) % anuncios.length;
        const nextSecond = (second + 2) % anuncios.length;
        return [nextFirst, nextSecond];
      });
    }, 6000); // 6 seconds

    return () => clearInterval(interval);
  }, [anuncios.length]);

  if (anuncios.length === 0) {
    return null;
  }

  // Get the current two advertisements to display
  const currentAds = currentIndexes.map(index => anuncios[index % anuncios.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {currentAds.map((anuncio, index) => (
        <div 
          key={`${anuncio.id}-${index}`}
          className="relative h-[200px] rounded-2xl overflow-hidden group cursor-pointer"
          onClick={() => window.open(anuncio.link, '_blank', 'noopener,noreferrer')}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={anuncio.imagem}
              alt={anuncio.nome}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-blue-800/60 group-hover:from-blue-600/75 group-hover:to-blue-800/65 transition-all duration-300"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex items-center">
            <div className="w-full px-8">
              <div className="text-white space-y-2">
                <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                  ANÚNCIO
                </span>
                <h2 className="text-4xl font-bold leading-tight">{anuncio.nome}</h2>
                <p className="text-white/90">{anuncio.descricao}</p>
                <p className="text-white font-semibold">
                  {anuncio.preco === "0.0" ? "Grátis" : `${anuncio.preco} MT`}
                </p>
                <button 
                  className="inline-block mt-4 px-6 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-opacity-90 transition-colors group-hover:bg-blue-500 group-hover:text-white"
                >
                  Ver Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 