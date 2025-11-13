import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api/api';
import { base_url } from '../api/api';
import ContentLoader from 'react-content-loader';

export default function NhonguistasCarousel({ embedded=false }) {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const router = useRouter();

  const resolveImageUrl = (path) => {
    if (!path) return '/avatar.png';
    if (/^https?:\/\//i.test(path)) return path;
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base_url}${p}`;
  };

  useEffect(() => {
    let mounted = true;
    async function fetchVendedores() {
      try {
        const res = await api.get('/usuario/usuarios/lojas', { params:{ skip:0, limit:10 } });
        const data = res?.data;
        let lista = [];
        if (Array.isArray(data)) lista = data;
        else if (Array.isArray(data?.usuarios)) lista = data.usuarios;
        else if (Array.isArray(data?.data?.usuarios)) lista = data.data.usuarios;
        if (mounted) setVendedores(lista);
      } catch (e) {
        console.error('Erro ao carregar nhonguistas', e);
        if (mounted) setVendedores([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchVendedores();
    return () => { mounted = false };
  }, []);

  if (!vendedores.length && !loading) return null;

  const Skeleton = () => (
    <div className="overflow-x-auto no-scrollbar pr-2">
      <div className="flex flex-nowrap snap-x snap-mandatory">
        {[0,1,2,3,4].map(k => (
          <div key={k} className="mr-3 shrink-0 w-[90px] snap-start">
            <ContentLoader speed={1.6} width={90} height={110} viewBox="0 0 90 110" backgroundColor="#f0f0f0" foregroundColor="#dedede">
              <circle cx="45" cy="40" r="38" />
              <rect x="10" y="85" rx="4" ry="4" width="70" height="12" />
            </ContentLoader>
          </div>
        ))}
      </div>
    </div>
  );

  const List = () => (
    <div className="overflow-x-auto no-scrollbar pr-2">
      <div ref={containerRef} className="flex flex-nowrap snap-x snap-mandatory">
        {vendedores.map((v, idx) => {
          const key = String(v.id ?? v.username ?? v.identificador_unico ?? idx);
          const nome = v.nome || v.name || v.username || v.identificador_unico || '—';
          const profileUsername = v.username || v.identificador_unico || (v.id != null ? String(v.id) : '');
          return (
            <div
              key={key}
              className="mr-3 text-center shrink-0 w-[90px] snap-start"
              onClick={() => profileUsername && router.push(`/${profileUsername}`)}
            >
              <img
                src={resolveImageUrl(v.foto_perfil || v.avatar || v.foto)}
                alt={nome}
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 mx-auto"
                onError={e => (e.target.src = '/avatar.png')}
              />
              <p className="text-[12px] text-neutral-800 font-medium truncate mt-1 max-w-[90px]">{nome}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`${embedded ? '' : ''} m-3`}>
      <div className="text-indigo-600 font-bold mb-3">nhonguistas</div>
      {loading ? <Skeleton /> : <List />}
    </div>
  );
}
