import React from 'react';
import { motion } from 'framer-motion';
import { FiMonitor, FiTruck, FiShoppingBag, FiHome } from 'react-icons/fi';

const categories = [
  { id: 1, name: 'Tecnologia', icon: FiMonitor },
  { id: 2, name: 'Carros', icon: FiTruck },
  { id: 3, name: 'Roupa', icon: FiShoppingBag },
  { id: 4, name: 'Casas', icon: FiHome },
];

function CategoryRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="w-full h-[80px] bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer flex items-center justify-center space-x-3 px-4"
        >
          <category.icon className="text-3xl text-blue-500" />
          <h3 className="text-sm font-semibold text-center">{category.name}</h3>
        </motion.div>
      ))}
    </div>
  );
}

export default CategoryRow;