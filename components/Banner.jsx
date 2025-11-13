import React from 'react';

function Banner() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md mb-8 overflow-hidden">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-8 md:mb-0 md:w-1/2">
          <h2 className="text-4xl font-bold mb-4">Bem-vindo ao SkyVenda MZ</h2>
          <p className="text-xl mb-6">Descubra as melhores ofertas em tecnologia!</p>
          <button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full hover:bg-blue-100 transition duration-300">
            Comprar Agora
          </button>
        </div>
        <div className="md:w-1/2">
          <img src="/default.png" alt="Banner" className="rounded-lg shadow-lg" />

        </div>
      </div>
    </div>
  );
}

export default Banner;