import { useState } from "react";
import { ChevronLeft, ChevronRight} from 'lucide-react';
import { base_url } from "../../api/api";
export default function ImageGallery({images}) {
    const [currentImage, setCurrentImage] = useState(0);
  
  
    const nextImage = () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    };
  
    const previousImage = () => {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };
  
    // Verifica se há imagens para exibir
    if (!images || images.length === 0) {
      return <div>Nenhuma imagem disponível</div>;
    }
  
    return (
      <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`${base_url}/produto/${images[currentImage]}`}
          onError={(e) => e.target.src = 'imagem.jpg'}
          alt={`Property image ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
  
        <button
          onClick={previousImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
  
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
  
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full ${
                currentImage === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }