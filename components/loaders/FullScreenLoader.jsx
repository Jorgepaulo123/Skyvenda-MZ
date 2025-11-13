import React from 'react';
import { motion } from 'framer-motion';
import BlueSparkLogo from '../svg/bluesparkmz';
const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-indigo-600 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

const FullScreenLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Logo "S" */}
        <img src="/logo.png" alt="Logo" className="w-16 h-16" />

        {/* Loading dots */}
        <LoadingDots />

        {/* "from blueSpark" text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-gray-500 text-sm flex flex-col  items-center"
        >
          <span className='text-gray-300 font-bold text-sm'>from</span>
          <img src='bluesparkmz.svg' width={100}/>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(FullScreenLoader);