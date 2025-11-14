"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Grid,
  Heart,
  Eye,
  MessageCircle,
  Info,
  Loader,
  Settings,
  User2,
  Megaphone,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import PostCard from "../../components/feed/items/PostCard";
import LoadingBar from "../loading";
import api, { base_url } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

type AuthUser = {
  username?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
};

type ProfileUser = {
  id: number;
  username: string;
  name?: string;
  email?: string;
  perfil?: string;
  conta_pro?: boolean;
  tipo?: string;
  revisao?: string;
  revisado?: string;
  total_produtos?: number;
  total_seguidores?: number;
  total_seguindo?: number;
};

type ProfileStats = {
  total_produtos: number;
  total_seguidores: number;
  total_seguindo: number;
};

type ProfileResponse = {
  context: "public" | "self" | "other";
  is_authenticated: boolean;
  is_me: boolean;
  can_edit: boolean;
  is_following: boolean;
  is_follower: boolean;
  user: ProfileUser;
  stats: ProfileStats;
  relation?: {
    is_following: boolean;
    is_follower: boolean;
  };
};

type Product = {
  id: number;
  thumb?: string;
  likes?: number;
  views?: number;
  comments?: any[];
};

type PostUser = {
  id?: number;
  name?: string;
  username?: string;
  avatar?: string | null;
};

type Post = {
  id: number;
  content: string;
  time: string;
  likes: number;
  liked: boolean;
  user: PostUser;
};

