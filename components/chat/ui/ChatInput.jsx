"use client";
import { File, Image, Mic, Pause, Play, Send, Smile, Square, Trash } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function ChatInput({
  isRecording,
  recordingDuration,
  formatTime,
  canvasRef,
  stopRecording,
  mediaPreview,
  mediaType,
  toggleAudioPlayback,
  audioStates,
  duration,
  cancelMedia,
  handleSendMessageWithFile,
  mediaInputRef,
  handleFileSelect,
  messageInput,
  setMessageInput,
  handleTyping,
  startRecording,
  handleSendMessage
}) {
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            const fakeEvent = { target: { files: [file] } };
            handleFileSelect(fakeEvent);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handleFileSelect]);

  const onSendMessage = () => {
    if (messageInput.trim() === '' && !mediaPreview) return;
    
    if (mediaPreview && mediaType !== 'audio') {
      handleSendMessageWithFile();
    } else {
      handleSendMessage();
    }
  };

  return (
    <div className="p-2 sm:p-4 border-t bg-white">
      {isRecording ? (
        /* Estado 1: Gravando áudio */
        <div className="flex border rounded-full bg-gray-50 gap-2 sm:gap-4 px-2 sm:px-4 items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium">{formatTime(recordingDuration)}</span>
          </div>
          <div className="flex-1 mx-2 sm:mx-4">
            <canvas 
              ref={canvasRef} 
              className="w-full h-8 sm:h-12 rounded-md"
            />
          </div>
          <button
            onClick={stopRecording}
            className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <Square size={12} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      ) : mediaPreview && mediaType === 'audio' ? (
        /* Estado 2: Áudio gravado com preview */
        <div className="flex p-2 sm:p-3 border rounded-full bg-gray-50 gap-2 sm:gap-4 px-2 sm:px-4 items-center w-full">
          <button
            onClick={() => toggleAudioPlayback('preview', mediaPreview)}
            className="p-1.5 sm:p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
          >
            {audioStates['preview']?.isPlaying ? 
              <Pause size={12} className="sm:w-4 sm:h-4" /> : 
              <Play size={12} className="sm:w-4 sm:h-4" />
            }
          </button>
          <div className="flex-1 mx-2 sm:mx-3">
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ 
                  width: audioStates['preview']?.duration ? 
                    `${(audioStates['preview']?.currentTime / audioStates['preview']?.duration) * 100}%` : 
                    '0%' 
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {audioStates['preview']?.currentTime ? 
                  formatTime(audioStates['preview']?.currentTime) : 
                  '0:00'}
              </span>
              <span className="text-xs text-gray-500">
                {duration ? formatTime(duration) : 
                 (audioStates['preview']?.duration ? 
                  formatTime(audioStates['preview']?.duration) : 
                  '0:00')}
              </span>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={cancelMedia}
              className="p-1.5 sm:p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
            >
              <Trash size={12} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={handleSendMessageWithFile}
              className="p-1.5 sm:p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600"
            >
              <Send size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Estado 3: Input normal */
        <div className="flex p-2 sm:p-3 border rounded-full gap-2 sm:gap-4 px-2 sm:px-4 items-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <Smile className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"/>
            <input
              type="file"
              ref={mediaInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
            />
            <button 
              onClick={() => mediaInputRef.current.click()}
              className="p-1 hover:bg-gray-100 rounded-full hidden sm:block"
            >
              <Image size={20} className="text-gray-500"/>
            </button>
            <button 
              onClick={() => mediaInputRef.current.click()}
              className="p-1 hover:bg-gray-100 rounded-full hidden sm:block"
            >
              <File size={20} className="text-gray-500"/>
            </button>
          </div>
          
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSendMessage();
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 outline-none bg-transparent text-sm sm:text-base min-w-0"
          />
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={startRecording}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Mic size={20} className="text-gray-500 w-5 h-5 sm:w-5 sm:h-5" />
            </button>
            
            {mediaPreview && mediaType !== 'audio' ? (
              <button 
                className="px-3 py-1 sm:px-4 sm:py-1.5 bg-indigo-500 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-indigo-600 whitespace-nowrap"
                onClick={handleSendMessageWithFile}
              >
                Enviar
              </button>
            ) : messageInput.trim() && (
              <button 
                className="px-3 py-1 sm:px-4 sm:py-1.5 bg-indigo-500 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-indigo-600 whitespace-nowrap"
                onClick={handleSendMessage}
              >
                Enviar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}