import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { base_url } from '../../api/api';

const SuggestedProducts = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/produtos/?limit=30&offset=0`);
        setProdutos(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-500">Carregando produtos...</div>;
  }

  // Ensure produtos is an array and has items
  if (!Array.isArray(produtos) || produtos.length === 0) {
    return <div className="p-4 text-gray-500">Nenhum produto disponível</div>;
  }

  // Helper function to get most viewed products
  const getMostPopular = () => {
    return produtos
      .filter(p => p.views) // ensure item has views
      .sort((a, b) => parseInt(b.views || '0') - parseInt(a.views || '0'))
      .slice(0, 3);
  };

  // Helper function to get products by category
  const getProductsByCategory = (category) => {
    return produtos
      .filter(p => p.category === category)
      .slice(0, 3);
  };

  // Get suggested categories
  const mostPopular = getMostPopular();
  const houses = getProductsByCategory("Imóveis");
  const smartphones = produtos.filter(p => p.type === "Celulares").slice(0, 3);
  const cars = produtos.filter(p => p.category === "Automotivo e moto").slice(0, 3);

  // Create suggested sections array
  const suggestedSections = [
    { title: "Mais Populares", products: mostPopular },
    { title: "Imóveis", products: houses },
    { title: "Smartphones", products: smartphones },
    { title: "Carros", products: cars }
  ].filter(section => section.products.length > 0);

  // If no sections have products, show message
  if (suggestedSections.length === 0) {
    return <div className="p-4 text-gray-500">Nenhuma sugestão disponível</div>;
  }

  const formatPrice = (price) => {
    const n = Number(price) || 0;
    // Formata com separadores PT-MZ e sufixo padronizado "MTn"
    return `${new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} MTn`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 px-2 mt-10">
      {suggestedSections.map((section, index) => (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm" key={index}>
          <h3 className="font-bold text-lg mb-3 text-gray-800">{section.title}</h3>
          <ul className="grid grid-cols-3 gap-3">
            {section.products.map((product) => (
              <li key={product.id} className="min-w-0">
                <div className="flex flex-col space-y-2 group cursor-pointer min-w-0">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={product.thumb} // Usando diretamente a URL completa do thumb
                      onError={(e) => e.target.src = `${base_url}/default.png`}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h4 className="text-sm text-gray-700 truncate" title={product.title}>{product.title}</h4>
                  <span className="block font-bold text-violet-600 text-sm">{formatPrice(product.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SuggestedProducts;