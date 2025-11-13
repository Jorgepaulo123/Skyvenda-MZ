import React, { useState } from 'react';
import api from '../api/api';
import { FiX, FiUpload, FiDollarSign, FiBarChart2,FiBox, FiTag, FiImage, FiGitPullRequest, } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast"
import { ToastAction } from "../components/ui/toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PROVINCIAS,DISTRITOS,CATEGORIES,SUBCATEGORIES } from '../data/consts';
import { ArrowLeft, Loader2 } from "lucide-react";



function PublishProductCard({ isOpen, onClose }) {
  const [dragOver, setDragOver] = useState(false);
  const [images, setImages] = useState([]);
  const maxImages = 5;
  const [loading,setLoading]=useState(false)
  // States for each input field
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [estado, setEstado] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const { token } = useContext(AuthContext);
  const { toast } = useToast()


   // Função para converter base64 para File
   const base64ToFile = (base64String, filename, mimeType) => {
    const byteCharacters = atob(base64String.split(',')[1]);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset++) {
      byteArrays.push(byteCharacters.charCodeAt(offset));
    }
    
    
    const byteArray = new Uint8Array(byteArrays);
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  };

  const postProduct = async () => {
    const formData = new FormData();
    formData.append('nome', productName);
    formData.append('preco', parseFloat(price));
    formData.append('categoria', category);
    formData.append('quantidade_estoque', parseInt(stock));
    formData.append('estado', estado);
    formData.append('provincia', province);
    formData.append('distrito', district);
    formData.append('tipo', type);
    formData.append('descricao', description);
    formData.append('detalhes', content);
    formData.append('localizacao', 'string');
    formData.append('disponiblidade', 'string');
    formData.append('revisao', 'string');
    setLoading(true)

    // Adicionando as imagens convertidas para o FormData
    images.forEach((image) => {
      const file = base64ToFile(image.url, `image-${image.id}.png`, 'image/png');
      formData.append('fotos', file);
    });

    api.post('/produtos/publicar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    })
    .then(response => {
      if (response.status === 200) {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Bolada postada com sucesso. ",
          action: <ToastAction altText="Fechar">Fechar</ToastAction>,
      });
      }
    })
    .catch(error => {
      console.log(error.status);
      if (error.status === 401) {
        toast({
            variant: "destructive",
            title: "Ops! Algo deu errado.",
            description: "Parece que você precisa fazer login para continuar.",
            action: <ToastAction altText="Fazer login">Fazer login</ToastAction>,
        });
    } else if (error.status === 403) {
        toast({
            variant: "destructive",
            title: "Acesso negado.",
            description: "Você não tem permissão para acessar este recurso.",
            action: <ToastAction altText="Contatar suporte">Contatar suporte</ToastAction>,
        });
    } else if (error.status === 402) {
        toast({
            variant: "destructive",
            title: "Saldo insuficiente.",
            description: "Seu saldo é insuficiente para completar esta operação.",
            action: <ToastAction altText="Adicionar fundos">Adicionar fundos</ToastAction>,
        });
    } else if (error.status === 422) {
        toast({
            variant: "destructive",
            title: "Dados inválidos.",
            description: "Os dados enviados estão incorretos ou incompletos. Por favor, revise e tente novamente.",
            action: <ToastAction altText="Corrigir dados">Corrigir dados</ToastAction>,
        });
    } else if (error.status === 500) {
        toast({
            variant: "destructive",
            title: "Erro no servidor.",
            description: "Ocorreu um problema no servidor. Por favor, tente novamente mais tarde.",
            action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Erro desconhecido.",
            description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
            action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>,
        });
    }
    
    })
    .finally(() => {
      setLoading(false);
    });
  };

  

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleNewImages(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleNewImages(files);
  };

  const handleNewImages = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const remainingSlots = maxImages - images.length;
    
    // Only process up to the remaining slots
    const filesToProcess = imageFiles.slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(), // Unique ID for each image
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idToRemove) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center max_z_index_2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ 
              opacity: 0,
              y: 20
            }}
            animate={{ 
              opacity: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0,
              y: 20
            }}
            className="relative w-full h-full md:h-auto md:max-w-md md:max-h-[90vh] mx-auto md:mx-4 overflow-hidden md:rounded-xl bg-white"
          >
            {/* Header */}
            <div className="p-3.5 sticky top-0 z-10 bg-gradient-to-r backdrop:blur-md from-pink-50 to-red-50 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="md:hidden text-gray-500 transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <h2 className="text-2xl font-bold text-gray-500">Novo produto</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className='font-bold text-2xl text-gray-500'>Publicar</span>
                  <button
                    onClick={onClose}
                    className="hidden md:block text-gray-500 transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[calc(90vh-8rem)] w-full lg:px-4 md:px-0 custom-scrollbar">
              <div className="p-4 space-y-6">
                {/* Image Upload Area */}
                <div className="space-y-4">
                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full 
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  {images.length < maxImages && (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                    >
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-600">
                            Arraste imagens ou
                          </span>
                          <span className="text-blue-500 hover:text-blue-600 transition-colors">
                            procure no computador
                          </span>
                          <span className="mt-2 block text-sm text-gray-500">
                            {images.length}/{maxImages} imagens
                          </span>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          multiple
                          onChange={handleFileInput}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={productName}
                        onChange={(e)=>setProductName(e.target.value)}
                        placeholder="Iphone 14 pro"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={price}
                        onChange={(e)=>setPrice(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <div className="relative">
                    <Select 
                          value={category}
                          onValueChange={(value) => setCategory(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategoria
                </label>
                <div className="relative">
                <Select 
                  value={type}
                  onValueChange={(value) => setType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma a subcategoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Verifica se há uma província selecionada */}
                    {category && 
                      SUBCATEGORIES[category].map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                </div>
              </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade do estoque
                    </label>
                    <div className="relative">
                      <Input
                        value={stock}
                        onChange={(e)=>setStock(e.target.value)}
                        type="number" 
                        placeholder="0.00"
                        
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <div className="relative">
                      <Select 
                            value={estado}
                            onValueChange={(value) => setEstado(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione Estado" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem  value='Novo'>Novo</SelectItem>
                            <SelectItem  value='Bolada'>Bolada</SelectItem>
                            <SelectItem  value='Seminovo'>Seminovo</SelectItem>
                            </SelectContent>
                          </Select>
                    </div>
                  </div>
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Província
                </label>
                {/* DISTRITOS[formData.provincia].map((distrito) => (
                              <option key={distrito} value={distrito}>
                                {distrito}
                              </option>
                            ))} */}
                <div className="relative">
                      <Select 
                            value={province}
                            onValueChange={(value) => setProvince(value)} >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma província" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCIAS.map((provincia) => (
                            <SelectItem key={provincia} value={provincia}>
                              {provincia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distrito
                </label>
                <div className="relative">
                  
                <Select 
                  value={district}
                  onValueChange={(value) => setDistrict(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Verifica se há uma província selecionada */}
                    {province && 
                      DISTRITOS[province].map((distrito) => (
                        <SelectItem key={distrito} value={distrito}>
                          {distrito}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>

                </div>
              </div>

              
            <div className='py-4'>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalhes
              </label>
              <textarea
                value={content}
                onChange={(e)=> setContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="10"
                placeholder="Detalhes do produto..."
              ></textarea>
            </div>

            <div className='py-4'>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Descreva seu produto..."
              ></textarea>
            </div>
          </div>
            </div>
         </div>

          {/* Footer - Only show on desktop */}
          <div className="flex bg-gradient-to-r backdrop:blur-md from-pink-50 to-red-50 px-6 py-3 justify-end space-x-4 sticky bottom-0 z-10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancelar
            </button>
            <Button 
              onClick={() => postProduct()} 
              variant={'outline'}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Postar'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}

export default PublishProductCard;
   