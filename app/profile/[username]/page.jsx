"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Grid, Heart, Eye, MessageCircle, Info, MoreHorizontal, User2, Megaphone } from 'lucide-react';
import api, { base_url } from '../../../api/api';

export default function PublicProfileUnderProfile() {
  const params = useParams();
  const username = typeof params?.username === 'string' ? params.username : Array.isArray(params?.username) ? params.username[0] : null;

  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [tabSelected, setTabSelected] = useState('products');

  useEffect(() => {
    if (!username) return;
    window.scrollTo(0, 0);
    api
      .get(`/usuario/perfil/${username}`)
      .then((res) => setUserProfile(res.data))
      .catch(() => setUserProfile(null))
      .finally(() => setLoading(false));

    api
      .get(`/usuario/${username}/produtos`)
      .then((res) => setProducts(Array.isArray(res?.data?.produtos) ? res.data.produtos : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [username]);

  if (!loading && !userProfile) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center min-h-[320px] flex-col gap-2">
          <div className="flex justify-center items-center p-5 bg-gray-200 rounded-full">
            <Info className="text-gray-900" />
          </div>
          <h1 className="text-2xl font-semibold">Perfil não está disponível</h1>
          <p>A ligação pode não estar a funcionar ou o perfil pode ter sido removido.</p>
          <Link href="/" className="py-3 px-4 bg-indigo-400 rounded-md hover:bg-indigo-600 text-white font-semibold">
            Ver mais na SkyVenda MZ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen md:p-10">
      <div className="container mx-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-gray-500">🔄 Carregando...</p>
          </div>
        ) : (
          <div className="container min-h-screen lg:px-[140px] pb-[100px]">
            <div className="w-full">
              <div className="flex gap-4 flex-1 ">
                <div className="flex flex-col md:w-[282px] md:h-[182px] items-center justify-center relative">
                  <div className="absolute -z-10 md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400" />
                  <img src={`${userProfile?.perfil}`} alt={`${userProfile?.username || 'Usuário'} avatar`} className="rounded-full border md:w-[150px] md:h-[150px]" />
                </div>
                <div className="w-full space-y-2 ">
                  <div className="flex py-1 md:h-[40px] gap-4 items-center flex-1 ">
                    <span className="text-2xl">{userProfile?.username}</span>
                    <button className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300">Seguir</button>
                    <button className="bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300">Envier Mensagem</button>
                    <button>
                      <MoreHorizontal />
                    </button>
                  </div>
                  <div className="flex py-2 md:h-[40px] gap-4 items-center flex-1 ">
                    <span>
                      <span className="font-bold">{userProfile?.total_produtos}</span> publicacoes
                    </span>
                    <span>
                      <span className="font-bold">{userProfile?.total_seguidores}</span> segudores
                    </span>
                    <span>
                      <span className="font-bold">{userProfile?.total_seguidores}</span> A seguir
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-2xl">{userProfile?.name}</p>
                    <p>{userProfile?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex h-[1px] bg-gray-300 mt-10 "></div>

              <div className="flex-1 gap-4">
                <div className="flex gap-8 justify-center items-center">
                  <button onClick={() => setTabSelected('products')} className={`uppercase transition-all duration-300 gap-2 py-3 flex text-gray-500 ${tabSelected === 'products' && 'font-bold text-gray-900 border-t-2  border-t-gray-900 '}`}>
                    <Grid />Produtos
                  </button>
                  <button onClick={() => setTabSelected('friends')} className={`uppercase transition-all duration-100 gap-2 py-3 flex text-gray-500 ${tabSelected === 'friends' && 'font-bold text-gray-900 border-t-2  border-t-gray-900'}`}>
                    <User2 />Amigos
                  </button>
                  <button onClick={() => setTabSelected('ads')} className={`uppercase transition-all duration-100  gap-2 py-3 flex text-gray-500 ${tabSelected === 'ads' && 'font-bold text-gray-900 border-t-2  border-t-gray-900'}`}>
                    <Megaphone />Anúncios
                  </button>
                </div>

                <div className="flex-1">
                  {tabSelected === 'products' && (
                    <div className="grid grid-cols-3 gap-4">
                      {loadingProducts ? (
                        <>
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                              <div className="aspect-square bg-gray-200"></div>
                              <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          {products?.length >= 1 ? (
                            <>
                              {products.map((product, i) => (
                                <div key={i} className="bg-white border flex items-center justify-center aspect-square rounded-md relative group overflow-hidden shadow-xm hover:shadow-lg transition-shadow">
                                  <img
                                    src={`${base_url}/produto/${product.thumb}`}
                                    alt={product?.titulo || 'Produto'}
                                    onError={(e) => (e.currentTarget.src = `${base_url}/default.png`)}
                                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex font-bold text-white gap-4 text-sm md:text-base">
                                      <div className="flex items-center gap-1">
                                        <Heart /> {product?.likes || 0}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Eye /> {product?.views || 0}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MessageCircle /> {product?.comments?.length || 0}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="text-gray-600">ainda nao tem produtos</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
