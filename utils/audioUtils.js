// Utilitários para processamento de áudio

// Cache para guardar durações já carregadas
const audioDurationCache = new Map();

/**
 * Obtém a duração de um arquivo de áudio de uma URL
 * @param {string} url - A URL do arquivo de áudio
 * @returns {Promise<number>} Uma promessa que resolve para a duração em segundos
 */
export const getAudioDuration = (url) => {
    if (!url) {
        console.error('Missing required parameter: url');
        return Promise.resolve(0);
    }

    return new Promise((resolve) => {
        // Verificar se já temos essa duração no cache
        if (audioDurationCache.has(url)) {
            return resolve(audioDurationCache.get(url));
        }

        // Criar um elemento de áudio temporário
        const audio = new Audio();
        
        // Definir um timeout para não esperar infinitamente
        const timeoutId = setTimeout(() => {
            // Se demorar muito, retorna 0 mas continua carregando em segundo plano
            resolve(0);
        }, 3000); // 3 segundos de timeout
        
        // Quando os metadados forem carregados, resolver a promessa
        audio.addEventListener('loadedmetadata', () => {
            clearTimeout(timeoutId);
            
            if (isFinite(audio.duration) && !isNaN(audio.duration)) {
                audioDurationCache.set(url, audio.duration);
                resolve(audio.duration);
            } else {
                audioDurationCache.set(url, 0);
                resolve(0);
            }
        });
        
        // Caso haja erro, resolver como 0
        audio.addEventListener('error', () => {
            clearTimeout(timeoutId);
            audioDurationCache.set(url, 0);
            resolve(0);
        });
        
        // Iniciar carregamento dos metadados
        audio.preload = 'metadata';
        audio.src = url;
        audio.load();
    });
};

/**
 * Pré-carrega metadados de múltiplos áudios em segundo plano
 * @param {Array<{url: string, id: string}>} audioList - Lista de áudios para pré-carregar
 * @param {Function} onDurationLoaded - Callback chamado quando a duração for carregada
 */
export const preloadAudioMetadata = (audioList, onDurationLoaded) => {
    if (!audioList || !Array.isArray(audioList) || audioList.length === 0) {
        console.error('Invalid audio list');
        return;
    }
    
    if (!onDurationLoaded || typeof onDurationLoaded !== 'function') {
        console.error('Invalid callback function');
        return;
    }
    
    audioList.forEach(item => {
        if (!item.url) return;
        
        // Se já temos no cache, retorna imediatamente
        if (audioDurationCache.has(item.url)) {
            onDurationLoaded(item.id, audioDurationCache.get(item.url));
            return;
        }
        
        // Carrega em segundo plano
        getAudioDuration(item.url).then(duration => {
            onDurationLoaded(item.id, duration);
        });
    });
};

/**
 * Formata a duração em segundos para o formato MM:SS
 * @param {number} seconds - Duração em segundos
 * @returns {string} Duração formatada
 */
export const formatAudioDuration = (seconds) => {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) {
        return '0:00';
    }
    try {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    } catch (error) {
        console.error('Error formatting duration:', error);
        return '0:00';
    }
};

