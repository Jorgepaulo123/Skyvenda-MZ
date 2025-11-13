"use client";
import React, { useEffect } from 'react';
import Header from '../components/header';

export default function MainLayout({ children }) {
  // Ajusta a altura do layout para viewport móvel
  useEffect(() => {
    const setVH = () => {
      // Obtém a altura real do viewport
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Define inicialmente
    setVH();

    // Atualiza quando a janela é redimensionada ou quando o usuário rola no mobile
    window.addEventListener('resize', setVH);
    window.addEventListener('scroll', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('scroll', setVH);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Headers fixos */}
      <Header />
      {/* Spacer to offset fixed header height on both mobile and desktop */}
      <div className="md:h-[76px]" />

      {/* Área de conteúdo com scroll - sem padding para colar ao header */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 