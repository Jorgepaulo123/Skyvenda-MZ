import React, { useState } from 'react';
import { Package, MessageCircle, UserPlus, UserCheck, Award } from 'lucide-react';

const mockUser = {
  name: "Maria Silva",
  type: "vendedor",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
  followers: 1234,
  following: 321,
  rating: 4.8,
  totalSales: 156,
  products: [
    {
      id: 1,
      name: "Smartphone XYZ",
      price: "R$ 1.299,00",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
    },
    {
      id: 2,
      name: "Notebook Pro",
      price: "R$ 4.599,00",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
    },
    {
      id: 3,
      name: "Smartwatch Series 5",
      price: "R$ 899,00",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400"
    }
  ]
};

export default function PublicProfile()  {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 w-full">
        <img
          src={mockUser.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative pb-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            {/* Profile Info */}
            <div className="flex flex-col items-center">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
              
              <div className="mt-4 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <h1 className="text-xl font-semibold text-gray-900">{mockUser.name}</h1>
                  {mockUser.type === 'vendedor' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      <Award className="w-3 h-3 mr-1" />
                      Verificado
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 justify-center">
                  <button 
                    className={`inline-flex items-center px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                      isFollowing 
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-1" />
                        Seguindo
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-1" />
                        Seguir
                      </>
                    )}
                  </button>
                  <button 
                    className="inline-flex items-center px-4 py-1.5 rounded text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 transition-colors"
                    onClick={() => alert('Enviar mensagem')}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Mensagem
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-6 text-center">
              <div>
                <span className="text-xl font-semibold text-gray-900">{mockUser.followers}</span>
                <span className="block text-sm text-gray-500">Seguidores</span>
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-900">{mockUser.rating}</span>
                <span className="block text-sm text-gray-500">Avaliação</span>
              </div>
              <div>
                <span className="text-xl font-semibold text-gray-900">{mockUser.totalSales}</span>
                <span className="block text-sm text-gray-500">Vendas</span>
              </div>
            </div>
          </div>

          {/* Products */}
          {mockUser.type === 'vendedor' && (
            <div className="border-t border-gray-100 px-6 py-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Produtos à Venda</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mockUser.products.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-blue-600 font-semibold mt-1">{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}