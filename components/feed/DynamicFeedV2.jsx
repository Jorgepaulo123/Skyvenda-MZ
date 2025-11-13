import React, { useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import api from '../../api/api';
import ProductCard2 from '../cards/ProductCard2';
import PublicacoesCarousel from '../PublicacoesCarousel';
import NhonguistasCarousel from '../NhonguistasCarousel';
import AdsMore from '../ads/ads';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const DEBUG = true;
const FEED_TYPES = {
  PRODUCT: 'product',
  POST: 'post', 
  AD: 'ad',
  FRIEND_SUGGESTION: 'friend_suggestion'
};

export default function DynamicFeedV2() {
  // Função para buscar dados da API
  const fetchFeedData = useCallback(async ({ cursor, isRefresh, signal }) => {
    const limit = 12;
    const offset = isRefresh ? 0 : (parseInt(cursor) - 1) * limit;
    
    // Buscar produtos
    const response = await api.get(`/produtos/?user_id=0&limit=${limit}&offset=${offset}`, {
      signal
    });
    
    const newProducts = response.data || [];
    
    // Converter produtos para itens do feed
    const feedItems = newProducts.map(product => ({
      type: FEED_TYPES.PRODUCT,
      id: `product-${product.id}`,
      timestamp: product.created_at || new Date().toISOString(),
      data: product
    }));
    
    // Adicionar itens especiais a cada 4 produtos
    const enrichedItems = [];
    feedItems.forEach((item, index) => {
      // Normalizar item
      let normalizedItem = item;
      if (item.type === FEED_TYPES.PRODUCT) {
        const data = item.data || {};
        let images = [];
        
        if (Array.isArray(data.images)) {
          images = data.images;
        } else if (typeof data.images === 'string' && data.images.trim().length > 0) {
          try {
            const parsed = JSON.parse(data.images);
            if (Array.isArray(parsed)) images = parsed;
          } catch {
            // Ignore parsing errors
          }
        }
        
        normalizedItem = {
          ...item,
          data: { ...data, images }
        };
      }
      
      enrichedItems.push(normalizedItem);
      
      // A cada 4 produtos, adicionar carousel ou ad
      if ((index + 1) % 4 === 0) {
        const specialType = Math.random() < 0.3 ? FEED_TYPES.AD : 
                           Math.random() < 0.5 ? 'publications' : 'nhonguistas';
        
        enrichedItems.push({
          type: specialType,
          id: `${specialType}-${Date.now()}-${index}`,
          timestamp: new Date().toISOString(),
          data: { specialType }
        });
      }
    });
    
    return {
      data: enrichedItems,
      hasMore: newProducts.length >= limit,
      nextCursor: String(parseInt(cursor) + 1)
    };
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
    maxItems: 80,
    debug: DEBUG
  });

  // Intersection Observer para detectar fim da lista
  const { ref: loadMoreRef, inView } = useInView({ 
    threshold: 0,
    rootMargin: '200px'
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
        return <ProductCard2 key={item.id} product={item.data} />;
      
      case FEED_TYPES.AD:
        return (
          <div key={item.id} className="col-span-full my-4">
            <AdsMore />
          </div>
        );
      
      case 'publications':
        return (
          <div key={item.id} className="col-span-full my-6">
            <PublicacoesCarousel embedded />
          </div>
        );
      
      case 'nhonguistas':
        return (
          <div key={item.id} className="col-span-full my-6">
            <NhonguistasCarousel embedded />
          </div>
        );
      
      default:
        return null;
    }
  }, []);

  // Memoizar elementos do feed
  const feedElements = useMemo(() => {
    return items.map(renderFeedItem).filter(Boolean);
  }, [items, renderFeedItem]);

  // Componentes auxiliares
  const LoadingComponent = () => (
    <div className="col-span-full flex justify-center py-8">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
        <span className="text-gray-600">Carregando...</span>
      </div>
    </div>
  );

  const ErrorComponent = () => (
    <div className="col-span-full text-center py-8">
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
    <div className="col-span-full text-center py-12">
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
    <div className="container mx-auto mb-12 bg-white min-h-screen">
      {/* Header com botão de refresh */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-500">Para você</h2>
        <button 
          onClick={refresh}
          disabled={refreshing || loading}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {refreshing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Atualizando...</span>
            </div>
          ) : (
            'Atualizar'
          )}
        </button>
      </div>

      {/* Conteúdo do feed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading && items.length === 0 ? (
          <LoadingComponent />
        ) : error && items.length === 0 ? (
          <ErrorComponent />
        ) : items.length === 0 ? (
          <EmptyComponent />
        ) : (
          <>
            {feedElements}
            
            {/* Trigger para infinite scroll */}
            {hasMore && (
              <div ref={loadMoreRef} className="col-span-full h-1" />
            )}
            
            {/* Loading indicator para mais itens */}
            {loadingMore && (
              <div className="col-span-full flex justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                  <span className="text-gray-500 text-sm">Carregando mais...</span>
                </div>
              </div>
            )}
            
            {/* Mensagem de fim */}
            {!hasMore && items.length > 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
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
  );
}
