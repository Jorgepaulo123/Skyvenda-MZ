import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from "../../hooks/use-toast";

export function BestSellers() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    // Usando o endpoint correto de ranking de usuários
    api.get('usuario/usuarios/ranking?page=1&per_page=5')
      .then(res => {
        setBestSellers(res.data.usuarios || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar melhores vendedores:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Vendedores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-blue-50 p-2 border-b border-gray-100">
        <h3 className="text-base font-medium flex items-center">
          <Star className="h-4 w-4 mr-2 fill-yellow-400 stroke-yellow-400" />
          Top Nhonguistas
        </h3>
      </div>
      
      {/* Sellers list */}
      <div className="p-3 space-y-6">
        {bestSellers.slice(0, 2).map((seller) => (
          <div key={seller.id} className="space-y-2">
            {/* Profile section */}
            <div className="flex items-center">
              {/* Avatar */}
              <div className="mr-3">
                {seller.foto_url ? (
                  <img 
                    src={seller.foto_url} 
                    alt={seller.nome} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-white font-medium">
                    {seller.nome?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Name and rating */}
              <div className="flex-1">
                <div className="flex items-center">
                  <Link to={`/${seller.username}`} className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors">
                    {seller.nome}
                  </Link>
                </div>
                <div className="flex items-center text-xs">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
                  <span className="text-gray-700">{seller.media_estrelas?.toFixed(1) || '0.0'}</span>
                  <span className="mx-1 text-gray-400">•</span>
                  <span className="text-gray-500">{seller.total_avaliacoes || 1} avaliações</span>
                  {seller.tipo === "nhonguista" && (
                    <span className="ml-2 text-green-600">Nhonguista</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats row */}
            <div className="flex justify-between text-center text-xs py-1">
              <div className="flex-1">
                <div className="font-medium text-gray-700">{seller.seguidores || 0}</div>
                <div className="text-gray-500">seguidores</div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-700">{seller.total_avaliacoes || 1}</div>
                <div className="text-gray-500">avaliações</div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-gray-500">verificado</div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-between text-xs">
              <button className="flex items-center justify-center gap-1 text-gray-600 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                </svg>
                Seguir
              </button>
              <button className="flex items-center justify-center gap-1 text-gray-600 py-1">
                <Star className="h-4 w-4" />
                Avaliar
              </button>
              <button className="flex items-center justify-center gap-1 text-gray-600 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
        <Link to="/sellers" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
          Ver todos os nhonguistas
        </Link>
      </div>
    </div>
  );
}
