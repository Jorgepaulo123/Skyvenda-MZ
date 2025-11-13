"use client";
import React, { useContext } from 'react';
import { HomeContext } from '../context/HomeContext';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/components/lib/resolveImageUrl';
import { MapPin } from 'lucide-react';

function FeaturedProducts() {
  const { produtos } = useContext(HomeContext);
  const router = useRouter();

  const formatMZN = (value) => {
    if (typeof value !== 'number') return '0,00 MZN';
    try {
      return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value);
    } catch {
      return `${value} MZN`;
    }
  };

  const handlePress = (p) => {
    const slug = p.slug || p?.produto_slug || p?.id;
    if (slug) router.push(`/product/${slug}`);
  };

  return (
    <div className="bg-white">
      <h2 className="text-base font-semibold mb-3 text-gray-900 px-1">Produtos em Destaque</h2>
      <div className="grid grid-cols-2 gap-3">
        {produtos?.slice(0, 6).map((p) => {
          const displayTitle = p.title ?? p.nome ?? '';
          const displayPrice = p.price ?? p.preco ?? 0;
          const displayImage = p.thumb ?? p.imagem ?? '';
          const displayDesc = p.descricao ?? p.description ?? '';
          const displayProvince = p.province ?? p.provincia ?? p.local ?? '';
          return (
            <button
              key={p.id}
              onClick={() => handlePress(p)}
              className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 text-left shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <img
                src={resolveImageUrl(displayImage) }
                alt={displayTitle}
                className="w-full aspect-[4/3] object-cover bg-gray-100"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Produto')}
              />
              <div className="p-2">
                <div className="text-[13px] font-bold text-gray-900 truncate">{displayTitle}</div>
                <div className="mt-1 text-indigo-600 font-bold text-sm">{formatMZN(displayPrice)}</div>
                {displayProvince ? (
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                    <MapPin size={12} />
                    <span className="truncate">{displayProvince}</span>
                  </div>
                ) : null}
                {displayDesc ? (
                  <div className="mt-1 text-gray-500 text-[11px] leading-snug line-clamp-2">{displayDesc}</div>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturedProducts;