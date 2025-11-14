"use client";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Grid, Newspaper, Heart, Ban, ThumbsDown, Trash } from 'lucide-react';
import { base_url } from '../../../api/api';

export default function UserInfoSidebar({ 
  showUser, 
  selectedUser, 
  view, 
  onBackClick,
  onAddFavorite,
  onBlock,
  onReport,
  onDeleteMessages
}) {
  if (!showUser) return null;

  return (
    <div className={`w-full md:w-[380px] border-l border-gray-200 flex flex-col min-h-0 ${
      view !== 'info' ? 'hidden md:flex' : ''
    }`}>
      <div className="flex items-center justify-between p-4 border-b">
        <ArrowLeft className="cursor-pointer hover:text-skyvenda-500" onClick={onBackClick}/>
        <div className="h-[40px] flex items-center">
        <Link href={`/${selectedUser?.username}`} className='hover:underline hover:text-skyvenda-500'>
          {selectedUser?.nome}
        </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex p-4 md:p-8 w-full flex-col items-center gap-4">
            <Image 
              src={selectedUser?.foto || `${base_url}/avatar.png`}
              alt={selectedUser?.nome || 'Foto do usuário'}
              width={200}
              height={200}
              className="w-[120px] h-[120px] md:w-[200px] md:h-[200px] rounded-full"
              unoptimized
            />
            <Link href={`/${selectedUser?.username}`} className='font-bold text-xl md:text-2xl hover:underline hover:text-indigo-500'>
              {selectedUser?.nome}
            </Link>
          </div>

          <div className="flex w-full gap-4 justify-center">
            <div className="flex gap-2 hover:text-indigo-600 cursor-pointer">
              <Grid size={20}/>
              <span>Boldas</span>
              <span className='font-bold text-indigo-500'>{selectedUser?.boldas_count || 0}</span>
            </div>
            <div className="flex gap-2 hover:text-indigo-600 cursor-pointer">
              <Newspaper size={20}/>
              <span>Publicacoes</span>
              <span className='font-bold text-indigo-500'>{selectedUser?.posts_count || 0}</span>
            </div>
          </div>

          <div className="w-full border-t">
            <div 
              className="flex gap-3 hover:bg-gray-100 p-4 px-8 cursor-pointer"
              onClick={onAddFavorite}
            >
              <Heart size={20}/>
              <span>Adicionar aos favorios</span>
            </div>
            <div 
              className="flex gap-3 hover:bg-gray-100 p-4 px-8 cursor-pointer text-red-500"
              onClick={onBlock}
            >
              <Ban size={20}/>
              <span>Bloaquar o/a {selectedUser?.nome}</span>
            </div>
            <div 
              className="flex gap-3 hover:bg-gray-100 p-4 px-8 cursor-pointer text-red-500"
              onClick={onReport}
            >
              <ThumbsDown size={20}/>
              <span>Denuciar o/a {selectedUser?.nome}</span>
            </div>
            <div 
              className="flex gap-3 hover:bg-gray-100 p-4 px-8 cursor-pointer text-red-500"
              onClick={onDeleteMessages}
            >
              <Trash size={20}/>
              <span>Apagar mensagens</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}