import React, { useState, useEffect } from 'react';
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export function NhonguistasList() {
  const [nhonguistas, setNhonguistas] = useState([
    {
      id: 1,
      username: "jorge",
      nome: "jorge",
      foto_url: "https://storage.googleapis.com/skyvendamz1/perfil/210bedf9-711c-4df8-bd9f-d817221f2b6a.jpg",
      media_estrelas: 5.0,
      total_avaliacoes: 1,
      tipo: "nhonguista",
      seguidores: 0,
      total_produtos: 0
    },
    {
      id: 2,
      username: "crezzy",
      nome: "cREMILDO ERNESTO",
      foto_url: null,
      media_estrelas: 3.0,
      total_avaliacoes: 0,
      tipo: "nhonguista",
      seguidores: 2,
      total_produtos: 0
    }
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {nhonguistas.map((nhonguista) => (
        <div 
          key={nhonguista.id} 
          className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm"
        >
          {/* Nhonguista info section */}
          <div className="p-4 flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {nhonguista.foto_url ? (
                <img 
                  src={nhonguista.foto_url} 
                  alt={nhonguista.nome} 
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
                  {nhonguista.nome?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Name and rating */}
            <div className="flex-1">
              <div className="font-bold text-lg">{nhonguista.nome}</div>
              <div className="flex items-center mt-1">
                <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                <span className="ml-1 font-medium">{nhonguista.media_estrelas?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
          
          {/* Stats row */}
          <div className="flex justify-center text-center text-sm py-2">
            <div className="flex-1">
              <div className="font-medium">{nhonguista.seguidores || 0}</div>
              <div className="text-gray-500 text-xs">seguidores</div>
            </div>
            <div className="flex-1">
              <div className="font-medium">{nhonguista.total_avaliacoes || 0}</div>
              <div className="text-gray-500 text-xs">avaliações</div>
            </div>
            <div className="flex-1">
              <div className="font-medium">{nhonguista.total_produtos || 0}</div>
              <div className="text-gray-500 text-xs">produtos</div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex border-t border-gray-100">
            <button className="flex items-center justify-center gap-1 py-2 px-1 flex-1 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
              Seguir
            </button>
            <button className="flex items-center justify-center gap-1 py-2 px-1 flex-1 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 border-l border-r border-gray-100">
              <Star className="h-4 w-4" />
              Avaliar
            </button>
            <button className="flex items-center justify-center gap-1 py-2 px-1 flex-1 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Produtos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
