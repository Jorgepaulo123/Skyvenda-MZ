export const dynamic = 'force-dynamic';

import { base_url } from '@/api/api';

export async function generateMetadata({ params }) {
  try {
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
    if (!slug) return {};

    const res = await fetch(`${base_url}/produtos/detalhe/${slug}`, {
      // Keep it fast and cacheable for a short time
      next: { revalidate: 60 },
      headers: { accept: 'application/json' },
    });

    if (!res.ok) return {};
    const p = await res.json();

    const title = p?.title || p?.nome || 'Produto';
    const description = (p?.details || p?.descricao || '').toString().slice(0, 160) || `${title} na SkyVenda`;
    const image = p?.thumb || p?.capa || p?.image || '/default.png';
    const imageUrl = String(image).startsWith('http') ? image : `${base_url}/${String(image).replace(/^\//, '')}`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skyvenda-mz.vercel.app'}/product/${slug}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: 'SkyVenda MZ',
        images: [{ url: imageUrl }],
        type: 'product',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: { canonical: url },
    };
  } catch (_) {
    return {};
  }
}

export default function ProductLayout({ children }) {
  return children;
}
