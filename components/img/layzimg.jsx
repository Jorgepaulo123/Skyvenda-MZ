import { motion } from 'framer-motion';
import React from 'react';
const LayzImage = ({ product }) => {
  return (
    <motion.img
      src={`http://192.168.1.62:8000/produto/${product.capa}`}
      alt={product.nome}
      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
      loading="lazy" // Lazy loading para otimizar o carregamento
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'caminho/para/imagem/placeholder.jpg'; // Imagem fallback
      }}
    />
  );
};
export default LayzImage
