import React, { useEffect, useState, useRef } from 'react';
import PublicationCard from './cards/PublicationCard';
import api from '../api/api';

// gradient palette
const gradients = [
  'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600',
  'bg-gradient-to-r from-green-500 via-teal-500 to-blue-500',
  'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
  'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
  'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500'
];
const getRandomGradient = () => gradients[Math.floor(Math.random()*gradients.length)];

export default function PublicacoesCarousel({ embedded=false }) {
    const [publicacoes, setPublicacoes] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchPubs() {
      try {
        const res = await api.get('/usuario/publicacoes/', { params:{ page:1, per_page:10 } });
        const pubs = (res.data.items || []).map(p => ({ ...p, gradient_style: getRandomGradient() }));
        setPublicacoes(pubs);
      } catch (e) {
        console.error('Erro ao carregar publicações carrossel', e);
      }
    }
    fetchPubs();
  }, []);

  if (!publicacoes.length) return null;

  const scroll = dir => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  return (
    <div className={`${embedded ? '' : 'container mx-auto'} my-8 w-full max-w-full overflow-hidden`}>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg px-4 md:px-6 py-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Publicações</h2>
          <button onClick={()=>scroll(1)} className="text-sm text-indigo-600 hover:underline">Ver mais</button>
        </div>

        {/* Arrows */}
        <button onClick={()=>scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">
          ◀
        </button>
        <button onClick={()=>scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">
          ▶
        </button>

        <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide touch-pan-x overscroll-x-contain w-full max-w-full">
          {publicacoes.map(pub => (
            <div key={pub.id} className="snap-start flex-shrink-0 max-w-[85vw] sm:max-w-none">
              <PublicationCard pub={pub} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
