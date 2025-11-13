import React, { useContext, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../api/api';

import ProductCard2 from './cards/ProductCard2';
import PublicacoesCarousel from './PublicacoesCarousel';
import NhonguistasCarousel from './NhonguistasCarousel';

import { HomeContext } from '../context/HomeContext';


export default function MixedFeed() {
  const { produtos, setProdutos } = useContext(HomeContext);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 8;
  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  const fetchMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const offset = produtos.length;
      const res = await api.get(`/produtos/?user_id=0&limit=${LIMIT}&offset=${offset}`);
      const newProds = res.data || [];
      if (newProds.length < LIMIT) setHasMore(false);
      // dedup by id
      const merged = [...produtos];
      newProds.forEach(p=>{ if(!merged.find(m=>m.id===p.id)) merged.push(p); });
      setProdutos(merged);
    } catch(e){ console.error('Erro ao paginar produtos', e); setHasMore(false);} finally { setLoadingMore(false);} 
  }, [loadingMore, hasMore, produtos, setProdutos]);

  React.useEffect(()=>{ if(inView) fetchMore(); }, [inView, fetchMore]);

  const feedElements = React.useMemo(() => {
    const arr = [];
    let lastType = null;
    (produtos || []).forEach((prod, idx) => {
      arr.push(<ProductCard2 key={`prod-${prod.id}`} product={prod} />);
      if ((idx + 1) % 4 === 0) {
        let type = Math.random() < 0.5 ? 'pub' : 'nhon';
        if (type === lastType) type = type === 'pub' ? 'nhon' : 'pub'; // force switch to avoid duplicates
        lastType = type;
        arr.push(
          <div key={`carousel-${idx}`} className="col-span-full">
            {type === 'pub' ? <PublicacoesCarousel embedded /> : <NhonguistasCarousel embedded />}
          </div>
        );
      }
    });
    return arr;
  }, [produtos]);

  return (
    <div className="container mx-auto mb-12 bg-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-indigo-500">Para você</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {feedElements}
        {hasMore && <div ref={loadMoreRef} className="col-span-full h-1" />}
        {loadingMore && <p className="col-span-full text-center text-gray-400">Carregando...</p>}
      </div>
    </div>
  );
}
