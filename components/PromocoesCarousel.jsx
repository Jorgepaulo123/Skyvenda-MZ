import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function PromocoesCarousel({ embedded=false }) {
  const [produtos, setProdutos] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // endpoint de produtos em promoção (ajuste se necessário)
        const res = await api.get('/produtos/', { params: { page: 1, per_page: 12, promocao: true } });
        setProdutos(res.data.items || []);
      } catch (e) {
        console.warn('Falha ao carregar produtos promocionais', e);
        setProdutos([]);
      }
    })();
  }, []);

  if (!produtos.length) return null;

  const scroll = (dir) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollBy({ left: dir * width, behavior: 'smooth' });
  };

  return (
    <div className={`${embedded ? '' : 'container mx-auto'} my-8 w-full max-w-full overflow-hidden`}>
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg px-4 md:px-6 py-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Promoções</h2>
          <button onClick={()=>navigate('/promocoes')} className="text-sm text-indigo-600 hover:underline">Ver mais</button>
        </div>

        <button onClick={()=>scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">◀</button>
        <button onClick={()=>scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">▶</button>

        <div ref={containerRef} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide touch-pan-x overscroll-x-contain w-full max-w-full">
          {produtos.map((p) => (
            <div key={p.id} className="min-w-[160px] max-w-[85vw] sm:max-w-none snap-start flex-shrink-0 cursor-pointer" onClick={()=>navigate(`/produto/${p.slug || p.id}`)}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                <img src={p.imagem_principal || p.imagem || '/default.png'} alt={p.nome}
                     className="w-full h-[120px] rounded-lg object-cover mb-2"/>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{p.nome}</p>
                <div className="mt-1 flex items-end gap-2">
                  {p.preco_promocional ? (
                    <>
                      <span className="text-lg font-bold text-rose-600">{p.preco_promocional}</span>
                      <span className="text-xs text-gray-400 line-through">{p.preco}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-800">{p.preco}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
