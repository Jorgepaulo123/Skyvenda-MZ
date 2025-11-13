import React, { useState } from 'react';
import { List } from 'lucide-react';
import { categories } from '../../data/categories';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CategoryMenu() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
    setIsMenuOpen(true);
  };

  const handleMenuMouseLeave = () => {
    setIsMenuOpen(false);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = async (e, categoryId, subcategoryId, subItemId = null) => {
    e.preventDefault();
    setIsMenuOpen(false);

    // Encontrar os nomes das categorias para a pesquisa
    const category = categories.find(c => c.id === categoryId);
    const subcategory = category?.subcategories.find(s => s.id === subcategoryId);
    const subItem = subItemId ? subcategory?.subItems?.find(i => i.id === subItemId) : null;
    
    if (category && subcategory) {
      // Construir o termo de pesquisa
      let searchTerm = subItem ? subItem.name : subcategory.name;

      try {
        // Fazer a chamada à API de pesquisa com o endpoint correto
        const response = await fetch(
          `https://skyvendas-production.up.railway.app/produtos/pesquisa/?termo=${encodeURIComponent(searchTerm)}&offset=1&limit=10`,
          {
            headers: {
              'accept': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Navegar para a página de pesquisa com o termo e os resultados
          router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        } else {
          console.error('Erro na pesquisa:', response.statusText);
          router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
      } catch (error) {
        console.error('Erro na pesquisa:', error);
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  return (
    <div 
      className="relative"
      onMouseLeave={handleMenuMouseLeave}
    >
      {/* Menu Button */}
      <button 
        className="flex items-center justify-between space-x-2 bg-[#7a4fed] px-4 py-2 text-white rounded-md"
        onMouseEnter={() => setIsMenuOpen(true)}
      >
        <List />
        <span className="text-base font-medium">Todas As Categorias</span>
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-[800px] bg-white shadow-xl rounded-lg">
          <div className="flex">
            {/* Categories List */}
            <div className="w-1/3 border-r border-gray-100">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category)}
                >
                  <Link
                    href={`/search?q=${encodeURIComponent(category.name)}`}
                    className={`block px-4 py-3 hover:bg-indigo-50 transition-colors ${
                      hoveredCategory?.id === category.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
            </div>

            {/* Subcategories Panel */}
            {hoveredCategory && (
              <div 
                className="w-2/3 p-4 bg-white min-h-full"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{hoveredCategory.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {hoveredCategory.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="space-y-2">
                      <Link
                        href={`/search?q=${encodeURIComponent(subcategory.name)}`}
                        onClick={(e) => handleSubcategoryClick(e, hoveredCategory.id, subcategory.id)}
                        className="text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        {subcategory.name}
                      </Link>
                      
                      {/* Show sub-items if they exist */}
                      {subcategory.subItems && (
                        <div className="pl-4 space-y-2">
                          {subcategory.subItems.map((item) => (
                            <Link
                              key={item.id}
                              href={`/search?q=${encodeURIComponent(item.name)}`}
                              onClick={(e) => handleSubcategoryClick(e, hoveredCategory.id, subcategory.id, item.id)}
                              className="block text-sm text-gray-600 hover:text-indigo-600"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}