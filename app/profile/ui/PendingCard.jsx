import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export function PendingCard() {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg border border-amber-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-6">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Verificação Pendente</h2>
        <p className="text-amber-600 mb-4">Seus documentos estão em análise.</p>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-100">
          <div className="flex items-center justify-center space-x-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Tempo estimado de revisão: 24-48h</p>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-gray-600">
          Você receberá uma notificação assim que a verificação for concluída.
        </p>
      </div>
    </div>
  );
}