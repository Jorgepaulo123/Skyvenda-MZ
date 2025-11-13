import React from 'react';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";

const categories = [
  {
    name: 'Eletrônicos',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Acessórios']
  },
  {
    name: 'Moda',
    subcategories: ['Roupas Masculinas', 'Roupas Femininas', 'Sapatos', 'Acessórios']
  },
  {
    name: 'Casa & Decoração',
    subcategories: ['Móveis', 'Decoração', 'Cozinha', 'Iluminação']
  },
  {
    name: 'Beleza',
    subcategories: ['Cuidados com a Pele', 'Maquiagem', 'Cuidados com o Cabelo', 'Perfumes']
  },
  {
    name: 'Viaturas',
    subcategories: ['Carros', 'Motos', 'Peças & Acessórios']
  },
  {
    name: 'Imóveis',
    subcategories: ['Casas', 'Apartamentos', 'Terrenos', 'Propriedades Comerciais']
  },
  {
    name: 'Eletrodomésticos',
    subcategories: ['Geladeiras', 'Máquinas de Lavar', 'Micro-ondas', 'Ar Condicionado']
  },
  {
    name: 'Roupas e Sapatos',
    subcategories: ['Sapatos Masculinos', 'Sapatos Femininos', 'Roupas Casuais', 'Roupas Formais']
  }
];

export default function CategoriesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full h-[30px] bg-white/80 flex items-center px-4 gap-3 hover:bg-white transition-colors">
        <Menu className="w-4 h-4" />
        <span className="text-sm">Todas as categorias</span>
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent 
          align="start" 
          className="w-64 bg-white rounded-lg shadow-lg z-[999]"
          sideOffset={5}
        >
          {categories.map((category) => (
            <DropdownMenuSub key={category.name}>
              <DropdownMenuSubTrigger className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-default">
                <span className="text-sm">{category.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent 
                  className="min-w-[200px] bg-white rounded-lg shadow-lg z-[1000]"
                  sideOffset={2}
                >
                  {category.subcategories.map((subcategory) => (
                    <DropdownMenuItem key={subcategory} asChild>
                      <Link
                        href={`/${category.name.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {subcategory}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
