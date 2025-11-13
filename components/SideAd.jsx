import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

function SideAd() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white"
    >
      <h3 className="text-xl font-bold mb-2">Oferta Especial!</h3>
      <p className="mb-4">Ganhe 10% de desconto em todos os produtos eletrônicos.</p>
      <button className="bg-white text-indigo-600 font-bold py-2 px-4 rounded-full hover:bg-indigo-100 transition duration-300 flex items-center">
        Ver Ofertas
        <FiArrowRight className="ml-2" />
      </button>
    </motion.div>
  );
}

export default SideAd;