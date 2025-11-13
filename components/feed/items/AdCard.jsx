import React from 'react';
import { ExternalLink, Megaphone } from 'lucide-react';
import { resolveImageUrl } from '@/components/lib/resolveImageUrl';

export default function AdCard({ data }) {
  const handleAdClick = () => {
    if (data.link) {
      window.open(data.link, '_blank');
    }
  };

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${price} MT`;
    }
  };

  const imageUrl = data.image ? resolveImageUrl(data.image) : null;

  return (
    <div className="bg-white border-b border-gray-200 md:mb-4 md:border md:border-gray-100 md:rounded-lg overflow-hidden">
      {/* Sponsored Label */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
        <Megaphone size={14} className="text-gray-500" />
        <span className="text-xs font-medium text-gray-600">Patrocinado</span>
      </div>

      <button onClick={handleAdClick} className="w-full text-left" aria-label="Abrir anúncio">
        {/* Large Image with overlay title */}
        {imageUrl && (
          <div className="relative h-52 bg-gray-100">
            <img src={imageUrl} alt={data.title} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-4 py-3">
              <h3 className="text-white font-bold text-base line-clamp-1">{data.title}</h3>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {!imageUrl && (
            <h3 className="text-gray-900 font-semibold text-base mb-1">
              {data.title || 'Anúncio Especial'}
            </h3>
          )}

          {data.product_name && (
            <div className="text-sm text-gray-700 mb-1">{data.product_name}</div>
          )}

          {data.price ? (
            <div className="text-indigo-600 font-extrabold text-lg mb-2">
              {formatPrice(data.price)}
            </div>
          ) : null}

          {data.description && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {data.description}
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              <span>{data.cta || 'Saiba Mais'}</span>
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
