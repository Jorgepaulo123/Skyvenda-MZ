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
import News from './products/news';
import NhonguistasCarousel from '../NhonguistasCarousel';
import FeaturedProducts from '../FeaturedProducts';

const DEBUG = true;
const FEED_TYPES = {
  PRODUCT: 'product',
  POST: 'post', 
  AD: 'ad',
  FRIEND_SUGGESTION: 'friend_suggestion'
};

export default function MobileFeed() {
  // Função para buscar dados reais do feed (/feed) com cursor
  const fetchFeedData = useCallback(async ({ cursor, isRefresh, signal }) => {
    try {
      const params = new URLSearchParams();
      params.set('cursor', String(cursor || '1'));
      params.set('limit', '20');
      const url = `/feed?${params.toString()}`;

      const response = await api.get(url, { signal });
      const payload = response?.data || {};
      const items = Array.isArray(payload.items)
        ? payload.items
        : (Array.isArray(payload.data?.items) ? payload.data.items : []);

      // Normalizar itens para o renderer atual
      const normalized = items.map((it) => {
        const type = it.type;
        const data = it.data || {};
        const ts = it.timestamp || new Date().toISOString();

        if (type === FEED_TYPES.PRODUCT) {
          let images = [];
          if (Array.isArray(data.images)) images = data.images;
          else if (typeof data.images === 'string' && data.images.trim().length > 0) {
            try {
              const parsed = JSON.parse(data.images);
              if (Array.isArray(parsed)) images = parsed;
            } catch {}
          }
          return {
            type,
            id: it.id || data.id || `product-${Date.now()}-${Math.random()}`,
            timestamp: ts,
            data: {
              ...data,
              images,
              user: data.user || { name: 'Vendedor', avatar: null },
            }
          };
        }

        if (type === FEED_TYPES.POST) {
          const author = data.usuario || data.user || {};
          return {
            type,
            id: it.id || data.id || `post-${Date.now()}-${Math.random()}`,
            timestamp: ts,
            data: {
              id: data.id,
              content: data.conteudo || data.content,
              gradient_style: data.gradient_style || 'default',
              time: data.data_criacao || data.time || '',
              likes: Number(data.likes_count || data.likes || 0),
              user: {
                name: author.nome || author.username || 'Usuário',
                avatar: author.foto_perfil || author.avatar || null,
              },
            }
          };
        }

        if (type === FEED_TYPES.AD) {
          return {
            type,
            id: it.id || `ad-${Date.now()}-${Math.random()}`,
            timestamp: ts,
            data
          };
        }

        if (type === FEED_TYPES.FRIEND_SUGGESTION) {
          return {
            type,
            id: it.id || `friend-${Date.now()}-${Math.random()}`,
            timestamp: ts,
            data
          };
        }

        // Fallback
        return {
          type: FEED_TYPES.PRODUCT,
          id: `unknown-${Date.now()}-${Math.random()}`,
          timestamp: ts,
          data,
        };
      });

      // Expand friends_suggestion list (if backend sends as a block)
      const friendBlock = Array.isArray(payload.friends_suggestion)
        ? payload.friends_suggestion.map((f) => ({
            type: FEED_TYPES.FRIEND_SUGGESTION,
            id: f.id || `friend-${Date.now()}-${Math.random()}`,
            timestamp: new Date().toISOString(),
            data: f,
          }))
        : [];

      const merged = normalized.concat(friendBlock);

      const serverNext = (payload.cursor || payload.next_cursor || payload.next || payload.data?.cursor || null);
      const hasMore = (payload.has_more ?? payload.hasMore ?? payload.data?.has_more ?? false);
      const nextCursor = serverNext || String((parseInt(cursor || '1') || 1) + 1);
      return {
        data: merged,
        hasMore: Boolean(hasMore),
        nextCursor,
        serverAdvanced: Boolean(serverNext)
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
    rootMargin: '300px' // Mais margem para mobile
  });

  // Carregar mais quando chegar ao fim
  React.useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore, loadMore]);

  // Se o sentinela ainda não está visível mas há mais páginas, tente carregar automaticamente
  React.useEffect(() => {
    if (!loading && !loadingMore && hasMore && !inView) {
      loadMore();
    }
  }, [loading, loadingMore, hasMore, inView, loadMore]);

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
    <div className="bg-white pt-[130px]">
      <NewPostInput />
      <div className="px-3 py-3">
        <BannerSlider />
      </div>
      <div className="py-0">
        <News />
      </div>
      <div className="py-2">
        <NhonguistasCarousel embedded />
      </div>
      <div className="px-3 py-2">
        <FeaturedProducts /> 
      </div>
    </div>
  ), []);

  // Componentes auxiliares
  const SkeletonPost = () => (
    <div className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
      </div>
      <div className="mx-4 mb-4 h-28 rounded-xl bg-gray-200 animate-pulse" />
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );

  const SkeletonProduct = () => (
    <div className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="mx-4 mt-3 mb-4 h-40 rounded-xl bg-gray-200 animate-pulse" />
      <div className="px-4 pb-4">
        <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );

  const LoadingComponent = () => (
    <div>
      <SkeletonPost />
      <SkeletonProduct />
      <SkeletonPost />
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
      {(loading || loadingMore || refreshing) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
          <div className="h-1 w-full overflow-hidden">
            <div className="h-full w-1/3 rounded-r-full loading-slide bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400" />
          </div>
        </div>
      )}
      {/* Conteúdo do feed - Estilo rede social mobile */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header do feed */}
        {FeedHeader}
        
        <div className="pb-20">
        {loading && items.length === 0 ? (
          <LoadingComponent />
        ) : error && items.length === 0 ? (
          <ErrorComponent />
        ) : items.length === 0 && hasMore ? (
          <LoadingComponent />
        ) : items.length === 0 ? (
          null
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
              <div className="py-2">
                <SkeletonPost />
              </div>
            )}
            
            {/* Sem texto de fim: deixamos em branco quando acabar */}
          </>
        )}
        </div>
      </div>

      {/* Pull to refresh indicator - apenas visual para web */}
      {refreshing && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-4 py-2 z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            <span className="text-sm text-gray-600">Atualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
