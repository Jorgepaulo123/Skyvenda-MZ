import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/api';

export default function LojasCarousel({ embedded=false }) {
  const [lojas, setLojas] = useState([]);
  const containerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // endpoint de lojas (ajuste se necessário)
        const res = await api.get('/lojas/', { params: { page: 1, per_page: 12 } });
        setLojas(res.data.items || []);
      } catch (e) {
        console.warn('Falha ao carregar lojas para carrossel', e);
        setLojas([]);
      }
    })();
  }, []);

  if (!lojas.length) return null;

  const scroll = (dir) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  return (
    <div className={`${embedded ? '' : 'container mx-auto'} my-8 w-full max-w-full overflow-hidden`}>
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg px-4 md:px-6 py-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Lojas</h2>
          <button onClick={()=>router.push('/lojas')} className="text-sm text-indigo-600 hover:underline">Ver mais</button>
        </div>

        <button onClick={()=>scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">◀</button>
        <button onClick={()=>scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">▶</button>

        <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide touch-pan-x overscroll-x-contain w-full max-w-full">
          {lojas.map((l) => (
            <div key={l.id} className="min-w-[140px] max-w-[75vw] sm:max-w-none snap-start flex-shrink-0 cursor-pointer text-center" onClick={()=>router.push(`/lojas/${l.slug || l.id}`)}>
              <img src={l.logo || l.imagem || '/default.png'} alt={l.nome}
                   className="w-[120px] h-[120px] rounded-xl object-cover border-2 border-orange-400 mb-2 max-w-full"
                   onError={(e)=>{e.currentTarget.src='/default.png';}}/>
              <p className="text-sm font-medium text-gray-700 truncate w-[120px] mx-auto">{l.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
