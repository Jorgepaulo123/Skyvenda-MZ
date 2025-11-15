"use client";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { base_url } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import MobileHeader from "@/components/ui/MobileHeader";

type PostUser = {
  id: number;
  nome?: string;
  username?: string;
  foto_perfil?: string | null;
};

type PostDetail = {
  id: number;
  conteudo: string;
  gradient_style?: string;
  data_criacao?: string;
  likes?: number;
  deu_like?: boolean;
  usuario: PostUser;
  comentarios?: Array<{ id: number; conteudo: string; data_criacao?: string; usuario: PostUser }>;
};

export default function PostPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const { token, isAuthenticated, user } = useAuth() as any;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [post, setPost] = React.useState<PostDetail | null>(null);
  const [likeBusy, setLikeBusy] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [isCommenting, setIsCommenting] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!id) {
        setError("Posto inválido");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${base_url}/publicacoes/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        } as RequestInit);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          const normalized: PostDetail = {
            id: data?.id,
            conteudo: data?.conteudo ?? data?.content,
            gradient_style: data?.gradient_style,
            data_criacao: data?.data_criacao,
            usuario: data?.usuario,
            deu_like: data?.deu_like ?? data?.liked ?? false,
            likes: data?.likes ?? data?.likes_count ?? 0,
            comentarios: Array.isArray(data?.comentarios) ? data.comentarios : [],
          };
          setPost(normalized);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.userMessage || e?.message || "Erro ao carregar publicação");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const gradientClass = React.useMemo(() => {
    const s = post?.gradient_style || "bg-gradient-to-br from-gray-500 to-gray-600";
    if (typeof s === "string" && s.includes("bg-gradient")) return s;
    const map: Record<string, string> = {
      purple: "bg-gradient-to-br from-purple-500 to-purple-600",
      blue: "bg-gradient-to-br from-blue-500 to-blue-800",
      green: "bg-gradient-to-br from-green-500 to-green-600",
      pink: "bg-gradient-to-br from-pink-500 to-pink-700",
      orange: "bg-gradient-to-br from-yellow-500 to-orange-600",
      red: "bg-gradient-to-br from-red-500 to-red-600",
      default: "bg-gradient-to-br from-gray-500 to-gray-600",
    };
    return map[s as keyof typeof map] || map.default;
  }, [post?.gradient_style]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <MobileHeader title="Publicação" onBack={() => router.back()} right={null} />

        {/* Body */}
        {loading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="-mx-4 md:mx-0 min-h-[250px] max-h-[320px] bg-gray-200 rounded-none" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => router.refresh()} className="px-4 py-2 bg-indigo-500 text-white rounded-lg">Tentar novamente</button>
          </div>
        ) : !post ? (
          <div className="p-6 text-center text-gray-500">Publicação não encontrada</div>
        ) : (
          <div>
            {/* Autor */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-3 flex-1">
                <img
                  src={post.usuario?.foto_perfil || "/avatar.png"}
                  alt={post.usuario?.nome || "Autor"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 text-sm">{post.usuario?.nome || post.usuario?.username || "Autor"}</span>
                    {post.usuario?.username && (
                      <span className="text-xs text-gray-500">@{post.usuario.username}</span>
                    )}
                  </div>
                  {post.data_criacao && (
                    <p className="text-xs text-gray-500">{post.data_criacao}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className={`mx-0 mb-4 p-6 rounded-none ${gradientClass} min-h-[250px] max-h-[320px] flex items-center justify-center`}>
              <p className="text-white text-center text-base leading-relaxed font-medium">{post.conteudo}</p>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={async () => {
                    if (!post || likeBusy) return;
                    if (!isAuthenticated || !token) {
                      // redirect to login page
                      router.push("/login");
                      return;
                    }
                    try {
                      setLikeBusy(true);
                      // optimistic update
                      const optimistic = {
                        ...post,
                        deu_like: !post.deu_like,
                        likes: (post.likes || 0) + (post.deu_like ? -1 : 1),
                      } as PostDetail;
                      setPost(optimistic);
                      await fetch(`${base_url}/publicacoes/${post.id}/like`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      });
                    } catch {
                      // rollback
                      setPost(p => (p ? { ...p, deu_like: !p.deu_like, likes: (p.likes || 0) + (p.deu_like ? -1 : 1) } : p));
                    } finally {
                      setLikeBusy(false);
                    }
                  }}
                  className={`p-2 rounded-full ${post.deu_like ? "text-red-500" : "text-gray-700"}`}
                  aria-label="Curtir"
                >
                  {/* heart icon */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill={post.deu_like ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                  </svg>
                </button>
                <span className="text-sm text-gray-700">{post.likes || 0}</span>
              </div>
              <Link href={`/posts`} className="text-sm text-indigo-600">Ver mais posts</Link>
            </div>

            {/* Comentários */}
            <div className="px-4 py-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                <span>{post.comentarios?.length || 0}</span> Comentários
              </div>
              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {(post.comentarios || []).map((c) => (
                  <div key={String(c.id)} className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-violet-200">
                      <img src={c.usuario?.foto_perfil || "/avatar.png"} className="w-full h-full object-cover" alt="avatar" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/avatar.png"; }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-violet-700 font-semibold text-sm">{c.usuario?.nome || c.usuario?.username || "Usuário"}</span>
                        {c.data_criacao && <span className="text-xs text-gray-500">{c.data_criacao}</span>}
                      </div>
                      <div className="text-gray-700 text-sm">{c.conteudo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barra de comentário */}
            <div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-2 flex items-center gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Comentar como ${user?.username || "usuário"}`}
                className="flex-1 h-10 rounded-md border border-gray-300 px-3 text-sm"
              />
              <button
                onClick={async () => {
                  if (!post) return;
                  if (!isAuthenticated || !token) {
                    router.push("/login");
                    return;
                  }
                  const text = comment.trim();
                  if (!text) return;
                  try {
                    setIsCommenting(true);
                    // optimistic
                    const optimistic = {
                      id: Math.floor(Math.random() * 1e9),
                      conteudo: text,
                      data_criacao: "agora mesmo",
                      usuario: { id: 0, nome: "Você", username: user?.username },
                    };
                    setPost(p => (p ? { ...p, comentarios: [ ...(p.comentarios || []), optimistic as any ] } : p));
                    await fetch(`${base_url}/publicacoes/${post.id}/comentarios`, {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body: new URLSearchParams({ conteudo: text }).toString(),
                    });
                    setComment("");
                  } catch (e) {
                    // ignore for now
                  } finally {
                    setIsCommenting(false);
                  }
                }}
                disabled={isCommenting || !comment.trim()}
                className={`px-4 h-10 rounded-md text-white ${isCommenting || !comment.trim() ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
              >
                {isCommenting ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
