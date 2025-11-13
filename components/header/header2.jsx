"use client";
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { MapPinIcon, RefreshCcw,ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CategoryMenu } from '../menus/CategoryMenu'
import { useAuth } from '../../context/AuthContext'

export default function Header2() {
    const [province, setProvince] = useState('niassa')
    const router = useRouter()
    const { isAuthenticated, user } = useAuth()

    const handleProvinceChange = (value) => {
        setProvince(value)
        router.push(`/p/${value}`)
    }

    const handleVerificationClick = () => {
        router.push('/profile/review')
    }

    // Só mostrar o botão de verificação se não estiver revisado (sim/aprovado não mostram)
    const shouldShowVerification = isAuthenticated && !['sim','aprovado'].includes((user?.revisado || '').toLowerCase())

    return (
        <>
            {/* terceiro header */}
            <div className="py-1 bg-indigo-100 h-[60px] hidden md:flex">
                <div className="container mx-auto flex items-center gap-5 justify-between">
                    <div className="flex gap-8 justify-center items-center">
                        {/* Category Menu */}
                        <CategoryMenu />
                        
                        {/* Status de Verificação - só mostra se não estiver revisado */}
                        {shouldShowVerification && (
                            <button
                                onClick={handleVerificationClick}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-amber-700 hover:bg-amber-100"
                            >
                                <ShieldAlert className="w-5 h-5" />
                                <span>Verificar Conta</span>
                            </button>
                        )}
                    </div>
                    <div className="flex space-x-8 text-gray-600">
                        <div className="flex gap-2 items-center hover:text-indigo-500 min-w-[200px]">
                            <div className="flex items-center justify-center rounded-full bg-white p-2">
                                <MapPinIcon />
                            </div>
                            <Select 
                                value={province} 
                                onValueChange={handleProvinceChange}
                            >
                                <SelectTrigger className="border-none shadow-none focus:ring-0 focus:outline-none max-w-[200px]">
                                    <SelectValue placeholder="Selecione a província" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="niassa">Niassa</SelectItem>
                                    <SelectItem value="cabo_delgado">Cabo Delgado</SelectItem>
                                    <SelectItem value="nampula">Nampula</SelectItem>
                                    <SelectItem value="zambezia">Zambézia</SelectItem>
                                    <SelectItem value="tete">Tete</SelectItem>
                                    <SelectItem value="manica">Manica</SelectItem>
                                    <SelectItem value="sofala">Sofala</SelectItem>
                                    <SelectItem value="inhambane">Inhambane</SelectItem>
                                    <SelectItem value="gaza">Gaza</SelectItem>
                                    <SelectItem value="maputo">Maputo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Link 
                            href="/visto-recentemente"
                            className="flex gap-2 items-center hover:text-indigo-500 min-w-[200px]"
                        >
                            <div className="flex items-center justify-center rounded-full bg-white p-2">
                                <RefreshCcw />
                            </div>
                            <span>Visto recentemente</span>
                        </Link>
                    </div>
                </div>
            </div>
            {/* terceiro header */}
        </>
    )
}
