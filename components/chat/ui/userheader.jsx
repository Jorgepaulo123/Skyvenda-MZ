
"use client";
import { ArrowLeft, Edit } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function UserHeader({ user, onNewChat = () => {} }) {
    const router = useRouter();
    return (
        <div className="flex flex-col p-4 border-b">
            <div className='flex justify-between items-center w-full mb-12'>
                <ArrowLeft 
                    size={20} 
                    className="cursor-pointer hover:text-skyvenda-500 md:hidden" 
                    onClick={() => router.push('/')}
                />
                <h1 className="font-bold text-lg">{user.username}</h1>
                <button
                    type="button"
                    aria-label="Novo chat"
                    title="Novo chat"
                    onClick={onNewChat}
                    className="p-1 rounded hover:text-skyvenda-500"
                >
                    <Edit size={20} />
                </button>
            </div>
            <div className="f">
                <div className="flex flex-col items-center w-[60px] space-y-2">
                    <Image
                        src={user.perfil || `avatar.png`}
                        alt="profile"
                        width={60}
                        height={60}
                        className="w-[60px] h-[60px] rounded-full border-2 border-skyvenda-400"
                        unoptimized
                    />
                    <span className='text-gray-500 text-sm'>{user?.name}</span>
                </div>
            </div>
        </div>
    )
}
