import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UserPlus, Star, MessageSquare } from "lucide-react";
import api from '../../api/api';
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function SellerCard({ seller }) {
  const [isFollowing, setIsFollowing] = useState(seller.segue_usuario);
  const [userRating, setUserRating] = useState(0); // Estado para armazenar a avaliação do usuário atual
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const {user,token}=useContext(AuthContext)
  const { toast } = useToast();
  

  const handleFollow = (seller) => {
    api.post(`usuario/${seller?.id}/seguir`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then((res) => {
        setIsFollowing(!isFollowing);
        if (res.data) {
            toast({
                title: `🙌 Você começou a seguir ${seller.name}! 🎯`,
                description: '',
            });
        } else {
            toast({
                title: `⚠️ Você deixou de seguir ${seller.name}. 😔`,
                description: '',
            });
        }
    })
    .catch((err) => {
        console.error(err); // Log do erro para depuração
        toast({
            title: "❌ Algo deu errado!",
            description: `Não foi possível atualizar o status de seguimento.`,
        });
    });
};



  const handleRating = (stars) => {
    if (!token) {
      toast({
        title: "❌ Você precisa estar logado",
        description: "Faça login para avaliar este usuário",
      });
      return;
    }

    api.post(`usuario/usuarios/${seller.id}/avaliar/`, {
      estrelas: stars
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUserRating(stars);
      setIsRatingSubmitted(true);
      toast({
        title: "⭐ Avaliação registrada!",
        description: `Você avaliou ${seller.name} com ${stars} estrelas.`,
      });
    })
    .catch((err) => {
      console.error(err);
      toast({
        title: "❌ Erro ao avaliar",
        description: "Não foi possível registrar sua avaliação.",
      });
    });
  };

  return (
    <Card className="w-full bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      {/* Seller info section */}
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {seller.foto_perfil ? (
            <img 
              src={seller.foto_perfil} 
              alt={seller.name} 
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
              {seller.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Name and rating */}
        <div className="flex-1">
          <div className="font-bold text-lg">{seller.name}</div>
          <div className="flex items-center mt-1">
            <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
            <span className="ml-1 font-medium">{seller.media_estrelas?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="flex justify-center text-center text-sm py-2">
        <div className="flex-1">
          <div className="font-medium">{seller.total_seguidores || 0}</div>
          <div className="text-gray-500 text-xs">seguidores</div>
        </div>
        <div className="flex-1">
          <div className="font-medium">{seller.total_avaliacoes || 0}</div>
          <div className="text-gray-500 text-xs">avaliações</div>
        </div>
        <div className="flex-1">
          <div className="font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-gray-500 text-xs">verificado</div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex border-t border-gray-100">
        <button 
          className={`flex items-center justify-center gap-1 py-2 px-1 flex-1 text-xs font-medium ${isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}
          onClick={() => handleFollow(seller)}
        >
          <UserPlus className="h-4 w-4" />
          {isFollowing ? "Seguindo" : "Seguir"}
        </button>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center gap-1 py-2 px-1 flex-1 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700 border-l border-r border-gray-100">
              <Star className={`h-4 w-4 ${isRatingSubmitted ? "fill-yellow-500 stroke-yellow-500" : ""}`} />
              Avaliar
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button 
                  key={star} 
                  variant="ghost" 
                  className="p-1 hover:bg-yellow-100"
                  onClick={() => handleRating(star)}
                >
                  <Star 
                    className={`h-6 w-6 ${userRating >= star ? "fill-yellow-500 stroke-yellow-500" : ""}`} 
                  />
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <button className="flex items-center justify-center gap-1 py-2 px-1 flex-1 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700">
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
      </div>
    </Card>
  );
}
