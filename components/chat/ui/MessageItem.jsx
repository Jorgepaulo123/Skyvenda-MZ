"use client";
import React, { useMemo, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Loader, AlertCircle, Check, CheckCheck, Play, Pause, X } from 'lucide-react'
import { formatAudioDuration } from '../../../utils/audioUtils'
import './MessageItem.css'
import Image from 'next/image'

export default function MessageItem({ message, audioStates = {}, onToggleAudio }) {
    const {user} = useAuth()
    const [showImageViewer, setShowImageViewer] = useState(false);
    
    // Assegura compatibilidade com mensagens antigas que podem usar type em vez de message_type
    const messageType = message?.message_type || message?.type || 'text';
    const fileUrl = message?.file_url || message?.file;
    const isUploading = message?.status === 'uploading';
    const hasError = message?.status === 'error';
    
    // Get audio state with default values
    const audioState = useMemo(() => {
        if (!message?.id) return { isPlaying: false, currentTime: 0, duration: 0 };
        return audioStates[message.id] || { isPlaying: false, currentTime: 0, duration: 0 };
    }, [message?.id, audioStates]);
    
    // Formatar hora (hh:mm)
    const getHours = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };
    
    // Abrir visualizador de imagem
    const openImageViewer = (e) => {
        e.stopPropagation();
        setShowImageViewer(true);
    };
    
    // Fechar visualizador de imagem
    const closeImageViewer = () => {
        setShowImageViewer(false);
    };
    
    // Prevenir propagação de eventos ao clicar no diálogo
    const handleDialogClick = (e) => {
        e.stopPropagation();
    };
    
    // Renderiza o status da mensagem
    const renderMessageStatus = () => {
        if (isUploading) {
            return <Loader size={16} className="animate-spin text-gray-400" />;
        }
        
        if (hasError) {
            return <AlertCircle size={16} className="text-red-500" />;
        }
        
        if (message?.is_read) {
            return <CheckCheck size={16} className="text-blue-400" />;
        }
        
        if (message?.is_delivered) {
            return <CheckCheck size={16} className="text-gray-400" />;
        }
        
        return <Check size={16} className="text-gray-400" />;
    };
   
    // Player de áudio personalizado
    const renderCustomAudioPlayer = () => {
        if (!message?.id || !fileUrl) {
            console.error('Message ID or file URL is missing:', { messageId: message?.id, fileUrl });
            return null;
        }

        const { isPlaying, currentTime, duration } = audioState;
        
        // Calcular a porcentagem baseada na duração real
        const progressPercentage = duration > 0 
            ? Math.min((currentTime / duration) * 100, 100) 
            : isPlaying ? Math.min((currentTime / 60) * 100, 100) : 0;
        
        return (
            <div className={`flex items-center gap-2 w-[300px] ${isPlaying ? 'audio-playing' : ''}`}>
                {/* Botão de play/pause */}
                <button 
                    onClick={() => onToggleAudio?.(message.id, fileUrl)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-blue-100 text-blue-600' : 'bg-skyvenda-100 text-skyvenda-600'}`}
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                
                {/* Barra de progresso */}
                <div className="flex-1">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full progress-bar ${isPlaying ? 'bg-skyvenda-500' : 'bg-gray-300'}`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className={`flex justify-between text-xs mt-1 ${message.sender_id === user.id ? 'text-skyvenda-100' : 'text-gray-500'}`}>
                        <span>{formatAudioDuration(currentTime)}</span>
                        {duration > 0 ? (
                            <span>{formatAudioDuration(duration)}</span>
                        ) : (
                            <span className={isPlaying ? 'text-skyvenda-100' : ''}>
                                {isPlaying ? "Reproduzindo..." : "Toque para ouvir"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };
   
    // Renderiza o conteúdo do arquivo de acordo com o tipo
    const renderFileContent = () => {
        if (!message) {
            console.error('Message object is missing');
            return null;
        }

        if (isUploading) {
            switch(messageType) {
                case 'audio':
                    return (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Loader size={16} className="animate-spin text-gray-400" />
                            </div>
                            <span className="text-gray-500">Enviando áudio...</span>
                        </div>
                    );
                case 'image':
                    return (
                        <div className="relative flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <Loader size={16} className="animate-spin text-gray-400" />
                            </div>
                            <span className="text-gray-500">Enviando imagem...</span>
                        </div>
                    );
                    return (
                        <div className="relative">
                            <img 
                                src={fileUrl} 
                                alt="Preview" 
                                className="max-w-[300px] rounded-lg opacity-50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader size={24} className="animate-spin text-gray-400" />
                            </div>
                        </div>
                    );
                default:
                    return (
                        <div className="flex items-center gap-2">
                            <Loader size={16} className="animate-spin text-gray-400" />
                            <span className="text-gray-500">Enviando arquivo...</span>
                        </div>
                    );
            }
        }

        switch(messageType) {
            case 'audio':
                return renderCustomAudioPlayer();
            case 'image':
                return fileUrl ? (
                    <div className="w-full cursor-pointer">
                        <Image 
                            src={fileUrl} 
                            alt="Imagem" 
                            width={300}
                            height={300}
                            className="max-w-[300px] rounded-lg mb-2 h-auto"
                            onClick={openImageViewer}
                            unoptimized
                        />
                        {message.content && (
                            <div className="text-inherit">{message.content}</div>
                        )}
                    </div>
                ) : null;
            case 'document':
                return fileUrl ? (
                    <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                    >
                        {message.file_name || 'Documento'}
                    </a>
                ) : null;
            default:
                return message.content;
        }
    };

    if (!message) {
        console.error('Message prop is required');
        return null;
    }

    const isFromCurrentUser = message.sender_id === user.id;

    return (
        <>
            <div className={`flex mb-4 ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`relative max-w-[70%] rounded-lg p-3 message-bubble ${
                        isFromCurrentUser 
                            ? 'bg-skyvenda-500 text-white rounded-br-none' 
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                >
                    {renderFileContent()}
                    
                    {/* Timestamp and status */}
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                        isFromCurrentUser ? 'text-skyvenda-100' : 'text-gray-500'
                    }`}>
                        <span>{getHours(message.created_at)}</span>
                        {isFromCurrentUser && renderMessageStatus()}
                    </div>
                </div>
            </div>

            {/* Modal de visualização de imagem */}
            {showImageViewer && messageType === 'image' && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={closeImageViewer}
                >
                    <div 
                        className="relative max-w-[90%] max-h-[90%]" 
                        onClick={handleDialogClick}
                    >
                        <button 
                            className="absolute top-2 right-2 bg-white rounded-full p-2 text-black hover:bg-gray-100"
                            onClick={closeImageViewer}
                        >
                            <X size={24} />
                        </button>
                        <Image 
                            src={fileUrl} 
                            alt="Imagem em tamanho completo" 
                            width={800}
                            height={600}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl h-auto w-auto" 
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </>
    );
}
