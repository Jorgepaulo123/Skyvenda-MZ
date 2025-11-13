import React, { useState, useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt';

dayjs.extend(relativeTime);
dayjs.locale('pt');
import { Heart, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';

/**
 * Simples cartão de publicação para o feed misto.
 * Mostra apenas o conteúdo de texto com o gradiente recebido da API.
 */
function PublicationCard({ pub }) {
  if (!pub) return null;

  const usr = pub.publicador || pub.usuario || {};
  const avatarRaw = usr?.foto_perfil || usr?.avatar || usr?.foto || usr?.avatar_url || '';
  let avatarSrc = '/avatar.png';
  if (typeof avatarRaw === 'string' && avatarRaw.length > 0) {
    if (avatarRaw.startsWith('http') || avatarRaw.startsWith('/')) avatarSrc = avatarRaw;
  }

  const { user, token, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(Boolean(pub?.deu_like));
  const [likesCount, setLikesCount] = useState(Number(pub?.total_likes ?? pub?.likes_count ?? 0));
  if (!pub) return null;

  const gradient = pub.gradient_style || 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';

  return (
    <div className={`relative rounded-xl shadow-lg overflow-hidden min-w-[240px] h-[160px] ${gradient}`}>      
      {/* overlay */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative h-full w-full flex flex-col justify-between p-4 text-white">
        {/* header */}
        {usr && (
          <Link href={`/${usr.username || usr.id}`} className="flex items-center gap-2 mb-2">
            <img src={avatarSrc} onError={e=>e.target.src='/avatar.png'} alt={usr.nome}
                 className="w-8 h-8 rounded-full border-2 border-white"/>
            <span className="text-sm font-semibold drop-shadow-md">{usr.nome}</span>
            {(() => {
              const d = pub.created_at || pub.createdAt || pub.data_publicacao || pub.data || pub.created || null;
              return d ? (
                <span className="text-xs text-gray-200">• {dayjs(d).fromNow()}</span>
              ) : null;
            })()}
          </Link>
        )}
        {/* conteúdo */}
        <p className="flex-1 font-semibold text-lg leading-snug line-clamp-3 drop-shadow-md flex items-center">
          {pub.conteudo}
        </p>
        
        {/* ações */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={(e)=>{
              e.stopPropagation();
              if(!isAuthenticated){router.push('/login');return;}
              setIsLiked(v=>!v);
              setLikesCount(c=>isLiked?c-1:c+1);
              api.post(`/publicacoes/${pub.id}/like`,{}, { headers:{Authorization:`Bearer ${token}`}}).catch(()=>{});
            }}
            className="flex items-center gap-1 text-white hover:text-red-300">
            <Heart className={`w-5 h-5 ${isLiked?'fill-red-500 text-red-500':''}`} />
            <span className="text-sm">{likesCount}</span>
          </button>
          <button onClick={()=>router.push(`/publicacoes/${pub.id}`)} className="text-white hover:text-indigo-300">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button onClick={()=>router.push(`/chat/${pub.usuario.username}`)} className="text-white hover:text-indigo-300">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicationCard;
