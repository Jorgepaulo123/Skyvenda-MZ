import React from 'react';
import NhonguistasCarousel from '../NhonguistasCarousel';
import LojasCarousel from '../LojasCarousel';
import PublicacoesCarousel from '../PublicacoesCarousel';
import PromocoesCarousel from '../PromocoesCarousel';

// Layout: duas colunas (md+) e 1 coluna no mobile.
// Linha 1: Esq Nhonguistas | Dir Lojas
// Linha 2: Esq Publicações | Dir Promoções
export default function HomeCarousels() {
  return (
    <div className="container mx-auto px-3 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <NhonguistasCarousel embedded />
        </div>
        <div>
          <LojasCarousel embedded />
        </div>
        <div>
          <PublicacoesCarousel embedded />
        </div>
        <div>
          <PromocoesCarousel embedded />
        </div>
      </div>
    </div>
  );
}
