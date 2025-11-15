"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PostDetailPage() {
  const router = useRouter();
  const search = useSearchParams();
  const id = search.get("id");

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Voltar"
          >
            <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="font-semibold text-gray-900">Publicação</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {!id ? (
          <div className="text-center text-gray-500 py-20">Nenhuma publicação informada.</div>
        ) : (
          <div className="space-y-4">
            {/* Placeholder básico enquanto a API de detalhe é integrada */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className={`p-6 min-h-[220px] bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center`}>
                <p className="text-white text-center text-base leading-relaxed font-medium">
                  Publicação #{id}
                </p>
              </div>
              <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100">
                Detalhe da publicação ainda não está disponível. Em breve.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
