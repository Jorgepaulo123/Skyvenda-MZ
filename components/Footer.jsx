import React from 'react';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">SkyVenda MZ</h3>
            <p className="text-gray-400">Seu destino para os melhores produtos eletrônicos em Moçambique.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">Início</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Produtos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <p className="text-gray-400">Email: info@skyvendamz.com</p>
            <p className="text-gray-400">Telefone: +258 84 123 4567</p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white"><FiFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiInstagram size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FiTwitter size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">&copy; 2023 SkyVenda MZ. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;