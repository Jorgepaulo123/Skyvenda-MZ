"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { base_url } from "../../api/api";

interface NewPostDialogProps {
  open: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const gradients = [
  "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600",
  "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
  "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
  "bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500",
  "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500",
];

export default function NewPostDialog({ open, onClose, onPostCreated }: NewPostDialogProps) {
  const { isAuthenticated, token, user } = useAuth();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState<string>(gradients[0]);

  const avatar = useMemo(() => (user as any)?.perfil || (user as any)?.avatar || "/avatar.png", [user]);

  const submit = useCallback(async () => {
    if (!isAuthenticated || !token) {
      onClose();
      return;
    }
    const content = text.trim();
    if (!content) return;
    if (content.split(" ").length > 10) return; // simples validação como no nativo
    try {
      setBusy(true);
      const params = new URLSearchParams();
      params.append("conteudo", content);
      params.append("gradient_style", selectedGradient);
      const resp = await fetch(`${base_url}/publicacoes/form`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      if (!resp.ok) throw new Error("Falha ao publicar");
      setText("");
      setSelectedGradient(gradients[0]);
      onClose();
      onPostCreated && onPostCreated();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [isAuthenticated, token, text, onClose, onPostCreated, selectedGradient]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={() => !busy && onClose()} />
      {/* Panel */}
      <div className="absolute inset-x-0 top-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[560px] md:h-[620px] bg-white rounded-none md:rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-full"
            aria-label="Voltar"
            onClick={!busy ? onClose : undefined}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="font-semibold text-gray-900">Criar publicação</div>
          <button
            className={`px-3 py-1.5 rounded-2xl text-white ${busy || !text.trim() ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"}`}
            disabled={busy || !text.trim()}
            onClick={submit}
          >{busy ? "Publicando..." : "Publicar"}</button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-3 mb-4">
            <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/avatar.png"; }} />
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-gray-900">{(user as any)?.name || (user as any)?.username || "Usuário"}</span>
              <span className="text-xs text-gray-500">Público</span>
            </div>
          </div>
          {/* Preview input styled like PostCard */}
          <div className={`relative -mx-4 md:mx-0 mb-3 p-6 rounded-none ${selectedGradient} min-h-[250px] max-h-[320px] flex items-center justify-center`}>
            {!text.trim() && (
              <span className="pointer-events-none select-none absolute left-6 right-6 top-1/2 -translate-y-1/2 text-center text-white/70 text-[18px] font-semibold leading-7">
                Escreva sua publicação...
              </span>
            )}
            <div
              role="textbox"
              aria-label="Conteúdo da publicação"
              contentEditable
              suppressContentEditableWarning
              className="w-full bg-transparent outline-none text-white text-[18px] font-semibold leading-7 text-center whitespace-pre-wrap break-words"
              onInput={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                let val = el.innerText || "";
                if (val.length > 100) {
                  val = val.slice(0, 100);
                  el.innerText = val;
                  const sel = window.getSelection?.();
                  if (sel) sel.collapse(el, el.childNodes.length);
                }
                setText(val);
              }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{text.length}/100</div>
          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-800 mb-2">Escolher gradiente</div>
            <div className="grid grid-cols-5 gap-2">
              {gradients.map((g) => (
                <button
                  key={g}
                  type="button"
                  disabled={busy}
                  onClick={() => setSelectedGradient(g)}
                  className={`h-10 rounded-md border transition-all ${selectedGradient === g ? 'ring-2 ring-indigo-500 border-indigo-400' : 'border-transparent hover:ring-1 hover:ring-gray-300'}`}
                >
                  <div className={`w-full h-full rounded-md ${g}`} />
                </button>
              ))}
            </div>
          </div>
          {/* Ações rápidas */}
          <div className="mt-4 border-t pt-3">
            <div className="text-sm font-semibold text-gray-800 mb-2">Adicionar à sua publicação</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 text-sm">Foto</button>
              <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 text-sm">Vídeo</button>
              <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 text-sm">Localização</button>
              <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-700 text-sm">Sentimento</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
