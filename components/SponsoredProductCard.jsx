import React, { useState, useEffect } from 'react';
import { Heart, Clock, Tag, ArrowRight, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

function CyclingAdCard({ ads }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (!ads.length) return null;

  const currentAd = ads[currentIndex];
  const { produto, anuncio } = currentAd;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-mz', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-mz', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ease-in-out">
        <div className="relative">
          <img 
            src={`https://skyvendamz.up.railway.app/produto/${produto.capa}`}
            alt={produto.nome}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
              } hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-md`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="absolute top-4 left-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            {anuncio.tipo_anuncio}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{produto.nome}</h3>
            <p className="text-gray-200 text-sm mb-3 line-clamp-2">{anuncio.descricao}</p>
            
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{produto.likes}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm">{produto.views}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Expira: {formatDate(anuncio.expira_em)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-black">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-white">{formatPrice(produto.preco)}</span>
            <div className="flex items-center text-yellow-400 text-sm">
              <span>{currentIndex + 1}/{ads.length}</span>
            </div>
          </div>
          
          <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg
           text-black font-bold flex items-center justify-center hover:from-yellow-500 hover:to-yellow-700 transition-all
            duration-300" onClick={()=>{
              router.push(`/product/${produto?.slug}`)
            }}>
            Ver Detalhes
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CyclingAdCard;
