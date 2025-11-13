import React, { useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../../api/api';
import ProductCard from './items/ProductCard';
import PostCard from './items/PostCard';
import AdCard from './items/AdCard';
import FriendSuggestionCard from './items/FriendSuggestionCard';
import NewPostInput from './NewPostInput';
import BannerSlider from '../ads/BannerSlider';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import './feed-mobile.css';

const DEBUG = true;
const FEED_TYPES = {
  PRODUCT: 'product',
  POST: 'post', 
  AD: 'ad',
  FRIEND_SUGGESTION: 'friend_suggestion'
};

export default function ResponsiveFeed() {
  // Função para buscar dados da API
  const fetchFeedData = useCallback(async ({ cursor, isRefresh, signal }) => {
    const limit = 10;
    const offset = isRefresh ? 0 : (parseInt(cursor) - 1) * limit;
    
    try {
      // Buscar produtos
      const response = await api.get(`/produtos/?user_id=0&limit=${limit}&offset=${offset}`, {
        signal
      });
      
      const newProducts = response.data || [];
      
      // Converter produtos para itens do feed
      const feedItems = [];
      
      newProducts.forEach((product, index) => {
        // Adicionar produto
        feedItems.push({
          type: FEED_TYPES.PRODUCT,
          id: `product-${product.id}`,
          timestamp: product.created_at || new Date().toISOString(),
          data: {
            ...product,
            user: product.user || { name: 'Vendedor', avatar: null },
            images: Array.isArray(product.images) ? product.images : 
                   (product.images ? [product.images] : [product.thumb]),
            likes: product.likes || Math.floor(Math.random() * 50),
            views: product.views || Math.floor(Math.random() * 200),
            time: '2h atrás' // Placeholder
          }
        });
        
        // A cada 3 produtos, adicionar conteúdo especial
        if ((index + 1) % 3 === 0) {
          const rand = Math.random();
          
          if (rand < 0.2) {
            // 20% chance de sugestão de amigo
            feedItems.push({
              type: FEED_TYPES.FRIEND_SUGGESTION,
              id: `friend-${Date.now()}-${index}`,
              timestamp: new Date().toISOString(),
              data: {
                id: Math.random(),
                name: 'João Silva',
                avatar: 'https://via.placeholder.com/60x60?text=J',
                bio: 'Vendedor de produtos eletrônicos em Maputo',
                location: 'Maputo, Moçambique',
                mutualFriends: Math.floor(Math.random() * 10),
                products: Math.floor(Math.random() * 50),
                type: Math.random() > 0.5 ? 'business' : 'personal'
              }
            });
          } else if (rand < 0.4) {
            // 20% chance de post
            feedItems.push({
              type: FEED_TYPES.POST,
              id: `post-${Date.now()}-${index}`,
              timestamp: new Date().toISOString(),
              data: {
                id: Math.random(),
                content: 'Confira nossos novos produtos! Qualidade garantida e preços acessíveis. 🛍️✨',
                user: { name: 'Maria Santos', avatar: 'https://via.placeholder.com/40x40?text=M' },
                time: '1h atrás',
                likes: Math.floor(Math.random() * 30),
                comments: Math.floor(Math.random() * 10),
                gradient_style: ['purple', 'blue', 'green', 'pink', 'orange'][Math.floor(Math.random() * 5)]
              }
            });
          } else if (rand < 0.5) {
            // 10% chance de anúncio
            feedItems.push({
              type: FEED_TYPES.AD,
              id: `ad-${Date.now()}-${index}`,
              timestamp: new Date().toISOString(),
              data: {
                id: Math.random(),
                title: 'Oferta Especial - Produtos Selecionados',
                description: 'Descontos de até 50% em produtos selecionados. Aproveite!',
                image: 'https://via.placeholder.com/80x80?text=AD',
                price: '999.99',
                cta: 'Ver Ofertas',
                link: '#'
              }
            });
          }
        }
      });
      
      return {
        data: feedItems,
        hasMore: newProducts.length >= limit,
        nextCursor: String(parseInt(cursor) + 1)
      };
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }, []);

  // Hook de infinite scroll
  const {
    items,
    loading,
    loadingMore,
    refreshing,
    hasMore,
    error,
    refresh,
    loadMore,
    restart
  } = useInfiniteScroll({
    fetchData: fetchFeedData,
    initialCursor: '1',
    minPaginationInterval: 1000,
    maxItems: 100,
    debug: DEBUG
  });

  // Intersection Observer para detectar fim da lista
  const { ref: loadMoreRef, inView } = useInView({ 
    threshold: 0,
    rootMargin: '300px'
  });

  // Carregar mais quando chegar ao fim
  React.useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  // Renderizar item do feed
  const renderFeedItem = useCallback((item) => {
    switch (item.type) {
      case FEED_TYPES.PRODUCT:
        return <ProductCard key={item.id} data={item.data} />;
      
      case FEED_TYPES.POST:
        return <PostCard key={item.id} data={item.data} />;
      
      case FEED_TYPES.AD:
        return <AdCard key={item.id} data={item.data} />;
      
      case FEED_TYPES.FRIEND_SUGGESTION:
        return <FriendSuggestionCard key={item.id} data={item.data} />;
      
      default:
        return null;
    }
  }, []);

  // Header do feed
  const FeedHeader = useMemo(() => (
    <div className="bg-white pt-[126px]">
      <NewPostInput />
      <div className="px-4 pb-3">
        <BannerSlider />
      </div>
    </div>
  ), []);

  // Componentes auxiliares
  const LoadingComponent = () => (
    <div className="flex justify-center py-8">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        <span className="text-gray-600">Carregando...</span>
      </div>
    </div>
  );

  const ErrorComponent = () => (
    <div className="text-center py-8 px-4">
      <p className="text-red-500 mb-4">{error}</p>
      <button 
        onClick={refresh}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );

  const EmptyComponent = () => (
    <div className="text-center py-12 px-4">
      <p className="text-gray-500 mb-4">Nenhum produto encontrado</p>
      <button 
        onClick={refresh}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Recarregar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conteúdo do feed - Responsivo */}
      <div className="feed-mobile-container md:max-w-2xl lg:max-w-4xl mx-auto min-h-screen">
        {/* Header do feed */}
        {FeedHeader}
        
        <div className="pb-20">
        {loading && items.length === 0 ? (
          <LoadingComponent />
        ) : error && items.length === 0 ? (
          <ErrorComponent />
        ) : items.length === 0 ? (
          <EmptyComponent />
        ) : (
          <>
            {/* Items do feed */}
            {items.map(renderFeedItem).filter(Boolean)}
            
            {/* Trigger para infinite scroll */}
            {hasMore && (
              <div ref={loadMoreRef} className="h-1" />
            )}
            
            {/* Loading indicator para mais itens */}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                  <span className="text-gray-500 text-sm">Carregando mais...</span>
                </div>
              </div>
            )}
            
            {/* Mensagem de fim */}
            {!hasMore && items.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center space-y-3">
                  <span className="text-lg">🎉 Você chegou ao fim!</span>
                  <p className="text-sm">Explore mais produtos ou comece novamente</p>
                  <button 
                    onClick={restart}
                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors font-medium"
                  >
                    Recomeçar do início
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="pull-to-refresh-mobile fixed top-20 left-1/2 transform -translate-x-1/2 rounded-full px-4 py-2 z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            <span className="text-sm text-gray-600">Atualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
