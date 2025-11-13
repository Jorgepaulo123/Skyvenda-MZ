import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import NoAdsPromoCard from './NoAdsPromoCard';

const SLIDE_HEIGHT = 160; // same as native app

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getBadgeInfo(tipo) {
  switch (tipo) {
    case 'melhores_boladas':
      return { text: 'MELHOR BOLADA', color: '#FFFFFF', bgColor: '#DC2626' };
    case 'ofertas_diarias':
      return { text: 'OFERTA DIÁRIA', color: '#FFFFFF', bgColor: '#EA580C' };
    case 'promocoes':
      return { text: 'PROMOÇÃO', color: '#FFFFFF', bgColor: '#7C3AED' };
    case 'destaque':
      return { text: 'DESTAQUE', color: '#FFFFFF', bgColor: '#059669' };
    default:
      return { text: 'OFERTA', color: '#FFFFFF', bgColor: '#374151' };
  }
}

function formatMZN(value) {
  if (typeof value !== 'number') return '';
  try {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value);
  } catch {
    return `MZN ${value}`;
  }
}

export default function BannerSlider() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [auto, setAuto] = useState(true);
  const timerRef = useRef(null);

  // Load real ads from API to mirror native app
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('https://skyvenda-mz.up.railway.app/produtos/allads');
        const data = await res.json();
        if (!active || !Array.isArray(data)) return;

        const filtered = data.filter(ad => {
          const hasImage = ad.tipo === 'anuncio2' ? ad.foto : ad.produto_capa;
          return ad.ativo && hasImage;
        });

        const mapped = filtered.map(ad => {
          const title = ad.titulo && ad.titulo.trim() ? ad.titulo : (ad.nome || ad.produto_nome || 'Sem título');
          const image = ad.tipo === 'anuncio2' ? ad.foto : ad.produto_capa;
          return {
            id: ad.id,
            title,
            image,
            link: ad.link,
            tipo_anuncio: ad.tipo_anuncio,
            location: ad.localizacao && ad.localizacao !== 'null' ? ad.localizacao : 'Moçambique',
            price: ad.preco,
            produto_id: ad.produto_id,
            slug: ad.slug,
          };
        });

        const shuffled = shuffleArray(mapped);
        setItems(shuffled);
        setIndex(0);
      } catch (e) {
        console.log('BannerSlider web: load error', e);
        setItems([]);
      } finally {
        active && setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // Autoplay similar to native (4s)
  useEffect(() => {
    if (!auto || items.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [auto, items.length]);

  const goTo = useCallback((i) => {
    setIndex(i);
    setAuto(false);
    window.clearInterval(timerRef.current);
    window.setTimeout(() => setAuto(true), 5000);
  }, []);

  const onClick = useCallback((item) => {
    if (item.link) {
      window.open(item.link, '_blank');
    } else if (item.slug) {
      window.location.href = `/product/${item.slug}`;
    }
  }, []);

  const heightClass = useMemo(() => `h-[${SLIDE_HEIGHT}px]`, []);

  if (loading) {
    return (
      <div className="px-0">
        <div className={`w-full ${heightClass} rounded-xl overflow-hidden`}>
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="px-0">
        <NoAdsPromoCard />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden bg-gray-900`}>
        {/* slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((it) => (
            <div key={it.id} className="w-full h-full flex-shrink-0 relative">
              {it.image ? (
                <img src={it.image} alt={it.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gray-800" />
              )}

              {/* top badge */}
              {it.tipo_anuncio && (
                <div
                  className="absolute top-3 left-3 px-3 py-1.5 rounded-full shadow-md"
                  style={{ backgroundColor: getBadgeInfo(it.tipo_anuncio).bgColor }}
                >
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wide"
                    style={{ color: getBadgeInfo(it.tipo_anuncio).color }}
                  >
                    {getBadgeInfo(it.tipo_anuncio).text}
                  </span>
                </div>
              )}

              {/* bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-[40%]" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.7) 100%)'
              }} />

              {/* bottom overlay content */}
              <button
                onClick={() => onClick(it)}
                className="absolute inset-0 text-left"
                aria-label={it.title || 'Ver anúncio'}
              />
              <div className="absolute inset-x-0 bottom-0 pb-1.5 pt-2 px-3">
                <div className="text-white text-[18px] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
                  {it.title || 'Sem título'}
                </div>
                {(it.location || it.price) && (
                  <div className="flex items-center justify-between mt-1"> 
                    {it.location ? (
                      <div className="flex items-center text-white/90">
                        {/* location icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                        </svg>
                        <span className="ml-1 text-[13px] font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] truncate max-w-[60%]">
                          {it.location}
                        </span>
                      </div>
                    ) : <span />}
                    {typeof it.price === 'number' && (
                      <div className="bg-violet-600/90 rounded-[14px] px-2.5 py-1">
                        <span className="text-white text-[13px] font-extrabold">{formatMZN(it.price)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center mt-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full mx-[3px] transition-all ${i === index ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
