import React from 'react';
import { AlertCircle } from 'lucide-react';

export function VerificationDialog({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-[fadeIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
            Conta Não Verificada
          </h3>
          
          <p className="text-center text-gray-600 mb-6">
            Para publicar produtos, sua conta precisa passar por uma revisão dos nossos moderadores.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
            >
              Enviar para Revisão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}