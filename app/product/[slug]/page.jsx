"use client";
import React, { useState, useEffect } from 'react';
import { 
  MapPin, Eye, Heart, Star, MessageCircle, 
  Package, Shield, Truck, AlertCircle, ShoppingCart, Loader2,
  UserPlus, Flag, Send, Share2, ArrowLeft,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useContext } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { base_url } from '@/api/api';
import api from '@/api/api';
import { AuthContext } from '@/context/AuthContext';
import { HomeContext } from '@/context/HomeContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useWebSocket } from '@/context/websoketContext';
import { AdsColumn } from '@/components/ads/ads_column';
import DOMPurify from 'dompurify';
import { useCallback } from 'react';
import PinModal from '@/components/modals/PinModal';

// util polyfill to avoid crashing if image error
const fallbackImg="https://skyvenda-mz.vercel.app/avatar.png";

const ProductSkeleton = () => (
  <div className="fixed inset-0 lg:static overflow-y-auto bg-indigo-50 lg:overflow-hidden">
    <div className="max-w-[1440px] mx-auto lg:px-0 sm:w-full">
      <div className="flex flex-col lg:flex-row gap-0 relative">
        <div className="flex-1 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 pb-8 lg:h-[calc(100vh-4rem)] ">
            {/* Gallery Section Skeleton */}
            <div className="relative rounded-lg shadow-sm lg:p-6 lg:h-[calc(100vh-4rem)] ">
              <div className="animate-pulse">
                {/* Main Image Skeleton */}
                <div className="w-full h-[calc(100vh-400px)] bg-gray-200 rounded-lg" />
                
                {/* Thumbnails Skeleton */}
                <div className="hidden lg:flex mt-4 gap-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg" />
                  ))}
                </div>

                {/* Related Products Skeleton */}
                <div className="hidden lg:block mt-8">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                  <div className="flex gap-4 overflow-x-auto">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex-none w-[180px] h-[80px] bg-gray-100 rounded-lg flex">
                        <div className="w-[80px] h-full bg-gray-200" />
                        <div className="flex-1 p-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info Section Skeleton */}
            <div className="bg-white lg:space-y-6 relative lg:h-[calc(100vh-4rem)] lg:overflow-y-auto  lg:rounded-lg">
              <div className="animate-pulse p-6">
                {/* Title and Price */}
                <div className="flex justify-between">
                  <div className="space-y-3">
                    <div className="h-7 w-48 bg-gray-200 rounded" />
                    <div className="h-5 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="h-7 w-32 bg-gray-200 rounded" />
                </div>

                {/* Stats Bar */}
                <div className="flex justify-between mt-6">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-10 w-24 bg-gray-200 rounded-full" />
                  ))}
                </div>

                {/* Buy Section */}
                <div className="mt-8 space-y-4">
                  <div className="h-12 bg-gray-200 rounded-lg" />
                  <div className="h-12 bg-gray-200 rounded-lg" />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[1,2,3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg" />
                  ))}
                </div>

                {/* Seller Info */}
                <div className="mt-8 p-6 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-8 space-y-4">
                  <div className="h-6 w-32 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="hidden lg:block w-[300px] flex-shrink-0">
          <div className="fixed top-16 right-0 w-[300px] h-[calc(100vh-4rem)] bg-white shadow-lg p-4">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-4">
                {/* skeleton items ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function ProductPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const { toast } = useToast();
  // router from next/navigation is used instead of navigate
  const [isCommenting,setIsCommenting]=useState(false)
  const [relacionados,setRelacionados]=useState([])
  const [isloading,setIsLoading]=useState(true)
  const [buyloading,setBuyLoading]=useState(false)
  const [followLoading,setFollowLoading]=useState(false)
  const [isFollowing,setIsFollowing]=useState(false)

  const { setSelectedUser, setChats } = useWebSocket();
  // PIN modal state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState('confirm'); // 'setup' | 'confirm'
  const [pinLoading, setPinLoading] = useState(false);
  const [pendingParams, setPendingParams] = useState(null);

  // Normalize API product shape to what the UI expects
  const normalizeProduct = useCallback((p) => {
    if (!p) return p;
    return {
      id: p.id,
      slug: p.slug,
      title: p.title || p.nome || p.name,
      price: p.price ?? p.preco ?? p.valor,
      province: p.province || p.provincia || p.local || '',
      views: p.views ?? p.visualizacoes ?? 0,
      likes: p.likes ?? 0,
      liked: p.liked ?? false,
      comments: p.comments || p.comentarios || [],
      details: p.details || p.descricao || p.description || '',
      // Prefer thumb/capa as main image
      thumb: p.thumb || p.capa || p.image || null,
      // images may be string with commas or array
      images: Array.isArray(p.images) ? p.images : (p.images || p.imagens || ''),
      user: p.user || p.vendedor || p.usuario || {},
      state: p.state || p.estado || p.condicao,
      time: p.time || p.publicado_em || '',
    };
  }, []);

  // Resolve absolute/relative image URLs
  const resolveImageUrl = useCallback((src) => {
    if (!src) return `${base_url}/default.png`;
    const s = String(src).trim();
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    if (s.startsWith('/')) return `${base_url}${s}`;
    return `${base_url}/${s}`;
  }, []);


  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading2(true);
        const produtoLocal = produtos.find(p => p.slug === slug);
        
        if (produtoLocal) {
          setProduct(normalizeProduct(produtoLocal));
          setIsFollowing(produtoLocal?.user?.seguindo || false);
          setIsMyProduct(produtoLocal?.user?.id === user?.id);
          setIsLiked(!!produtoLocal.liked);
          setLikesCount(produtoLocal.likes ?? 0);
          setLoading2(false);
          return;
        }

        const response = await api.get(`/produtos/detalhe/${slug}?user_id=${user?.id || 0}`);
        const norm = normalizeProduct(response.data);
        setIsMyProduct(norm?.user?.id === user?.id);
        setProduct(norm);
        setIsLiked(!!norm.liked);
        setLikesCount(norm.likes ?? 0);
        addOrUpdateProduto(norm);
      } catch (err) {
        console.log("Erro ao buscar detalhes do produto:", err.message);
      } finally {
        setLoading2(false);
      }
    }

    fetchProduct();
  }, [slug, produtos]);

  // Notificações em tempo real relacionadas a pedidos
  useEffect(() => {
    const handler = (event) => {
      const n = event.detail;
      const tipo = n?.data?.tipo || n?.type || '';
      if (String(tipo).toLowerCase().includes('pedido')) {
        toast({ title: n?.title || 'Atualização de Pedido', description: n?.message || 'Atualização recebida.' });
      }
    };
    window.addEventListener('new-notification', handler);
    return () => window.removeEventListener('new-notification', handler);
  }, []);

  // follow seller
  const handleToggleFollow = async () => {
    if(!token){ toast({title:'Precisa estar logado'}); router.push('/login'); return; }
    if(!product?.user?.id) return;
    try{
      setFollowLoading(true);
      await axios.post(`https://skyvenda-mz.up.railway.app/usuario/${product.user.id}/seguir`, '', {headers:{Authorization:`Bearer ${token}`, accept:'application/json'}});
      setIsFollowing(prev=>!prev);
      toast({title: isFollowing? 'Deixou de seguir' : 'Agora segues este vendedor'});
    }catch(err){
      console.error(err);
      toast({title:'Erro ao seguir'});
    }finally{
      setFollowLoading(false);
    }
  };

  const handleMessageSeller = () => {
    if(!isAuthenticated){ toast({title:'Faça login para conversar'}); router.push('/login'); return; }
    if(!product?.user) return;
    const chatUser={id:product.user.id, nome:product.user.name, username:product.user.username, foto:product.user.avatar||product.user.perfil, mensagens:[]};
    setSelectedUser(chatUser);
    setChats(prev=>{const exists=prev.find(c=>String(c.id)===String(chatUser.id)); if(exists){return [exists,...prev.filter(c=>c.id!==chatUser.id)];} return [chatUser,...prev];});
    router.push('/chat');
  };

  const handleLike = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast({
          title:"Voce nao pode dar like, faz login"
        })
        return;
      }

      try {
        const response = await api.post(`/produtos/${product.slug}/like`, {}, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const newLikeStatus = !isLiked;
        const newLikesCount = newLikeStatus ? product.likes + 1 : product.likes - 1;
        
        setIsLiked(newLikeStatus);
        setLikesCount(newLikesCount);
        
        const updatedProduct = {
          ...product,
          likes: newLikesCount,
          liked: newLikeStatus,
        };
        
        setProduct(updatedProduct);
        addOrUpdateProduto(updatedProduct);
      } catch (err) {
        console.error('Erro ao curtir produto:', err);
        toast({
          title: "Erro",
          description: "Não foi possível processar sua curtida",
        });
      }
    },
    [isLiked, isAuthenticated, product, token, addOrUpdateProduto, toast]
  );


  const getGalleryImages = () => {
    if (!product) return [];
    const imgs = Array.isArray(product.images)
      ? product.images
      : (typeof product.images === 'string' && product.images.length > 0
          ? product.images.split(',')
          : []);
    return [...(product.thumb ? [product.thumb] : []), ...imgs].filter(Boolean);
  };

  const nextImage = () => {
    const images = getGalleryImages();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    const images = getGalleryImages();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  function fazerPedido() {
    if(isMyProduct) {
      toast({
        title: "SkyVenda",
        description: "Não pode fazer pedido no seu Produto!",
      });
    } else {
      setLoadingpedido(true);
      // Preparando os dados no formato correto para application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('produto_id', product.id);
      params.append('quantidade', quantity);
      params.append('tipo', 'normal');

      // Verificando se temos todos os dados necessários
      console.log('Dados do pedido normal:', {
        produto_id: product.id,
        quantidade: quantity,
        tipo: 'normal'
      });

      // Usando o endpoint correto conforme a documentação
      api.post('/pedidos/criar', params, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        console.log('Resposta do pedido normal:', res.data);
        toast({
          title: "✨ Sucesso!",
          description: "Pedido enviado com sucesso! 🚀",
        });
      }).catch(err => {
        console.error('Erro ao processar pedido normal:', err.response?.data || err.message);
        const msg = err?.userMessage || err?.response?.data?.detail || err?.message || "Ocorreu um erro ao processar o pedido";
        toast({ title: "😢 Erro", description: msg });
      }).finally(() => setLoadingpedido(false));
    }
  }
  function Comprar() {
    if(isMyProduct) {
      toast({
        title: "SkyVenda",
        description: "Não pode comprar o seu Produto!",
      });
    } else {
      setBuyLoading(true)
      // Preparando os dados no formato correto para application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('produto_id', product.id);
      params.append('quantidade', quantity);
      params.append('tipo', 'skywallet');

      // Verificando se temos todos os dados necessários
      console.log('Dados do pedido skywallet:', {
        produto_id: product.id,
        quantidade: quantity,
        tipo: 'skywallet'
      });

      // Usando o endpoint correto conforme a documentação
      api.post('/pedidos/criar', params, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        console.log('Resposta do pedido skywallet:', res.data);
        toast({
          title: "✨ Sucesso!",
          description: "Pedido enviado com sucesso! 🚀",
        });
      }).catch(async err => {
        console.error('Erro ao processar pedido skywallet:', err.response?.data || err.message);
        const detail = err?.response?.data?.detail || '';
        // Se o backend exigir PIN, abrir fluxo de PIN
        if (err.response?.status === 400 && String(detail).toLowerCase().includes('pin')) {
          await handlePinAndRetryPurchase(params);
        } else {
          const msg = err?.userMessage || detail || err?.message || "Ocorreu um erro ao processar o pedido";
          toast({ title: "😢 Erro", description: msg });
        }
      }).finally(() => setBuyLoading(false));
    }
  }

  // Abre modal para configurar/fornecer PIN e reenvia a compra
  const handlePinAndRetryPurchase = async (baseParams) => {
    try {
      // Buscar configuração atual do PIN
      const cfg = await api.get(`/pin/configuracao`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.data).catch(() => ({ pin_ativo: false }));

      setPendingParams(baseParams);
      if (!cfg?.pin_ativo) {
        setPinModalMode('setup');
        setPinModalOpen(true);
      } else {
        setPinModalMode('confirm');
        setPinModalOpen(true);
      }
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao obter configuração de PIN' });
    }
  }

  const handlePinModalSubmit = async (pin) => {
    try {
      setPinLoading(true);
      // Se o modo for setup primeiro configuramos o PIN e depois pedimos confirmação
      if (pinModalMode === 'setup') {
        await api.post(`/pin/configurar`, {
          pin,
          pin_ativo: true,
          requer_pin_transferencia: true,
          requer_pin_visualizacao: false,
          valor_minimo_pin: 0
        }, { headers: { Authorization: `Bearer ${token}` }});
        // Agora solicitar o PIN novamente para confirmar compra
        setPinModalMode('confirm');
        setPinLoading(false);
        return; // mantém modal aberto para confirmar
      }

      // Modo confirm: reenviar compra com PIN
      const retry = new URLSearchParams(pendingParams);
      retry.set('pin', pin);
      await api.post('/pedidos/criar', retry, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setPinModalOpen(false);
      toast({ title: 'Pedido enviado com sucesso!' });
    } catch (e) {
      const msg = e?.userMessage || e?.message || 'Não foi possível concluir com PIN';
      toast({ title: 'Erro', description: msg });
    } finally {
      setPinLoading(false);
    }
  }

  if (loading2) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold">Produto não encontrado</p>
          <p className="text-sm mt-1">Tente voltar e abrir novamente.</p>
        </div>
      </div>
    );
  }


  const sanitizedHTML = DOMPurify.sanitize(product?.details || '');
  const galleryImages = getGalleryImages();
  

  const handleToggle = () => {
    if (isCommentsOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsCommentsOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsCommentsOpen(true);
    }
  };
  const handleComment=(text)=>{
    if(!isAuthenticated){
      toast({
        title:"Voce nao pode comentar, faz login"
      })
      return
    }
    if(!text || !text.trim()){
      return;
    }
    setIsCommenting(true)
    const formData = new FormData(); 
    formData.append('produto_slug', product.slug);
    formData.append('conteudo',text);
    const newComment = {
      id: Math.random(), 
      text: text,
      date: "agora mesmo", 
      user: {
        id: user?.id,
        name: user?.name || user?.username,
        username: user?.username,
        avatar: user?.perfil || 'avatar.png',
      },
    };
    api.post(`/comentarios/`, formData,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        }).then(res=>{
          setProduct((prevProduct) => ({
            ...prevProduct,
            comments: [...(prevProduct.comments || []), newComment],
          }));
          setComment('')
        }).finally(async()=>{
          // Keep endpoint consistent with detalhe
          const response = await api.get(`/produtos/detalhe/${slug}?user_id=${user?.id || 0}`);
          const norm = normalizeProduct(response.data);
          setIsMyProduct(norm?.user?.id === user?.id);
          setProduct(norm);
          addOrUpdateProduto(norm);
          setIsCommenting(false)
        });
  }

  
  

  return (
    <div className="fixed inset-0  lg:static overflow-y-scroll max_z_index_2xl md:z-50">
      <PinModal
        open={pinModalOpen}
        mode={pinModalMode}
        loading={pinLoading}
        onClose={() => setPinModalOpen(false)}
        onSubmit={handlePinModalSubmit}
      />
      <div className="max-w-[1440px] mx-auto lg:px-0 sm:w-full">
        <div className="flex flex-col lg:flex-row gap-0 relative ">
          <div className="flex-1 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 pb-8 lg:h-[calc(100vh-4rem)] lg:p-12">
              {/* Gallery Section with Mobile Header */}
              <div className="relative rounded-lg bg-white shadow-sm lg:p-6 lg:h-[calc(100vh-100px)]">
                {/* Mobile Header */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent
                  px-4 py-3 flex justify-between items-center">
                  <button 
                    onClick={() => router.back()} 
                    className="p-2 hover:bg-white/10 rounded-full text-white"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-white'} hover:bg-white/10`}
                    >
                      <Heart className={isLiked ? 'fill-current' : ''} />
                    </button>
                    <button 
                      className="p-2 hover:bg-white/10 rounded-full text-white"
                    >
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Gallery */}
                <div className="relative overflow-hidden lg:rounded-lg">
                  {galleryImages.length > 0 && (
                    <div className="w-full h-[calc(100vw)] max-h-[450px] min-h-[300px] lg:h-[calc(100vh-400px)] relative">
                      <img
                        src={resolveImageUrl(galleryImages[currentImage])}
                        onError={(e) => e.target.src = `${base_url}/default.png`}
                        alt={`Product image ${currentImage + 1}`}
                        className="w-full h-full object-cover lg:object-cover"
                      />
                      {/* Gradiente escuro na parte inferior (apenas mobile) */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
                    </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Image Indicators - Moved above the gradient */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {galleryImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImage(index)}
                            className={`w-1.5 h-1.5 rounded-full border transition-all ${
                              currentImage === index 
                                ? 'bg-white w-4' 
                                : 'bg-white/60 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Desktop Thumbnails */}
                <div className="hidden lg:flex mt-4 gap-2 overflow-x-auto pb-2">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`flex-none ${
                        currentImage === index ? 'ring-2 ring-indigo-600' : ''
                      }`}
                    >
                      <img
                        src={resolveImageUrl(image)}
                        onError={(e) => e.target.src = `${base_url}/default.png`}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </button>
                  ))}
                </div>

                

                {/* Desktop Related Products (hidden on mobile) */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-4 py-4 border-t border-gray-100 mt-4">
                    <span className="font-semibold text-gray-700">Relacionados</span>
                  </div>
                  

                  <div className="mt-4 overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-min">
                      {isloading ? (
                        Array(2).fill(0).map((_, index) => (
                          <div 
                            key={index}
                            className="flex-none w-[180px] h-[80px] bg-white rounded-lg overflow-hidden shadow-sm flex animate-pulse"
                          >
                            <div className="w-[80px] h-[80px] bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 p-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        ))
                      ) : (
                        relacionados.map((produto) => (
                          <div 
                            key={produto.id} 
                            onClick={() => router.push(`/product/${produto.slug}`)}
                            className="flex-none w-[180px] h-[80px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex"
                          >
                            <div className="w-[80px] h-[80px] flex-shrink-0">
                              <img
                                src={resolveImageUrl(produto.thumb)}
                                onError={(e) => e.target.src = `${base_url}/default.png`}
                                alt={produto.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-2 overflow-hidden">
                              <h3 className="font-medium text-gray-800 text-sm truncate">{produto.title}</h3>
                              <span className="text-xs text-gray-500">{produto.province}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="bg-white lg:space-y-6 relative  lg:h-[calc(100vh-4rem)] lg:overflow-y-auto   lg:rounded-lg">
                <div className="bg-white absolute -top-3 h-4 w-full rounded-t-2xl lg:hidden">

                </div>
                <div className="lg:shadow-sm p-6  pb-2 pt-3 rounded-t-xl">
                  <div className="flex justify-between items-start ">
                    <div>
                      <h1 className="text-xl font-bold text-gray-800">{product?.title}</h1>
                      {product?.state === 'novo' && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          Novo
                        </span>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm lg:text-base">
                        <MapPin className="w-4 h-4" />
                        <span>{product?.province}</span>
                      </div>


                    </div>
                    <div className="text-right whitespace-nowrap">
                      <p className="text-xl font-bold text-blue-600 truncate">{product?.price} MZN</p>
                      <p className="text-gray-500 text-sm mt-1 truncate">Publicado {product?.time}</p>
                    </div>

                  </div>
                </div>

                {/* Viws,Likes and Comments Section */}
                <div className="px-6">
                <div className="flex justify-between">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 p-2 px-5 rounded-full ${
                      isLiked 
                        ? 'bg-red-50 text-red-500' 
                        : 'bg-gray-50 text-gray-600'
                    } hover:bg-opacity-75 transition-colors`}
                  >
                    <Heart className={isLiked ? 'fill-current' : ''} />
                    <span>{likesCount}</span>
                  </button>
                  <div className="flex items-center gap-2 p-2 px-5 bg-gray-50 rounded-full">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span>{product?.views}</span>
                  </div>
                  <button
                    onClick={() => handleToggle()}
                    className="flex items-center gap-2 p-2 px-5 bg-gray-50 rounded-full hover:bg-gray-100"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{product?.comments?.length}</span>
                  </button>
                </div>
                {isCommentsOpen && (
                <div className={`overflow-hidden ${isClosing ? 'animate-slide-up' : 'animate-slide-down'}
                 border border-indigo-200 rounded-md px-3 bg-indigo-50`}>
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <span>{product?.comments?.length}</span> Comentários
                    </label>
                    <div className="space-y-3 mb-4 h-[300px] overflow-y-auto pr-2">
                    {product?.comments?.map((comment) => (
                      <div 
                        key={comment?.id}
                        className="bg-indigo-100 rounded-lg p-3 transition-all hover:bg-gray-100 flex items-start"
                      >
                        {/* Foto do perfil */}
                        <div className="w-10 h-10 rounded-full border-2 border-gray-300 overflow-hidden mr-3">
                          <img 
                            src={`${base_url}/perfil/${comment?.user?.avatar}`}
                            onError={(e) => e.target.src = `/avatar.png`}
                            alt={`${comment?.user?.name}'s profile`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Detalhes do comentário */}
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <Link href={`/${comment?.user?.username}`} className="font-semibold text-indigo-800 text-sm hover:underline">{comment?.user?.name}</Link>
                            <span className="text-sm text-gray-500">{comment?.date}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}

                    </div>

                    <div className="relative mt-auto ">
                      <div className="flex items-center gap-2">
                        <input
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder={`Comente o ${product.title}`}
                          className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none outline-none"
                          rows={2}
                        />
                        <button 
                          className="p-2 flex bg-indigo-100 h-10 justify-center relative items-center
                           w-12 text-indigo-800 rounded-lg hover:bg-indigo-200  transition-colors flex-shrink-0"
                          aria-label="Enviar comentário"
                          onClick={()=>handleComment(comment)}
                        >
                          {isCommenting?(
                            <>
                            <div className="w-6 h-6 rounded-full absolute border-4 border-gray-200"></div>
                            <div className="w-6 h-6 rounded-full animate-spin absolute border-4 border-indigo-500 border-t-transparent"></div>
                            </>
                                                ):(
                            <Send className="w-5 h-5" />
                          )}
                          
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                 )}

                </div>

                {/* Buy Section */}
                <div className="rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Quantidade</span>
                    <div className="flex items-center text-indigo-600 gap-3 bg-indigo-50 rounded-lg p-1 border-indigo-200 border">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white
                         rounded-md transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => Math.min(product?.stock_quantity || 1, q + 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Estoque disponível</span>
                    <span>{product?.stock_quantity} unidades</span>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={Comprar}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {buyloading ? (
                        <>
                          <Loader2 className="animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <span>Comprar Agora</span>
                      )}
                    </button>
                    <button 
                      onClick={fazerPedido} 
                      className="w-full py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {loadingPedido ? (
                        <>
                          <Loader2 className="animate-spin" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Fazer pedido</span>
                        </>
                      )}
                    </button>

                    <div className="">
                      <Link 
                        href="/policies" 
                        className="text-sm  text-indigo-600 underline hover:text-indigo-700"
                      >
                        Ler as políticas de compra no SkyVenda MZ
                      </Link>
                    </div>

                    {isMyProduct && (
                      <div className="flex items-center gap-2 p-3 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-700">
                          Este é o seu produto. Você não pode fazer pedidos em seus próprios produtos.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-7 h-7 text-green-600 font-bold" />
                      <span className="text-sm text-green-600 text-center">Compra Seguro</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-indigo-50 rounded-lg">
                      <Truck className="w-7 h-7 text-indigo-600" />
                      <span className="text-sm text-indigo-600 text-center">Entrega Rápida</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-3 bg-pink-50 rounded-lg">
                      <Package className="w-7 h-7 text-pink-600" />
                      <span className="text-sm text-pink-600 text-center">Qualidade Garantida</span>
                    </div>
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-white lg:rounded-lg shadow-sm p-6 border">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={`${base_url}/perfil/${product?.user?.avatar}`}
                        onError={(e) => e.target.src = '/avatar.png'}
                        alt={product?.user?.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-lg">{product?.user?.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-gray-600">Novo Vendedor</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button onClick={handleToggleFollow} disabled={followLoading || isMyProduct} className={`flex items-center gap-1.5 px-4 py-2 text-white text-sm rounded-lg transition-colors ${isFollowing?'bg-gray-500 hover:bg-gray-600':'bg-blue-500 hover:bg-blue-600'} ${followLoading?'opacity-70 cursor-not-allowed':''}`}>
                        <UserPlus className="w-4 h-4" />
                        {followLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <span>{isFollowing?'Seguindo':'Seguir'}</span>}
                      </button>
                      <button onClick={handleMessageSeller} className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                        <Send className="w-4 h-4" />
                        <span>Mensagem</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                        <Flag className="w-4 h-4" />
                        <span>Denunciar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
                    {product?.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Condição</p>
                      <p className="font-medium mt-1">{product?.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Categoria</p>
                      <p className="font-medium mt-1">{product?.category}</p>
                    </div>
                  </div>

                  {product?.details && (
                    <div className="mt-6">
                      <h2 className="text-xl font-semibold mb-4">Detalhes do Produto</h2>
                      <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Related Products (after buy section) */}
                <div className="lg:hidden mt-6 bg-white p-4 rounded-lg shadow-sm">
                  <h2 className="font-semibold text-gray-800 mb-4">Produtos Relacionados</h2>
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 min-w-min pb-2">
                      {isloading ? (
                        Array(2).fill(0).map((_, index) => (
                          <div 
                            key={index}
                            className="flex-none w-[180px] h-[80px] bg-white rounded-lg overflow-hidden shadow-sm flex animate-pulse"
                          >
                            <div className="w-[80px] h-[80px] bg-gray-200 flex-shrink-0" />
                            <div className="flex-1 p-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        ))
                      ) : (
                        relacionados.map((produto) => (
                          <div 
                            key={produto.id} 
                            onClick={() => router.push(`/product/${produto.slug}`)}
                            className="flex-none w-[180px] h-[80px] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex"
                          >
                            <div className="w-[80px] h-[80px] flex-shrink-0">
                              <img
                                src={base_url+produto.thumb}
                                onError={(e) => e.target.src = `${base_url}/default.png`}
                                alt={produto.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-2 overflow-hidden">
                              <h3 className="font-medium text-gray-800 text-sm truncate">{produto.title}</h3>
                              <span className="text-xs text-gray-500">{produto.province}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only Related Products/Ads Section */}
            <div className="lg:hidden mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Produtos Relacionados</h2>
              <div className="space-y-4">
                <AdsColumn ads={ads}/>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Fixed */}
          <div className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="fixed top-16 right-0 w-[300px] h-[calc(100vh-4rem)] bg-white shadow-lg overflow-y-auto">
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 mb-4">Patrocinados</h2>
                <div className="space-y-4">
                  <AdsColumn ads={ads}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Dialog */}
      {isAuthenticated ? (
        <></>
      ) : (
        <p className="text-center mt-4 text-gray-600">Por favor, faça login para interagir</p>
      )}
    </div>
  );
}