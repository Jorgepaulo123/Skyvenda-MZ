"use client";
import { ClipboardList, DotSquare, Eye, Grid, Heart, Info, Kanban, Loader, Megaphone, MessageCircle, MoreHorizontal, Settings, User2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';
import { HomeContext } from '../../context/HomeContext';
import { base_url } from '../../api/api';

export default function Profile() {
    const [hasProfile,setHasProfile]=useState(false);
    const [isMyProfile,setIsMyProfile]=useState(false);
    const [userProfile,setUserProfile]=useState("")
    const [tabSelected,setTabSelected]=useState('products')
    const {user,token}=useAuth()
    const [username, setUsername] = useState(null);
    const [loading,setLoading]=useState(true)
    const { myproducts, addProducts } = useContext(HomeContext);
    const [products,setProducts]=useState([])
    const [loadingProducts,setLoadingproducts]=useState(true)
    const [isPublic,setIsPublic]=useState(false)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [openAvatarMenu,setOpenAvatarMenu]=useState(false);
    const [fileImage, setFileImage] = useState(null);
    const [message, setMessage] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading,setUploading]=useState(false)

    const handleMouseMove = (e) => {
        setTooltipPosition({
        x: e.clientX + 10, // Offset by 10px to not overlap with cursor
        y: e.clientY + 10
        });
    };
  
    
    useEffect(()=>{
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        // Determine username and profile context
        if (user?.username) {
            setUsername(user.username);
            setLoading(false)
            setHasProfile(true)
            setIsMyProfile(true)
            setUserProfile(user)
        }

        if (user?.perfil) {
            setPreviewImage(`${user.perfil}`);
          }
          
    },[user])

    useEffect(()=>{
        if(!username) return;
        api.get(`/usuario/${username}/produtos`).then(res=>{
            setProducts(res.data.produtos)
            setLoadingproducts(false)
        }).catch(()=> setLoadingproducts(false))
    },[username])

    // Local tab state only (no router path dependency)
    
    useEffect(() => {
        if (!token && myproducts) return;
        if(myproducts?.length>=1){
          setLoadingproducts(false)
        }else{
          api.get(`/produtos/produtos/?skip=0&limit=20`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            addProducts(Array.isArray(res.data.produtos) ? res.data.produtos : []);
            console.log(res.data)
          })
          .catch((err) => {
            console.error('Erro ao buscar produtos:', err);
            addProducts([]);
          })
          .finally(() => setLoadingproducts(false));
        }
    
        
    }, [token]);


    const AvatarMenu=()=>{
        return (
        <div className="flex justify-center items-center w-full h-[100vh] z-[99999999999] bg-black/40 fixed top-0 left-0">
            <div className="w-[450px] bg-white rounded-xl flex flex-col">
                <div className="flex flex-col items-center gap-1 border-b py-4 flex-1">
                    <img 
                        src={previewImage} 
                        className='w-[60px] h-[60px] rounded-full border'
                        />
                    <span>{userProfile.name}</span>
                    <span className='text-gray-400 text-xs'>usuario da skyvenda mz</span>
                </div>
                <div className="flex items-center justify-center p-4 font-bold text-indigo-400 border-b cursor-pointer">
                    <label className="cursor-pointer">
                        Carregar foto
                        <input type="file" accept="image/*" className="hidden" 
                        onChange={(e) => {
                            const file = e.target.files[0]; // Pegando o arquivo diretamente
                            setFileImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                            setOpenAvatarMenu(false);
                            setUploading(true);
                        
                            const formData = new FormData();
                            const token = localStorage.getItem('auth_token');
                            formData.append('file', file); // Usando o arquivo diretamente
                        
                            api.put('/info_usuario/perfil', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': `Bearer ${token}`,
                                    'accept': 'application/json',
                                },
                            })
                            .then(res => {
                                setMessage('Imagem atualizada com sucesso!');
                                setFileImage(null);
                            })
                            .catch(err => {
                                setMessage('Erro ao atualizar a imagem. Tente novamente.');
                                console.error(err);
                            })
                            .finally(() => {
                                setUploading(false);
                            });
                        }}
                        />
                    </label>
                </div>
                <div className="flex items-center justify-center p-4  text-gray-600 relative border-b">
                    Adicionar uma mensagem
                </div>
                <div className="flex items-center justify-center p-4 font-bold text-red-400 border-b">
                    Remover a foto atual
                </div>
                <div className="flex items-center justify-center p-4 text-gray-600 " onClick={()=>setOpenAvatarMenu(false)}>
                    Cancer
                </div>

            </div>
        </div>
    )}


  return (
    <div className='w-full min-h-screen md:p-10 '>
        
        <div className="container mx-auto">
            {!hasProfile && !loading ? (
            <div className="flex items-center justify-center min-h-screen flex-col gap-2">
                <div className="flex justify-center items-center p-5 bg-gray-200 rounded-full">
                    <Info className="text-gray-900" />
                </div>
                <h1 className="text-2xl font-semibold">Perfil não está disponível</h1>
                <p>A ligação pode não estar a funcionar ou o perfil pode ter sido removido.</p>
                <Link 
                    href="/" 
                    className="py-3 px-4 bg-indigo-400 rounded-md hover:bg-indigo-600 text-white font-semibold"
                >
                    Ver mais na SkyVenda MZ
                </Link>
            </div>
                ) : !loading && hasProfile ? (
                    <>
                        {isMyProfile ?(
                            <div className="container min-h-screen  lg:px-[140px] pb-[100px]">
                            <div className="w-full">
                                <div className="flex gap-4 flex-1 ">
                                    {/* area do avatar */}
                                    <div 
                                        className="flex flex-col md:w-[282px] md:h-[182px] items-center justify-center relative"
                                        
                                    >
                                        <div className="absolute -z-10 md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400" />
                                        {uploading && (
                                            <div className="absolute z-10 md:w-[155px] md:h-[155px] rounded-full bg-black/20 flex items-center justify-center">
                                            <Loader className='animate-spin text-white'/>
                                             </div>
                                        )}
                                        
                                        <img 
                                            src={previewImage}
                                            className="rounded-full border md:w-[150px] md:h-[150px]"
                                            alt="Profile"
                                            onMouseMove={handleMouseMove}
                                            onMouseEnter={() => setShowTooltip(true)}
                                            onMouseLeave={() => setShowTooltip(false)}
                                            onClick={()=>setOpenAvatarMenu(true)}
                                            />

                                        {showTooltip && (
                                        <div
                                            className="fixed z-50 bg-black text-white px-3 py-1 rounded-md  pointer-events-none text-xs"
                                            style={{
                                            left: `${tooltipPosition.x}px`,
                                            top: `${tooltipPosition.y}px`,
                                            }}
                                        >
                                            Mudar a foto do perfil
                                        </div>
                                        )}
                                    </div>

                                    {/* area das opcoes e informacoes */}
                                    <div className="w-full space-y-2 ">
                                        <div className="flex py-2 md:h-[40px] gap-4 items-center flex-1 ">
                                            <span className='text-2xl'>{userProfile.username}</span>
                                            <Link href={'/accounts/edit'} className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>Editar Perfil</Link>
                                            <button className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>Ver Publicaoes</button>
                                            <button>
                                                <Settings className='hover:animate-spin'/>
                                            </button>
                                        </div>

                                        <div className="flex py-2 md:h-[40px] gap-4 items-center flex-1 ">
                                            <span><span className='font-bold'>{userProfile.total_produtos}</span> publicacoes</span>
                                            <span><span className='font-bold'>{userProfile.total_seguidores}</span> segudores</span>
                                            <span><span className='font-bold'>{userProfile.total_seguindo || 0}</span> A seguir</span>
                                        </div>
                                        <div className="">
                                            <p className='font-bold text-2xl'>{userProfile.name}</p>
                                            <p>{userProfile.email}</p>
                                        </div>
                                    </div>

                                </div>
                                <div className="flex h-[1px] bg-gray-300 mt-10 "></div>
                                {/* tabs */}
                                <div className="flex-1 gap-4">
                                    <div className="flex gap-8 justify-center items-center">
                                    <button onClick={()=>setTabSelected('products')} className={`uppercase transition-all duration-300 gap-2 py-3 flex text-gray-500 ${tabSelected==='products' && "font-bold text-gray-900 border-t-2  border-t-gray-900 "}`}><Grid/>Produtos</button>
                                    <button onClick={()=>setTabSelected('orders')} className={`uppercase transition-all duration-100 gap-2 py-3 flex text-gray-500 ${tabSelected==='orders' && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><ClipboardList/>Pedidos</button>
                                    <button onClick={()=>setTabSelected('friends')} className={`uppercase transition-all duration-100 gap-2 py-3 flex text-gray-500 ${tabSelected==='friends' && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><User2/>Amigos</button>
                                    <button onClick={()=>setTabSelected('ads')} className={`uppercase transition-all duration-100  gap-2 py-3 flex text-gray-500 ${tabSelected==='ads' && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><Megaphone/>Anúncios</button>
                                    </div>
                                    {/* tabs content body */}
                                    <div className="flex-1">
                                        {tabSelected==='products' &&(
                                            <div className="grid grid-cols-3 gap-4">
                                                {loadingProducts ?(
                                                <>
                                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                                        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                                                        <div className="aspect-square bg-gray-200"></div>
                                                        <div className="p-4 space-y-3">
                                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                        </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ):(
                                               <>
                                                {myproducts.length>=1 ?(
                                                    <>
                                                        {myproducts.map((product, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-white border flex items-center justify-center aspect-square rounded-md relative group overflow-hidden shadow-xm hover:shadow-lg transition-shadow"
                                                    >
                                                        <img
                                                        src={`${base_url}/produto/${product.thumb}`}
                                                        onError={(e) => (e.target.src = `${base_url}/default.png`)}
                                                        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="flex font-bold text-white gap-4 text-sm md:text-base">
                                                            <div className="flex items-center gap-1">
                                                            <Heart /> {product?.likes || 0}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                            <Eye /> {product?.views || 0}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                            <MessageCircle /> {product?.comments?.length || 0}
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                    </>
                                                ):(
                                                    <div className="g">
                                                        ainda nao tem produtos
                                                    </div>
                                                )}

                                               </> 
                                            )}
                                            </div> 
                                        )}
                                        {tabSelected==='orders'&&(
                                            <div className="p-4 text-gray-600">Pedidos em breve</div>
                                        )}
                                    </div>
                                </div>

                            </div>

                        </div> 

                        ):(
                            <>
                            {/* perfil publico */}
                           <div className="container min-h-screen  lg:px-[140px] pb-[100px]">
                                <div className="w-full">
                                    <div className="flex gap-4 flex-1 ">
                                        {/* area do avatar */}
                                        <div className="flex flex-col md:w-[282px] md:h-[182px] items-center justify-center relative">
                                        <div className="absolute -z-10 md:w-[155px] md:h-[155px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400" />

                                            <img 
                                            src={`${userProfile?.perfil}`}
                                            className='rounded-full border md:w-[150px] md:h-[150px]'/>
                                        </div>

                                        {/* area das opcoes e informacoes */}
                                        <div className="w-full space-y-2 ">

                                            <div className="flex py-1 md:h-[40px] gap-4 items-center flex-1 ">
                                                <span className='text-2xl'>{userProfile.username}</span>
                                                <button className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>Seguir</button>
                                                <button className='bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300'>Envier Mensagem</button>
                                                <button>
                                                    {/* <Kanban/> */}
                                                    <MoreHorizontal/>
                                                </button>
                                            </div>

                                            <div className="flex py-2 md:h-[40px] gap-4 items-center flex-1 ">
                                                <span><span className='font-bold'>{userProfile.total_produtos}</span> publicacoes</span>
                                                <span><span className='font-bold'>{userProfile.total_seguidores}</span> segudores</span>
                                                <span><span className='font-bold'>{userProfile.total_seguidores}</span> A seguir</span>
                                            </div>
                                            <div className="">
                                                <p className='font-bold text-2xl'>{userProfile.name}</p>
                                                <p>{userProfile.email}</p>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="flex h-[1px] bg-gray-300 mt-10 "></div>
                                    {/* tabs */}
                                    <div className="flex-1 gap-4">
                                        <div className="flex gap-8 justify-center items-center">
                                        <button onClick={()=>setTabSelected('products')} className={`uppercase transition-all duration-300 gap-2 py-3 flex text-gray-500 ${tabSelected==='products' && "font-bold text-gray-900 border-t-2  border-t-gray-900 "}`}><Grid/>Produtos</button>
                                        <button onClick={()=>setTabSelected('friends')} className={`uppercase transition-all duration-100 gap-2 py-3 flex text-gray-500 ${tabSelected==='friends' && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><User2/>Amigos</button>
                                        <button onClick={()=>setTabSelected('ads')} className={`uppercase transition-all duration-100  gap-2 py-3 flex text-gray-500 ${tabSelected==='ads' && "font-bold text-gray-900 border-t-2  border-t-gray-900"}`}><Megaphone/>Anúncios</button>
                                        </div>
                                        {/* tabs content body */}
                                        <div className="flex-1">
                                            {tabSelected==='products' &&(
                                                <div className="grid grid-cols-3 gap-4">
                                                    {loadingProducts ?(
                                                    <>
                                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                                            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                                                            <div className="aspect-square bg-gray-200"></div>
                                                            <div className="p-4 space-y-3">
                                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                            </div>
                                                            </div>
                                                        ))}
                                                    </>
                                                ):(
                                                   <>
                                                    {products.length>=1 ?(
                                                        <>
                                                        {products.map((product, i) => (
                                                            <div
                                                                key={i}
                                                                className="bg-white border flex items-center justify-center aspect-square rounded-md relative group overflow-hidden shadow-xm hover:shadow-lg transition-shadow"
                                                            >
                                                                <img
                                                                src={`${base_url}/produto/${product.thumb}`}
                                                                onError={(e) => (e.target.src = `${base_url}/default.png`)}
                                                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <div className="flex font-bold text-white gap-4 text-sm md:text-base">
                                                                    <div className="flex items-center gap-1">
                                                                    <Heart /> {product?.likes || 0}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                    <Eye /> {product?.views || 0}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                    <MessageCircle /> {product?.comments?.length || 0}
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                            </>
                                                        ):(
                                                            <div className="g">

                                                                ainda nao tem produtos

                                                            </div>
                                                        )}

                                                   </> 
                                                )}
                                                </div> 
                                            )}
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {/* perfil publico */}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center min-h-screen">
                        <p className="text-lg text-gray-500">🔄 Carregando...</p>
                    </div>
                )}

        </div>
        {openAvatarMenu&& <AvatarMenu/>}

    </div>
  )
}
