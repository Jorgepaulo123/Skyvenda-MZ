import React, { useContext } from 'react';
import { HomeContext } from './HomeProvider';
import ProductCard from './ProductCard';
import { ModernCard } from './cards/ModernCard';
 
function ProductList() {
  const { produtos, loading, handleScroll } = useContext(HomeContext);

  return (
    <div
      onScroll={handleScroll}
      style={{
        height: '80vh', // Altura fixa para ativar o scroll
        overflowY: 'auto',
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Produtos em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {produtos && produtos.length > 0 ? (
          produtos.map(product => (
            <ModernCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center">Nenhum produto disponível.</p>
        )}
      </div>
      {loading && <p className="text-center">Carregando...</p>}
    </div>
  );
}

export default ProductList;
