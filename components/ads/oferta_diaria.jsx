import React, { useEffect, useState } from 'react';
import { Heart, Eye, Sparkles, Star } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { base_url } from '../../api/api';

export default function Oferta_diaria() {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar ofertas diárias diretamente do endpoint específico
    axios.get(`${base_url}/produtos/anuncios/tipo?tipo_anuncio=ofertas_diarias&limit=10`)
      .then(response => {
        // Usar os dados diretamente sem transformação para manter a estrutura original
        setProdutos(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar ofertas diárias:', error);
        setIsLoading(false);
      });
  }, []);

  const ProductSkeleton = () => (
    <div className="snap-start flex-none w-[280px] md:w-[300px] transform transition-all duration-300 hover:scale-[1.02]">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex flex-col">
          <div className="relative w-full aspect-[4/3] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute top-3 left-3 h-6 w-24 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full animate-pulse" />
          </div>
          
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-1/2" />
            </div>
            
            <div className="pt-3 flex justify-between items-end">
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto py-8">
      <div className="flex items-center gap-4 mb-8 px-4">
        <div className="relative">
          <div className="relative bg-orange-500 p-3 rounded-xl">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-orange-600">Ofertas Diárias</h2>
          <p className="text-gray-500 text-sm mt-1">Descubra as melhores ofertas do dia</p>
        </div>
      </div>


      <div className="flex gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide pb-4 px-4">
        {isLoading ? (
          [...Array(4)].map((_, index) => <ProductSkeleton key={index} />)
        ) : (
          produtos.map((item) => (
            <Link 
              to={`/produto/${item.produto.slug}`} 
              key={item.anuncio.id}
              className="snap-start flex-none w-[280px] md:w-[300px] transform transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group">
                <div className="flex flex-col">
                  <div className="relative w-full aspect-[4/3]">
                    <img
                      src={item.produto.capa} 
                      alt={item.produto.nome}
                      onError={(e) => e.target.src = `${base_url}/default.png`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4" />
                      <span>Patrocinado</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.produto.nome}
                    </h3>
                    <p className="text-gray-600 text-sm leading-tight line-clamp-2">
                      {item.produto.descricao}
                    </p>

                    <div className="pt-3 flex justify-between items-end">
                      <span className="text-lg font-bold text-blue-600">
                        {item.produto.preco} MT
                      </span>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1.5 text-sm">
                          <Eye className="w-4 h-4" /> {item.produto.views}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm">
                          <Heart className="w-4 h-4" /> {item.produto.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}