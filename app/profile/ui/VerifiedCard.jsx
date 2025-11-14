import React from 'react';
import { CheckCircle, ShoppingBag, CreditCard, Store } from 'lucide-react';

export function VerifiedCard() {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Conta Verificada!</h2>
        <p className="text-emerald-600 mb-6">Parabéns! Sua conta foi verificada com sucesso.</p>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Store className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Publicar Produtos</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <ShoppingBag className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Comprar Produtos</p>
          </div>
        </div>

        <button className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200 inline-flex items-center">
          <CreditCard className="w-4 h-4 mr-2" />
          Começar a Vender
        </button>
      </div>
    </div>
  );
}