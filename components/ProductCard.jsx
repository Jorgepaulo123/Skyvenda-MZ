import React, { useState, useEffect, useContext } from 'react';
import { base_url } from '../api/api';
import { Heart, Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { useRouter } from 'next/navigation';

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' })
    .format(price)
    .replace('MTn', 'MZN');
};

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = React.useState(product.liked);
  const [likes, setLike] = React.useState(product.likes);
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  const handleAddToCart = React.useCallback((e) => {
    e.stopPropagation();
    toast.success(`${product.nome} adicionado ao carrinho!`);
  }, [product.nome]);

  const handleClick = React.useCallback(() => {
    router.push(`/product/${product.slug}`);
  }, [router, product.slug]);

  const handleLike = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      setIsLiked(prev => !prev);
      setLike(prev => isLiked ? prev - 1 : prev + 1);
      api.post(`/produtos/${product.slug}/like`);
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, isLiked, router, product.slug]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500"
      layout
    >
      {/* Rest of the component remains the same */}
      {/* Image Section */}
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={`${base_url}/produto/${product.capa}`}
          alt={product.nome}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Location Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
            <FiMapPin className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">{product.provincia || 'Maputo'}</span>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/95 text-gray-700 hover:bg-red-50'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
          </motion.button>
          
          <div className="flex items-center space-x-1 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
            <FiMessageCircle className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">{product.comentario}</span>
          </div>
          
          <div className="flex items-center space-x-1 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
            <FiEye className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">{product.view}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 bg-gradient-to-br from-white/80 to-white/40">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {product.nome}
          </h3>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">({product.rating})</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(product.preco)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{product.tempo}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FiShoppingCart className="" />
            <span className="hidden sm:inline">Comprar</span>
          </motion.button>
        </div>

        {product.usuario?.nome && (
          <div className="mt-4 flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {product.usuario.nome[0]}
            </div>
            <span className="text-sm font-medium text-blue-600">{product.usuario.nome}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

ProductCard.displayName = 'ProductCard';
export default ProductCard;