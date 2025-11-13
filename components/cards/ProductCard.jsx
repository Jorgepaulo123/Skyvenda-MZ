import { useState } from 'react';
import { Eye, Heart, MoreVertical, Pencil,Earth,MessageCircle, Trash2, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import ConfirmDelete from '../Dialogs/AlertDelete';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
export default function ProductCard({ product, onEdit, onDelete,onTurbo }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

      const handleCloseDialog = () => {
        setIsDialogOpen(false); // Fecha o diálogo
        setSelectedProduct(null);
      };
  
    return (
      <div className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 relative overflow-visible">
        <div className="relative w-1/3 shrink-0">
          <div className="h-full overflow-hidden">
          <img
            src={`${product.thumb}`}
            onError={(e) => e.target.src = 'imagem.jpg'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-200"
            />
          </div>
          {product.views > 1000 && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Destaque
            </div>
          )}
        </div>
        
        <div className="flex-grow p-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="truncate">
              <div className="flex items-center gap-2 mb-1">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                  ${product.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'}
                `}>
                  {product.status === 'published' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Publicado
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      Rascunho
                    </>
                  )}
                </span>
              </div>
              <h3
                className="font-semibold text-gray-900 transition-colors truncate"
                title={product.title}
              >
                {product.title}
              </h3>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 p-0 hover:bg-transparent text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-50">
                <DropdownMenuItem onClick={() => onEdit(product)} className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTurbo(product)} className="gap-2">
                  <Earth className="w-4 h-4" />
                  Turbinar a Boldada
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsDialogOpen(true)}
                }
                  className="text-red-600 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
  
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
              <Eye className="w-3 h-3" />
              {formatNumber(product.views)}
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
              <Heart className="w-3 h-3" />
              {formatNumber(product.likes)}
            </span>
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
              <MessageCircle className="w-3 h-3" />
              {product?.comments?.length || 0}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
            <Clock className="w-3 h-3" />
            <span>Publicado a {product.time}</span>
          </div>
        </div>
    
        <ConfirmDelete
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            product={selectedProduct}
            onDelete={onDelete}
            
      />
      </div>
    );
  }
  