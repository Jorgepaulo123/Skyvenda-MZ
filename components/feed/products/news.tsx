import { base_url } from '../../../api/api'
import { resolveImageUrl } from '@/components/lib/resolveImageUrl'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import ContentLoader from 'react-content-loader'

type Product = {
  id: number
  nome: string
  capa: string
  price?: number
  preco?: number
  slug?: string
}

type Props = { loading?: boolean }

function formatMZN(value?: number) {
  if (typeof value !== 'number') return '0,00 MZN';
  try { return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(value); } catch { return `${value} MZN`; }
}

export default function News({ loading = false }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(`${base_url}/produtos/destaques/?limit=10`)
      const data = await res.json()
      const shuffledProducts = shuffleArray(data.produtos)
      setProducts(shuffledProducts)
    } catch (error) {
      console.error('Erro ao buscar produtos destacados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="m-3">
      <div className="text-violet-500 font-bold mb-2">Novidades</div>
      <div className="overflow-x-auto no-scrollbar pr-2">
        <div className="flex flex-nowrap">
          {(isLoading || loading) ? (
            [0,1,2,3].map((k) => (
              <div key={k} className="rounded-md mr-1" style={{ width: 110 }}>
                <ContentLoader
                  speed={1.6}
                  width={110}
                  height={175}
                  viewBox="0 0 110 175"
                  backgroundColor="#f0f0f0"
                  foregroundColor="#dedede"
                >
                  <rect x="0" y="0" rx="10" ry="10" width="110" height="130" />
                  <rect x="8" y="140" rx="4" ry="4" width="90" height="12" />
                </ContentLoader>
              </div>
            ))
          ) : (
            products.map((product) => {
              const displayPrice = product.price ?? product.preco
              const priceText = typeof displayPrice === 'number' ? formatMZN(displayPrice) : null
              return (
                <div key={product.id} className="mr-1" style={{ width: 110 }}>
                  {product.slug ? (
                    <Link href={`/product/${product.slug}`} className="block group">
                      <div className="w-[110px] h-[130px] rounded-xl overflow-hidden relative border border-gray-200 bg-white news-card">
                        {product.capa ? (
                          <img src={resolveImageUrl(product.capa)} alt={product.nome} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                        <div className="shine" />
                        {/* NOVO ribbon */}
                        <div className="absolute top-[25px] left-[-15px] origin-top-left -rotate-45 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-white px-4 py-[3px] rounded-sm text-[11px] font-semibold leading-none pointer-events-none z-10 flex items-center justify-center text-center shadow-sm shadow-yellow-500/40">
                          novo
                        </div>
                        {/* Price: dark transparent overlay + gradient text */}
                        {priceText && (
                          <>
                            <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 h-9 flex items-center justify-center pointer-events-none">
                              <span className="bg-gradient-to-r from-amber-200 to-orange-500 bg-clip-text text-transparent text-[13px] font-extrabold leading-none" style={{ textShadow: '0 0 8px rgba(255, 200, 0, 0.6)' }}>
                                {priceText}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-[12px] font-medium mt-1 text-gray-900 line-clamp-2 w-[110px]">
                        {product.nome}
                      </div>
                    </Link>
                  ) : (
                    <div className="block">
                      <div className="w-[110px] h-[130px] rounded-xl overflow-hidden relative border border-gray-200 bg-white">
                        {product.capa ? (
                          <img src={resolveImageUrl(product.capa)} alt={product.nome} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                        <div className="absolute top-[16px] left-[-15px] origin-top-left -rotate-45 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-white w-[70px] py-[3px] rounded-sm text-[11px] font-semibold leading-none pointer-events-none z-10 flex items-center justify-center text-center shadow-sm shadow-yellow-500/40">
                          NOVO
                        </div>
                        {priceText && (
                          <>
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center rounded-b-xl">
                              <span className="text-white text-[12px] font-extrabold leading-none">{priceText}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="text-[12px] font-medium mt-1 text-gray-900 line-clamp-2 w-[110px]">
                        {product.nome}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      <style jsx>{`
      @keyframes shimmer {
        0% { transform: translateX(-150%) skewX(-20deg); }
        50% { transform: translateX(0%) skewX(-20deg); }
        100% { transform: translateX(150%) skewX(-20deg); }
      }
      @keyframes glow {
        0% { box-shadow: 0 0 0px rgba(99, 102, 241, 0.0); }
        100% { box-shadow: 0 0 10px rgba(99, 102, 241, 0.35); }
      }
      .news-card :global(.shine) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);
        transform: translateX(-150%) skewX(-20deg);
        animation: shimmer 2.6s infinite;
      }
      .glow {
        animation: glow 1.8s ease-in-out infinite alternate;
      }
      `}</style>
    </div>
  )
}