// Audio playback management
export function toggleAudioPlayback(audioId, audioUrl, audioStates, setAudioStates) {
    if (!audioId || !audioUrl || !audioStates || !setAudioStates) {
        console.error('Missing required parameters:', { audioId, audioUrl, hasAudioStates: !!audioStates, hasSetAudioStates: !!setAudioStates });
        return;
    }

    const currentState = audioStates[audioId];

    // Stop all other playing audio
    Object.entries(audioStates).forEach(([id, state]) => {
        if (id !== audioId && state?.audio && !state.audio.paused) {
            try {
                state.audio.pause();
                setAudioStates(prev => ({
                    ...prev,
                    [id]: { ...state, isPlaying: false }
                }));
            } catch (error) {
                console.error('Error stopping other audio:', error);
            }
        }
    });

    if (!currentState?.audio) {
        try {
            // Create new audio instance
            const audio = new Audio(audioUrl);
            
            audio.addEventListener('timeupdate', () => {
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: {
                        ...prev[audioId],
                        currentTime: audio.currentTime,
                    }
                }));
            });

            audio.addEventListener('loadedmetadata', () => {
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: {
                        ...prev[audioId],
                        duration: audio.duration,
                    }
                }));
            });

            audio.addEventListener('ended', () => {
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: {
                        ...prev[audioId],
                        isPlaying: false,
                        currentTime: 0,
                    }
                }));
            });

            audio.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: {
                        ...prev[audioId],
                        isPlaying: false,
                        error: true
                    }
                }));
            });

            setAudioStates(prev => ({
                ...prev,
                [audioId]: {
                    audio,
                    isPlaying: true,
                    currentTime: 0,
                    duration: 0,
                    error: false
                }
            }));

            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: {
                        ...prev[audioId],
                        isPlaying: false,
                        error: true
                    }
                }));
            });
        } catch (error) {
            console.error('Error creating audio:', error);
        }
    } else {
        try {
            // Toggle existing audio
            if (currentState.audio.paused) {
                currentState.audio.play().catch(error => {
                    console.error('Error resuming audio:', error);
                    setAudioStates(prev => ({
                        ...prev,
                        [audioId]: { ...currentState, isPlaying: false, error: true }
                    }));
                });
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: { ...currentState, isPlaying: true, error: false }
                }));
            } else {
                currentState.audio.pause();
                setAudioStates(prev => ({
                    ...prev,
                    [audioId]: { ...currentState, isPlaying: false }
                }));
            }
        } catch (error) {
            console.error('Error toggling audio:', error);
        }
    }
}

// Clean up audio resources
export function cleanupAudioStates(audioStates) {
    if (!audioStates) return;

    try {
        Object.values(audioStates).forEach(state => {
            if (state?.audio) {
                state.audio.pause();
                state.audio.src = '';
                state.audio.remove();
            }
        });
    } catch (error) {
        console.error('Error cleaning up audio states:', error);
    }
}

// Audio recording visualization
export function drawWaveform(analyserRef, canvasRef, isRecording, animationFrameRef) {
    if (!analyserRef?.current || !canvasRef?.current) {
        console.error('Missing required refs:', { hasAnalyser: !!analyserRef?.current, hasCanvas: !!canvasRef?.current });
        return;
    }

    try {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const analyser = analyserRef.current;

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!isRecording) return;

            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = '#ffebee';  // Light red background
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = '#ef5350';  // Red line
            canvasCtx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        draw();
    } catch (error) {
        console.error('Error drawing waveform:', error);
    }
}

// Process recorded audio chunks into a playable blob
export function processAudioRecording(audioChunks) {
    if (!audioChunks || audioChunks.length === 0) {
        console.error('No audio chunks to process');
        return null;
    }
    
    try {
        const audioBlob = new Blob(audioChunks);
        const mimeType = 'audio/wav';
        const typedBlob = new Blob([audioBlob], { type: mimeType });
        const blobUrl = URL.createObjectURL(typedBlob);
        
        return {
            blob: typedBlob,
            url: blobUrl
        };
    } catch (error) {
        console.error('Error processing audio:', error);
        return null;
    }
}

// Clean up audio recording resources
export function cleanupAudioRecording(mediaRecorder, analyserRef, audioContextRef, tracks) {
    try {
        if (tracks) {
            tracks.forEach(track => {
                try {
                    track.stop();
                } catch (error) {
                    console.error('Error stopping track:', error);
                }
            });
        }
        
        if (analyserRef?.current) {
            try {
                analyserRef.current.disconnect();
            } catch (error) {
                console.error('Error disconnecting analyser:', error);
            }
        }
        
        if (audioContextRef?.current) {
            try {
                audioContextRef.current.close();
            } catch (error) {
                console.error('Error closing audio context:', error);
            }
        }
        
        if (mediaRecorder) {
            try {
                mediaRecorder.stop();
            } catch (error) {
                console.error('Error stopping media recorder:', error);
            }
        }
    } catch (error) {
        console.error('Error in cleanupAudioRecording:', error);
    }
}
