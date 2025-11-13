"use client";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { base_url } from "@/api/api";

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
};

export default function PostPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [post, setPost] = React.useState<PostDetail | null>(null);

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
        const res = await fetch(`${base_url}/publicacoes/${id}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        if (!cancelled) setPost(data);
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
  }, [id]);

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
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-white/90 backdrop-blur border-b border-gray-200">
          <button onClick={() => router.back()} className="p-2 text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-800">Publicação</h1>
          <div className="w-6" />
        </div>

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

            {/* Ações simples */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div className="flex items-center space-x-6 text-gray-700">
                <span className="text-sm">❤ {post.likes || 0}</span>
              </div>
              <Link href={`/posts`} className="text-sm text-indigo-600">Ver mais posts</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
