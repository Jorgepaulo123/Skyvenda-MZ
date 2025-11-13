import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header1";
import { AdsColumn } from "../components/ads/ads_column";
import { HomeContext } from "../context/HomeContext";
import { Link } from "react-router-dom";
import { base_url } from "../config/api";
export default function SearchLayout({children}) {
  const {user, isAuthenticated, logout} = useContext(AuthContext);
  const {ads}=useContext(HomeContext)
  

  
    
 return (
   <div>
    <Header/>
    <div className="flex">
    <div className=" w-[320px] bg-white/30 h-[calc(100vh-74.5px)] overflow-y-auto flex-col justify-center items-center p-2 px[5px] space-y-2 hidden md:block ">
    
    <div className="w-[266px] h-[45px] rounded-md bg-white/40 hover:bg-indigo-500 hover:text-white flex items-center px-3 border-blue-200 space-x-2">
      <label className="font-bold">Tecnologia && Eletronica</label>
    </div>
    <div className="w-[266px] h-[45px] rounded-md bg-white/40 hover:bg-indigo-500 hover:text-white flex items-center px-3 border-blue-200 space-x-2">
      <label className="font-bold">Carros e Motas</label>
    </div>
    <div className="w-[266px] h-[45px] rounded-md bg-white/40 hover:bg-indigo-500 hover:text-white flex items-center px-3 border-blue-200 space-x-2">
      <label className="font-bold">Vestuarios</label>
    </div>
    <div className="w-[266px] h-[45px] rounded-md bg-white/40 hover:bg-indigo-500 hover:text-white flex items-center px-3 border-blue-200 space-x-2">
      <label className="font-bold">Sapatos</label>
    </div>
    <div className="w-[266px] h-[45px] rounded-md bg-white/40 hover:bg-indigo-500 hover:text-white flex items-center px-3 border-blue-200 space-x-2">
      <label className="font-bold">Mobiliarios</label>
    </div>
    <AdsColumn ads={ads}/>

    </div>
  
    <div className="h-[calc(100vh-74.5px)] overflow-y-auto w-[93%]" > 
      <div className="p-5">
      <div className="bg-gradient-to-r from-pink-50/50 to-purple-50 rounded-xl p-4 shadow-sm 
        transition-all duration-300 ease-in-out">
      <div>
        <h2 className="text-xl font-bold">Super Boladas</h2>
        <p className="text-sm text-gray-600">Aproveite as melhores boladas do dia</p>
      </div>
      <div className="flex gap-4 flex-wrap">
        {ads.map((ad, index) => (
          <Link to={`${base_url}/post/${ad.produto.slug}`}>
          <div
            className="bg-white rounded-lg p-2 cursor-pointer hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            key={`ad-${index}`} // Chave única para cada anúncio
          >
            <div className="relative w-full sm:w-[140px]">
              <img
                src={`https://skyvendamz.up.railway.app/produto/${ad.produto.capa}`}
                alt={ad?.anuncio?.titulo}
                className="w-full h-24 object-cover rounded-lg mb-2"
                loading="lazy"
              />
            </div>
            <h3 className="text-xs font-medium truncate">{ad?.anuncio?.titulo}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold">{ad?.produto?.preco} mzn</span>
            </div>
          </div>
          </Link>
        ))}
      </div>

        </div>
      </div>

    {children}
    </div>
   </div>
   </div>
 );
}