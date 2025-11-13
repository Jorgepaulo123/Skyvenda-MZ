import React, { useState, useCallback, useContext } from 'react';
import { Heart, MessageCircle, Eye, MoreHorizontal, Copy, Send, Flag, Zap, Repeat } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import { base_url } from '../../api/api';

const ProductCard2 = ({ product }) => {
  const [isLiked, setIsLiked] = useState(Boolean(product?.liked));
  const [likesCount, setLikesCount] = useState(Number(product?.likes) || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, token } = useContext(AuthContext);

  if (!product) {
    return null;
  }

  const isOwner = user && product.user?.username === user.username;

  const handleLike = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    
    api.post(`/produtos/${product.slug}/like`, {}, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
  }, [isLiked, isAuthenticated, product.slug, user?.token]);

  const getStatusBadge = () => {
    const status = product?.state?.toLowerCase();
    switch (status) {
      case 'novo':
        return <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">Novo</span>;
      case 'seminovo':
        return <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">Seminovo</span>;
      case 'bolada':
        return <span className="px-2 py-1 text-xs font-medium text-white bg-purple-500 rounded-full">Bolada</span>;
      default:
        return null;
    }
  };

  const handleCopyLink = () => {
    const url = window.location.origin + `/product/${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setShowMenu(false);
  };

  const handleMessage = () => {
    router.push(`/chat/${product.user?.username}`);
    setShowMenu(false);
  };

  const handleReport = () => {
    alert('Denúncia enviada!');
    setShowMenu(false);
  };

  const handleBoost = () => {
    alert('Função de turbinar anúncio!');
    setShowMenu(false);
  };

  const handleMakeNegotiable = () => {
    alert('Função de tornar negociável!');
    setShowMenu(false);
  };

  const resolveImageUrl = (path) => {
    if (!path) return '/default.png';
    if (/^https?:\/\//i.test(path)) return path;
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base_url}${p}`;
  };

  const UserInfo = () => (
    <div className="flex-1 min-w-0">
      <Link href={`/${product.user?.username}` || '#'} className="text-sm font-medium text-gray-900 hover:underline truncate">
        {product.user?.name}
      </Link>
      <div className="text-xs text-gray-500 flex gap-1">
        <span>{product.time}</span>
        <span>•</span>
        <span className="truncate">{product.province}, {product.district}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl overflow-visible border border-gray-200 hover:shadow-xl transition-all duration-300 relative">
      {/* User Info */}
      <div className="p-3 flex items-start gap-2 relative">
        <img
          src={product.user?.avatar}
          onError={(e) => { e.target.src = '/avatar.png'; }}
          className="w-8 h-8 rounded-full cursor-pointer flex-shrink-0"
          alt={product.user?.name}
          onClick={() => router.push(`/${product.user?.username}`)}
        />
        <UserInfo />
        <div className="relative ml-auto">
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full" onClick={() => setShowMenu(v => !v)}>
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute top-0 left-full ml-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
              {isOwner ? (
                <>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                    onClick={handleBoost}
                  >
                    <Zap className="w-4 h-4" /> Turbinar
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Link copiado!' : 'Copiar link'}
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                    onClick={handleMakeNegotiable}
                  >
                    <Repeat className="w-4 h-4" /> Tornar negociável
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                    onClick={handleMessage}
                  >
                    <Send className="w-4 h-4" /> Mensagem
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 gap-2"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Link copiado!' : 'Copiar link'}
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 gap-2"
                    onClick={handleReport}
                  >
                    <Flag className="w-4 h-4" /> Denunciar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Title and Price */}
      <div className="px-3 pb-3">
        <h3 className="text-base font-medium text-gray-900 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#7a4fed]">
            {product.price?.toLocaleString('pt-MZ')} MT
          </span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Product Image */}
      <div 
        onClick={() => router.push(`/product/${product.slug}`)}
        className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
      >
        <img
          src={resolveImageUrl(product.thumb)}
          onError={(e) => {
            e.target.src = '/default.png';
          }}
          alt={product.title}
          className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Interaction Stats */}
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-[#7a4fed] text-[#7a4fed]' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-500">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{product.comments}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Eye className="h-5 w-5" />
              <span className="text-sm">{product.views}</span>
            </div>
          </div>
        </div>

        {/* Comprar Button */}
        <button
          onClick={() => router.push(`/product/${product.slug}`)}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-[#7a4fed] hover:bg-[#7a4fed]/5 rounded-lg transition-colors"
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProductCard2;