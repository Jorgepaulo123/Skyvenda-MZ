import React, { useEffect, useState } from 'react';
import { ArrowRight, Eye, Clock } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Componente para formatar o preço
const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN'
  }).format(price);
};

// Componente para exibir o tempo restante
const TimeRemaining = ({ expiryDate }) => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Clock className="w-3 h-3" />
      <span>{days}d {hours}h restantes</span>
    </div>
  );
};

// Componente de item de produto
const ProductItem = ({ produto, anuncio }) => (
  <Link 
    to={`/post/${produto.slug}`} 
    className="block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div className="relative aspect-square">
      <img
        src={produto.capa}
        alt={produto.nome}
        className="w-full h-full object-cover"
        onError={(e) => e.target.src = 'https://storage.googleapis.com/skyvendamz1/default.png'}
      />
      <div className="absolute top-2 right-2">
        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          -45%
        </span>
      </div>
    </div>
    
    <div className="p-3 space-y-2">
      <div>
        <div className="text-lg font-bold text-indigo-600">
          {formatPrice(produto.preco)}
        </div>
        <div className="text-sm text-gray-400 line-through">
          {formatPrice(produto.preco * 1.45)}
        </div>
      </div>
      
      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
        {produto.nome}
      </h3>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <TimeRemaining expiryDate={anuncio.expira_em} />
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Eye className="w-3 h-3" />
          <span>{produto.views}</span>
        </div>
      </div>
    </div>
  </Link>
);

// Componente de esqueleto para carregamento
const ProductItemSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <div className="p-3 space-y-2">
      <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
      <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
      <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
    </div>
  </div>
);

// Componente principal de Super Ofertas
const SuperOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://skyvendas-production.up.railway.app/produtos/anuncios/tipo?tipo_anuncio=ofertas_diarias&limit=10'
        );
        console.log('Ofertas diárias:', response.data);
        setOfertas(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar ofertas diárias:', err);
        setError('Não foi possível carregar as ofertas. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchOfertas();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            Super<span className="text-red-500">Ofertas</span>
          </h2>
          <p className="text-sm text-gray-600">Ofertas diárias especiais</p>
        </div>
        <Link 
          to="/ofertas-diarias" 
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))}
        </div>
      ) : ofertas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ofertas.map((item) => (
            <ProductItem 
              key={item.anuncio.id} 
              produto={item.produto} 
              anuncio={item.anuncio} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500">Nenhuma oferta disponível no momento.</p>
        </div>
      )}
    </div>
  );
};

export default SuperOfertas;
