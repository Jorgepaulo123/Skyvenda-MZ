// Creates a preview URL for different file types
export function createFilePreview(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve(null);
            return;
        }

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    preview: e.target.result,
                    type: 'image',
                    file
                });
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('audio/')) {
            resolve({
                preview: URL.createObjectURL(file),
                type: 'audio',
                file
            });
        } else if (file.type.startsWith('application/') || file.type.startsWith('text/')) {
            resolve({
                preview: file.name,
                type: 'document',
                file
            });
        } else {
            resolve(null);
        }
    });
}

// Clean up media resources
export function cleanupMedia(audioRef, mediaPreview, mediaType, mediaInputRef) {
    if (audioRef?.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
    if (mediaPreview && mediaType === 'audio') {
        URL.revokeObjectURL(mediaPreview);
    }
    if (mediaInputRef?.current) {
        mediaInputRef.current.value = '';
    }
}
