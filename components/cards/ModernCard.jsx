import React, { useState, useCallback, useContext } from 'react';
import { Heart, MapPin, Eye, MessageCircle, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import { base_url } from '../../api/api';

export function ModernCard({ product }) {
  const [isLiked, setIsLiked] = useState(product.liked || false);
  const [likesCount, setLikesCount] = useState(parseInt(product.likes) || 0);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);

  const handleLike = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/produtos/${product.slug}/like`, null, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setIsLiked(prev => !prev);
        setLikesCount(response.data.total_likes);
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  }, [isAuthenticated, navigate, product.slug, token]);

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return `${base_url}/default.png`;
    if (imagePath.startsWith('http')) return imagePath;
    return `${base_url}/storage/produtos/${imagePath}`;
  };

  // Function to get the correct avatar URL
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return `${base_url}/default-avatar.png`;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `${base_url}/storage/avatars/${avatarPath}`;
  };

  return (
    <div className="bg-white rounded-xl border border-grey-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-60" onClick={() => navigate(`/product/${product.slug}`)}>
        <img 
          src={getImageUrl(product.thumb || product.capa)}
          onError={(e) => e.target.src = `${base_url}/default.png`}
          alt={product.title || product.nome}
          className="w-full h-full object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
        />
        <button 
          onClick={handleLike}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white line-clamp-2">
            {product.title || product.nome}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              {product.district || product.distrito}, {product.province || product.provincia}
            </span>
          </div>
          <span className="text-lg font-bold text-indigo-600">
            {product.price || product.preco} MT
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <img
            src={getAvatarUrl(product.user?.avatar)}
            alt={product.user?.name || 'User avatar'}
            className="h-8 w-8 rounded-full object-cover"
            onError={(e) => e.target.src = `${base_url}/default-avatar.png`}
          />
          <div>
            <p className="text-sm font-medium">{product.user?.name || 'Usuário'}</p>
            <p className="text-xs text-gray-500">{product.time || 'Agora'}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{product.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{likesCount}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-indigo-500 hover:border hover:p-1 rounded-md border-indigo-400">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{product?.comments?.length || 0}</span>
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
}