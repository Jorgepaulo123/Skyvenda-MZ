import React, { useState, useCallback, useContext } from 'react';
import { Heart, MapPin, MoreHorizontal, Eye, Share2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/components/lib/resolveImageUrl';
import api from '@/api/api';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ProductCard({ data }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(!!data.liked);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(Number(data.likes || 0));
  const [likeBusy, setLikeBusy] = useState(false);
  const [following, setFollowing] = useState(!!(data.user?.seguindo || data.user?.following));
  const [followBusy, setFollowBusy] = useState(false);
  const { isAuthenticated, token } = useContext(AuthContext);
  const { toast } = useToast();

  // Processar imagens
  const images = (data.images && data.images.length > 0)
    ? data.images.map(resolveImageUrl)
    : (data.thumb ? [resolveImageUrl(data.thumb)] : ['https://via.placeholder.com/800x600?text=Produto']);

  const handleProductPress = () => {
    router.push(`/product/${data.slug}`);
  };

  const handleUserPress = () => {
    console.log('User pressed:', data.user?.id);
    // navigate(`/profile/${data.user?.id}`);
  };

  const toggleLike = useCallback(async () => {
    if (!isAuthenticated) {
      toast({ title: 'Faça login para curtir' });
      return;
    }
    if (likeBusy) return;
    setLikeBusy(true);
    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!prevLiked);
    setLikes(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);
    try {
      await api.post(`/produtos/${data.slug}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (e) {
      setLiked(prevLiked);
      setLikes(prevLikes);
      toast({ title: 'Não foi possível curtir o produto' });
    } finally {
      setLikeBusy(false);
    }
  }, [isAuthenticated, likeBusy, liked, likes, data.slug, token, toast]);

  const toggleFollowUser = useCallback(async () => {
    if (!isAuthenticated) {
      toast({ title: 'Você precisa fazer login para seguir' });
      return;
    }
    if (followBusy || !data.user?.id) return;
    const prev = following;
    setFollowBusy(true);
    setFollowing(!prev);
    try {
      await api.post(`/usuario/${data.user.id}/seguir`, '', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (e) {
      setFollowing(prev);
      toast({ title: 'Não foi possível atualizar o seguir' });
    } finally {
      setFollowBusy(false);
    }
  }, [isAuthenticated, followBusy, following, data.user?.id, token, toast]);

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('pt-MZ', { 
        style: 'decimal', 
        minimumFractionDigits: 2 
      }).format(price);
    } catch {
      return String(price);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="product-card-mobile bg-white border-b border-gray-200 overflow-hidden">
      {/* Header - User Info */}
      <div className="flex items-center justify-between px-4 py-3">
        <button 
          onClick={handleUserPress}
          className="flex items-center space-x-3 flex-1"
        >
          <img
            src={data.user?.avatar || 'https://via.placeholder.com/40x40?text=U'}
            alt={data.user?.name}
            className="avatar-mobile w-10 h-10 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900 text-sm">
              {data.user?.name || 'Usuário'}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {data.province && (
                <div className="flex items-center space-x-1">
                  <MapPin size={12} />
                  <span>{data.province}</span>
                </div>
              )}
              {data.time && <span>• {data.time}</span>}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFollowUser}
            disabled={followBusy}
            className={`${following ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded-full text-xs font-medium hover:opacity-90 transition`}
          >
            {following ? 'Seguindo' : (
              <span className="flex items-center gap-1">
                <UserPlus size={14} /> Seguir
              </span>
            )}
          </button>
          <button className="action-button-mobile p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Title & Price */}
      <div className="px-4 mb-3">
        <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{data.title}</h2>
        <p className="text-xl font-bold text-indigo-600">
          {formatPrice(data.price)} MT
        </p>
      </div>

      {/* Description */}
      {data.description && (
        <div className="px-4 mb-3">
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
            {data.description}
          </p>
        </div>
      )}

      {/* Image - Single with overlay + counter + dots */}
      <div className="relative bg-gray-100">
        <button 
          onClick={handleProductPress}
          className="block w-full"
        >
          <img
            src={images[currentImageIndex]}
            alt={data.title}
            className="product-image-mobile w-full h-96 object-cover"
          />
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="image-counter-mobile absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1}/{images.length}
            </div>
          )}
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="image-nav-mobile absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="image-nav-mobile absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                →
              </button>
            </>
          )}
        </button>

        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`image-dots-mobile w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white active' 
                    : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="action-bar-mobile flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={toggleLike}
            disabled={likeBusy}
            className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors ${liked ? 'like-button-mobile liked' : 'like-button-mobile'}`}
          >
            <Heart 
              size={22} 
              className={liked ? 'text-red-500 fill-current' : ''} 
            />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Eye size={22} />
            <span className="text-sm font-medium">{data.views || '0'}</span>
          </div>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
            <Share2 size={22} />
          </button>
        </div>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="text-gray-600 hover:text-indigo-500 transition-colors"
        >
          <svg 
            width={22} 
            height={22} 
            viewBox="0 0 24 24" 
            fill={bookmarked ? 'currentColor' : 'none'}
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
