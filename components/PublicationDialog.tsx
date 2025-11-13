import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const gradientStyles = [
  'bg-gradient-to-r from-gray-700 via-gray-900 to-black',
  'bg-gradient-to-r from-fuchsia-600 to-pink-600',
  'bg-gradient-to-r from-rose-700 to-pink-600',
  'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500',
  'bg-gradient-to-r from-purple-500 to-pink-500',
  'bg-gradient-to-r from-violet-500 to-purple-500',
  'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700',
  'bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900',
  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
  'bg-gradient-to-r from-purple-200 via-purple-400 to-purple-800'
];

interface PublicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublicationDialog({ isOpen, onClose }: PublicationDialogProps) {
  const [content, setContent] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(gradientStyles[0]);
  const { user, token } = useAuth();

  const handlePublish = async () => {
    if (!content.trim()) return;

    try {
      const formData = new FormData();
      formData.append('conteudo', content);
      formData.append('gradient_style', selectedGradient);

      await axios.post('https://skyvendas-production.up.railway.app/publicacoes/form', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      setContent('');
      onClose();
    } catch (error) {
      console.error('Erro ao publicar:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-[#1a1a1a] rounded-lg w-full max-w-lg mx-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={user?.foto_perfil || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-white font-semibold">{user?.nome}</h2>
                  <p className="text-gray-400 text-sm">Amigos</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className={`p-4 rounded-lg mb-4 ${selectedGradient}`}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Em que estás a pensar?"
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
              {gradientStyles.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGradient(gradient)}
                  className={`w-8 h-8 rounded-lg flex-shrink-0 ${gradient} ${
                    selectedGradient === gradient ? 'ring-2 ring-white' : ''
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handlePublish}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              disabled={!content.trim()}
            >
              Publicar
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 