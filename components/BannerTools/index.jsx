import React from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Car, Smartphone, Bike } from 'lucide-react';
import { ProvinceDropdown } from '../dropdown/province';

export default function BannerTools() {
  return (
    <div className="bg-white/40 backdrop-blur-[2px]">
      <div className="container mx-auto px-3 py-2">
        <div className="flex flex-col gap-2">
          <div className="overflow-x-auto flex gap-3 no-scrollbar">
            <button className="flex items-center justify-center px-4 py-1.5 bg-violet-600 text-white rounded-full text-xs font-medium whitespace-nowrap">
              All
            </button>
            <button className="flex items-center justify-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-600 text-xs font-medium whitespace-nowrap">
              <Car className="w-3.5 h-3.5 mr-1" />
              Cars
            </button>
            <button className="flex items-center justify-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-600 text-xs font-medium whitespace-nowrap">
              <Bike className="w-3.5 h-3.5 mr-1" />
              Moto
            </button>
            <button className="flex items-center justify-center px-4 py-1.5 bg-gray-100 rounded-full text-gray-600 text-xs font-medium whitespace-nowrap">
              <Smartphone className="w-3.5 h-3.5 mr-1" />
              Smartphone
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href="/melhores-boladas" 
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-violet-50/70 rounded-lg text-violet-600"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Melhores Boladas</span>
            </Link>
            <Link 
              href="/melhores-boladas" 
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-50/70 rounded-lg text-orange-600"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Super Oferta</span>
            </Link>
          </div>
          <div className="relative">
            <ProvinceDropdown />
          </div>
        </div>
      </div>
    </div>
  );
} 