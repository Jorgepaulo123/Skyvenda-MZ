import React from 'react';
import { motion } from 'framer-motion';

const ads = [
  {
    id: 1,
    title: 'Oferta Especial',
    description: 'Até 50% de desconto em eletrônicos',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    width: '100px',
  },
  {
    id: 2,
    title: 'Novos Lançamentos',
    description: 'Confira os últimos smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    width: '200px',
  },
  {
    id: 3,
    title: 'Frete Grátis',
    description: 'Em compras acima de 5000 MZN',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    width: '100px',
  },
];

function AdRow() {
  return (
    <div className="flex justify-between items-center space-x-4 overflow-x-auto px-4">
      {ads.map((ad, index) => (
        <motion.div
          key={ad.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden"
          style={{ width: ad.width, height: '100px' }}
        >
          <div className="relative h-full">
            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center p-2">
              <h3 className="text-white text-sm font-semibold">{ad.title}</h3>
              <p className="text-white text-xs mt-1">{ad.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AdRow;