"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { base_url } from "../../api/api";

type PostItem = {
  id: number;
  conteudo: string;
  gradient_style?: string;
  time?: string;
  likes?: number;
  liked?: boolean;
  user?: { id?: number; name?: string; username?: string; avatar?: string | null };
};

export default function PostsPage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const myUsername = useMemo(() => {
    const u: any = user as any;
    const uname = u && typeof u === 'object' ? u.username : undefined;
    return (uname ? String(uname) : "").toLowerCase();
  }, [user]);

  const fetchMyPosts = useCallback(async (reset = false) => {
    if (!token || loading) return;
    try {
      setLoading(true);
      const current = reset ? 1 : page;
      const perPage = 20;
      const res = await fetch(`${base_url}/publicacoes/minhas?page=${current}&per_page=${perPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const list = Array.isArray(data?.publicacoes) ? data.publicacoes : [];
      const mapped: PostItem[] = list.map((p: any) => {
        const author = p?.usuario || {};
        return {
          id: p.id,
          conteudo: p.conteudo,
          gradient_style: p.gradient_style || "default",
          time: p.tempo || p.data_criacao || "",
          likes: Number(p.likes_count || p.likes || 0),
          liked: Boolean(p.liked ?? p.deu_like ?? false),
          user: {
            id: author?.id,
            name: author?.nome || author?.username,
            username: author?.username,
            avatar: author?.foto_perfil || null,
          },
        };
      });
      setPosts(prev => (reset ? mapped : [...prev, ...mapped]));
      const totalPages = Number(data?.total_pages || 1);
      const next = current + 1;
      setHasMore(next <= totalPages);
      setPage(next);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [token, loading, page]);

  useEffect(() => {
    if (!token) return;
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchMyPosts(true);
  }, [token, myUsername]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-gray-700 hover:text-gray-900">Voltar</Link>
          <div className="font-semibold text-gray-900">Minhas Publicações</div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {posts.length === 0 && loading && (
          <div className="py-10 text-center text-gray-500">Carregando publicações…</div>
        )}
        {posts.length === 0 && !loading && (
          <div className="py-10 text-center text-gray-500">Você ainda não publicou.</div>
        )}
        {posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((p) => (
              <article key={`post-${p.id}`} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <img src={p.user?.avatar || "/avatar.png"} alt="avatar" className="w-9 h-9 rounded-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/avatar.png"; }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{p.user?.name || p.user?.username || "Usuário"}</div>
                    {!!p.time && <div className="text-xs text-gray-500">{p.time}</div>}
                  </div>
                </div>
                {/* gradient content stub */}
                <div className="min-h-[180px] flex items-center justify-center px-6 py-8 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500">
                  <p className="text-white text-center text-[16px] font-medium leading-6">{p.conteudo}</p>
                </div>
                <div className="flex items-center gap-4 px-4 py-2 text-sm text-gray-600">
                  <div>❤ {p.likes || 0}</div>
                  <div className="ml-auto">
                    {/* Placeholder link for detail if needed in future */}
                    <span className="text-indigo-600">Post #{p.id}</span>
                  </div>
                </div>
              </article>
            ))}
            {hasMore && !loading && (
              <button onClick={() => fetchMyPosts(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md">Carregar mais</button>
            )}
            {loading && posts.length > 0 && (
              <div className="py-3 text-center text-gray-500">Carregando…</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