export default function ProfilePage() {
  const params = useParams();
  const routeUsername = (params?.username || "") as string;

  const { token, user } = useAuth() as AuthContextType;

  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [tabSelected, setTabSelected] = useState<
    "produtos" | "publicacoes" | "seguidores"
  >("produtos");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [postsHasMore, setPostsHasMore] = useState(true);

  const username = routeUsername || user?.username  || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    const headers = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;

    api
      .get<ProfileResponse>("/usuario/profile", {
        params: { username },
        ...(headers || {}),
      })
      .then((res) => {
        setProfileData(res.data);
      })
      .catch(() => {
        setProfileData(null);
      })
      .finally(() => setLoading(false));
  }, [username, token]);

  useEffect(() => {
    if (!username) return;
    setLoadingProducts(true);

    api
      .get(`/usuario/${username}/produtos`)
      .then((res) => {
        const list = Array.isArray(res?.data?.produtos)
          ? (res.data.produtos as Product[])
          : [];
        setProducts(list);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [username]);

  useEffect(() => {
    setPosts([]);
    setPostsPage(1);
    setPostsHasMore(true);
  }, [username]);

  const fetchUserPosts = async (reset = false) => {
    if (!profileData?.user?.username) return;
    if (loadingPosts) return;

    try {
      setLoadingPosts(true);
      const page = reset ? 1 : postsPage;
      const perPage = 20;

      const isMe = profileData.context === "self";

      const endpoint =
        isMe && token
          ? `/publicacoes/minhas?page=${page}&per_page=${perPage}`
          : `/publicacoes/listar?page=${page}&per_page=${perPage}`;

      const config =
        isMe && token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined;

      const resp = await api.get(endpoint, config);
      const list = Array.isArray(resp?.data?.publicacoes)
        ? resp.data.publicacoes
        : [];

      const filtered = list.filter((p: any) => {
        const author = p?.usuario || p?.publicador || {};
        const authorUsername = (author?.username || "").toLowerCase();
        const authorId = author?.id;
        const byUsername =
          authorUsername &&
          authorUsername ===
            profileData.user.username?.toLowerCase();
        const byId =
          typeof authorId === "number" &&
          typeof profileData.user.id === "number" &&
          authorId === profileData.user.id;
        return byUsername || byId;
      });

      const mapped: Post[] = filtered.map((p: any) => {
        const author = p?.usuario || p?.publicador || {};
        const likes = p.likes_count ?? p.total_likes ?? 0;
        const deu_like =
          (typeof p.liked === "boolean" ? p.liked : undefined) ??
          (typeof p.deu_like === "boolean" ? p.deu_like : undefined) ??
          false;
        const time = p.tempo || p.data_criacao || "";
        return {
          id: p.id,
          content: p.conteudo,
          time,
          likes: Number(likes || 0),
          liked: Boolean(deu_like),
          user: {
            id: author?.id,
            name: author?.nome || author?.username,
            username: author?.username,
            avatar: author?.foto_perfil || null,
          },
        };
      });

      setPosts((prev) => (reset ? mapped : [...prev, ...mapped]));

      const nextPage = page + 1;
      const totalPages = Number(resp?.data?.total_pages || 1);
      setPostsHasMore(nextPage <= totalPages);
      setPostsPage(nextPage);
    } catch (e) {
      setPostsHasMore(false);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (tabSelected === "publicacoes" && posts.length === 0 && !loadingPosts) {
      fetchUserPosts(true);
    }
  }, [tabSelected]);

  if (!loading && !profileData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center min-h-[320px] flex-col gap-2">
          <div className="flex justify-center items-center p-5 bg-gray-200 rounded-full">
            <Info className="text-gray-900" />
          </div>
          <h1 className="text-2xl font-semibold">Página não encontrada</h1>
          <p>O perfil que procuras não existe ou já não está disponível.</p>
          <Link
            href="/"
            className="py-3 px-4 bg-indigo-500 rounded-md hover:bg-indigo-600 text-white font-semibold"
          >
            Voltar para início
          </Link>
        </div>
      </div>
    );
  }

  const isMyProfile = profileData?.context === "self";
  const u = profileData?.user;
  const stats = profileData?.stats;

  const showTopLoading =
    loading || loadingProducts || loadingPosts;

  return (
    <>
      {showTopLoading && <LoadingBar />}
      <div className="w-full min-h-screen md:py-10">
      <div className="w-full">
        {loading || !profileData ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-gray-500">
              
            </p>
          </div>
        ) : (
          <div className="w-full min-h-screen pb-[100px]">
            <div className="w-full bg-white">
              <div className="flex items-center justify-between px-4 pt-4 sticky top-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-800" />
                </button>
                <span className="font-semibold text-lg">@{u?.username}</span> 
                </div>
                {isMyProfile ? (
                  <Link
                    href="/settings"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Settings className="w-5 h-5 text-gray-800" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-800" />
                  </button>
                )}
              </div>

              <div className="px-4 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400 p-[3px] flex items-center justify-center">
                    <img
                      src={u?.perfil || "/avatar.png"}
                      className="w-full h-full rounded-full object-cover bg-white cursor-pointer"
                      alt="Profile"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-gray-900">
                      {u?.name || u?.username}
                    </span>
                    {stats && (
                      <div className="flex items-center gap-6 text-xs mt-1">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">
                            {stats.total_produtos}
                          </span>
                          <span className="text-gray-500">Produtos</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">
                            {stats.total_seguidores}
                          </span>
                          <span className="text-gray-500">Seguidores</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-gray-900">
                            {stats.total_seguindo}
                          </span>
                          <span className="text-gray-500">A seguir</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 w-full flex flex-col items-center gap-2">
                  <div className="mt-1 w-full flex items-center justify-center gap-3">
                    {isMyProfile ? (
                      <Link
                        href="/settings"
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600"
                      >
                        <Settings className="w-4 h-4" />
                        Editar perfil
                      </Link>
                    ) : (
                      <>
                        <button
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600"
                        >
                          <User2 className="w-4 h-4" />
                          {profileData?.is_following ? "A seguir" : "Seguir"}
                        </button>
                        <Link
                          href={`/chat/${u?.username}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-gray-300 text-xs font-medium text-gray-800 hover:bg-gray-100"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Mensagem
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="w-full mt-2">
                    <Tabs
                      tabSelected={tabSelected}
                      setTabSelected={setTabSelected}
                    />
                  </div>

                  <TabContent
                    tabSelected={tabSelected}
                    products={products}
                    loadingProducts={loadingProducts}
                    posts={posts}
                    loadingPosts={loadingPosts}
                    postsHasMore={postsHasMore}
                    fetchUserPosts={fetchUserPosts}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

type TabsProps = {
  tabSelected: "produtos" | "publicacoes" | "seguidores";
  setTabSelected: (t: "produtos" | "publicacoes" | "seguidores") => void;
};

function Tabs({ tabSelected, setTabSelected }: TabsProps) {
  return (
    <div className="flex gap-8 justify-center items-center text-sm mt-2">
      <button
        onClick={() => setTabSelected("produtos")}
        className={`uppercase tracking-wide transition-all duration-300 gap-2 py-3 flex items-center text-gray-500 ${
          tabSelected === "produtos" &&
          "font-bold text-indigo-500 border-b-2 border-b-indigo-500"
        }`}
      >
        <Grid className="w-4 h-4" />
        Produtos
      </button>
      <button
        onClick={() => setTabSelected("publicacoes")}
        className={`uppercase tracking-wide transition-all duration-100 gap-2 py-3 flex items-center text-gray-500 ${
          tabSelected === "publicacoes" &&
          "font-bold text-indigo-500 border-b-2 border-b-indigo-500"
        }`}
      >
        Publicações
      </button>
      <button
        onClick={() => setTabSelected("seguidores")}
        className={`uppercase tracking-wide transition-all duration-100  gap-2 py-3 flex items-center text-gray-500 ${
          tabSelected === "seguidores" &&
          "font-bold text-indigo-500 border-b-2 border-b-indigo-500"
        }`}
      >
        Seguidores
      </button>
    </div>
  );
}

type TabContentProps = {
  tabSelected: "produtos" | "publicacoes" | "seguidores";
  products: Product[];
  loadingProducts: boolean;
  posts: Post[];
  loadingPosts: boolean;
  postsHasMore: boolean;
  fetchUserPosts: (reset?: boolean) => Promise<void> | void;
};

function TabContent({
  tabSelected,
  products,
  loadingProducts,
  posts,
  loadingPosts,
  postsHasMore,
  fetchUserPosts,
}: TabContentProps) {
  return (
    <div className="flex-1">
      {tabSelected === "produtos" && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2">
          {loadingProducts ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {products?.length >= 1 ? (
                <>
                  {products.map((product, i) => (
                    <div
                      key={product.id ?? i}
                      className="bg-white border flex items-center justify-center aspect-square rounded-md relative group overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={`${base_url}${product.thumb}`}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = `${base_url}/default.png`)
                        }
                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                        alt="Produto"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex font-bold text-white gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {product?.likes || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {product?.views || 0}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {product?.comments?.length || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center text-gray-500 text-sm col-span-3 py-4">
                  ainda nao tem produtos
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tabSelected === "publicacoes" && (
        <div className="mt-4">
          {loadingPosts && posts.length === 0 ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-500">
              <Loader className="w-4 h-4 animate-spin" />
              <span>Carregando publicações…</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-sm gap-2">
              <span>Sem publicações.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <PostCard
                  key={p.id}
                  data={{
                    id: p.id,
                    content: p.content,
                    time: p.time,
                    likes: p.likes,
                    comments: 0,
                    gradient_style:
                      "bg-gradient-to-br from-purple-500 to-purple-600",
                    user: {
                      id: p.user?.id,
                      name: p.user?.name || p.user?.username || "Usuário",
                      username: p.user?.username,
                      avatar: p.user?.avatar || null,
                    },
                  }}
                />
              ))}

              {postsHasMore && !loadingPosts && (
                <button
                  onClick={() => fetchUserPosts(false)}
                  className="mt-2 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-md text-sm text-gray-700"
                >
                  Carregar mais
                </button>
              )}
              {loadingPosts && posts.length > 0 && (
                <div className="flex items-center justify-center py-4">
                  <Loader className="w-4 h-4 animate-spin text-indigo-500" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tabSelected === "seguidores" && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-sm gap-2">
          <span>Seguidores em breve</span>
        </div>
      )}
    </div>
  );
}

