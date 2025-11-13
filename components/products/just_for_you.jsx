import React from "react";
import { Heart, Check } from "lucide-react";

export default function JustForYou() {
  return (
    <div className="container mx-auto font-bold py-4">
      <h1 className="text-2xl text-gray-600 pb-4">Boladas para si</h1>
      {/* card */}
      <div className="flex gap-4">
        {[1, 1, 1, 1, 1, 1].map((_, index) => (
          <div className="flex flex-col bg-white rounded-lg w-[240px] p-2" key={index}>
            <div className="relative w-full h-[240px] bg-gray-100 rounded-lg">
              <div className="bg-red-100 p-2 rounded-full flex items-center justify-center absolute right-2 top-2 w-[30px] h-[30px]">
                <Heart className="text-red-600" />
              </div>
            </div>
            <div className="flex flex-col p-2">
              <p className="text-slate-700">Smartphone</p>
              <div className="flex justify-between">
                <div className="flex">
                  <h4 className="text-sm">⭐⭐⭐⭐⭐ 2</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={18} className="text-indigo-500 font-bold" />
                  <span>in stock</span>
                </div>
              </div>
              <div className="flex text-gray-700">5000 MT</div>
              <button
                className="border w-full py-2 rounded-md border-indigo-500 text-indigo-500 hover:bg-indigo-600 hover:text-white hover:border-none"
              >
                Comprar Agora
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
