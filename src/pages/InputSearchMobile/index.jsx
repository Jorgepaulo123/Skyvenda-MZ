import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/api'
import { Search, TrendingUp, Clock, Tag } from 'lucide-react'

export default function InputSearchMobile() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [loadingPopular, setLoadingPopular] = useState(true)
  const [suggestedSearches, setSuggestedSearches] = useState([
    'Celulares', 'Laptops', 'Carros', 'Casas', 'Roupas', 'Móveis', 'Eletrodomésticos'
  ])

  useEffect(() => {
    // Redireciona para home se a largura da tela for maior que 768px (tablet/desktop)
    if (window.innerWidth > 768) {
      navigate('/')
    }
    
    // Carregar histórico de pesquisa do localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    setSearchHistory(history.slice(0, 5)) // Limitar a 5 itens
    
    // Carregar produtos populares
    fetchPopularProducts()
  }, [navigate])
  
  const fetchPopularProducts = async () => {
    try {
      setLoadingPopular(true)
      const response = await api.get('/produtos/populares?limit=4')
      setPopularProducts(response.data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos populares:', error)
    } finally {
      setLoadingPopular(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Salvar pesquisa no histórico
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      const newHistory = [searchQuery.trim(), ...history.filter(item => item !== searchQuery.trim())].slice(0, 10)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-white to-red-50 overflow-y-auto">
      {/* Header com barra de pesquisa */}
      <div className="sticky top-0 left-0 right-0 z-10 p-4 bg-gradient-to-r from-pink-50 to-red-50 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="p-2 text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar produtos..."
              className="w-full px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm focus:outline-none focus:bg-white/90 transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              className="p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Conteúdo principal */}
      <div className="p-4 pt-6 pb-20">
        {/* Sugestões de pesquisa */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search size={18} className="text-indigo-500" />
            <h2 className="text-lg font-semibold">Sugestões de pesquisa</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(term)
                  handleSearch({ preventDefault: () => {} })
                }}
                className="px-3 py-2 bg-white rounded-full text-sm border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Histórico de pesquisa */}
        {searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-500" />
                <h2 className="text-lg font-semibold">Pesquisas recentes</h2>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('searchHistory')
                  setSearchHistory([])
                }}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Limpar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(term)
                    handleSearch({ preventDefault: () => {} })
                  }}
                  className="px-3 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  <Clock size={14} />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Produtos populares */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-amber-500" />
            <h2 className="text-lg font-semibold">Produtos populares</h2>
          </div>
          
          {loadingPopular ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm animate-pulse flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : popularProducts.length > 0 ? (
            <div className="space-y-3">
              {popularProducts.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/produto/${product.slug}`}
                  className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <img 
                    src={`https://skyvenda-mz.up.railway.app/produto/${product.capa}`} 
                    alt={product.titulo || 'Produto'} 
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/avatar.png';
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-800 line-clamp-1">{product.titulo || 'Produto sem título'}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{product.descricao_curta || 'Sem descrição'}</p>
                    <p className="text-amber-600 font-bold mt-1">{product.preco} MZN</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Nenhum produto popular disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
