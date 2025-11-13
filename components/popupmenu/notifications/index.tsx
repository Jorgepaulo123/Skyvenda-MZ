import { useEffect, useState } from 'react';
import { Bell, MoreVertical, Check, Trash2, Heart, MessageSquare, UserPlus, ShoppingBag, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// @ts-ignore - Importando o hook useAuth do contexto de autenticação
import { useAuth } from '../../../context/AuthContext';
// @ts-ignore - Importando o hook useWebSocket do contexto de WebSocket
import { useWebSocket } from '../../../context/websoketContext';

// Interface para uma notificação individual
interface Notification {
  id: number;
  mensagem: string;
  data: string;
  estado: string;
  aberta: boolean;
  lida: boolean;
  tipo: string | null;
  referencia_id: number | null;
  referencia_tipo: string | null;
  url_destino: string | null;
  icone: string | null;
}

// Interface para a resposta completa da API
interface NotificationsResponse {
  pagina: {
    atual: number;
    total: number;
    por_pagina: number;
    total_itens: number;
  };
  filtros: {
    tipo: string | null;
    estado: string | null;
    referencia_tipo: string | null;
    ordem: string;
  };
  estatisticas: {
    total: number;
    nao_lidas: number;
    por_estado: Record<string, number>;
  };
  notificacoes: Notification[];
}

interface NotificationsProps {
  onClose?: () => void;
}

export function Notifications({ onClose }: NotificationsProps) {
  const router = useRouter();
  const { token } = useAuth();
  const { setNewNotification } = (useWebSocket() as any) || {};
  const [notificacoes, setNotificacoes] = useState<Notification[]>([]);
  const [notificacoesFiltradas, setNotificacoesFiltradas] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<'todas' | 'nao_lidas'>('todas');
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [processando, setProcessando] = useState<number | null>(null);
  const [estatisticas, setEstatisticas] = useState<{total: number, nao_lidas: number}>({total: 0, nao_lidas: 0});

  // Função para buscar notificações
  const fetchNotificacoes = async () => {
    if (!token) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.get<NotificationsResponse>(
        'https://skyvendas-production.up.railway.app/usuario/notificacoes/?page=1&per_page=20&ordem=desc&marcar_como_abertas=true', 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Extrair as notificações da resposta
      const { notificacoes, estatisticas } = response.data;
      
      setNotificacoes(notificacoes);
      setEstatisticas({
        total: estatisticas.total,
        nao_lidas: estatisticas.nao_lidas
      });
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError('Erro ao carregar notificações');
      setLoading(false);
    }
  };
  
  // Aplicar filtro às notificações
  useEffect(() => {
    if (filtro === 'todas') {
      setNotificacoesFiltradas(notificacoes);
    } else {
      setNotificacoesFiltradas(notificacoes.filter(n => !n.lida));
    }
  }, [notificacoes, filtro]);

  // Função para obter o ícone correto com base no tipo de notificação
  const getIconForNotificationType = (tipo: string | null) => {
    if (!tipo) return <AlertCircle className="w-6 h-6 text-indigo-500" />;
    
    switch (tipo) {
      case 'like_produto':
      case 'like_publicacao':
        return <Heart className="w-6 h-6 text-red-500" />;
      case 'comentario_produto':
      case 'comentario_publicacao':
      case 'resposta_publicacao':
        return <MessageSquare className="w-6 h-6 text-indigo-500" />;
      case 'seguidor':
        return <UserPlus className="w-6 h-6 text-green-500" />;
      case 'pedido':
      case 'pedido_aceito':
      case 'pedido_recusado':
      case 'pedido_entregue':
      case 'pedido_concluido':
        return <ShoppingBag className="w-6 h-6 text-amber-500" />;
      case 'sistema':
      default:
        return <AlertCircle className="w-6 h-6 text-indigo-500" />;
    }
  };

  // Função para navegar para a URL de destino da notificação
  const navegarParaDestino = (notificacao: Notification) => {
    // Marcar como lida antes de navegar
    marcarComoLida(notificacao.id);
    // Navegar para a URL de destino
    if (notificacao.url_destino) {
      router.push(notificacao.url_destino);
    }
    // Fechar o menu de notificações
    if (onClose) onClose();
  };

  // Função para marcar notificação como lida
  const marcarComoLida = async (id: number) => {
    // Evita processar a mesma notificação mais de uma vez
    if (processando === id) return;
    
    // Verifica se o usuário está autenticado
    if (!token) {
      console.error('Usuário não autenticado');
      return;
    }
    
    try {
      setProcessando(id);
      setMenuAberto(null); // Fecha o menu de opções
      
      const response = await axios.put(
        `https://skyvendas-production.up.railway.app/usuario/notificacoes/${id}/ler`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Atualiza a lista de notificações após marcar como lida
      if (response.status === 200) {
        // Atualiza a notificação na lista
        setNotificacoes(prevNotificacoes => 
          prevNotificacoes.map(notificacao => 
            notificacao.id === id ? { 
              ...notificacao, 
              estado: 'lida',
              lida: true,
              aberta: true
            } : notificacao
          )
        );
        
        // Atualiza as estatísticas
        setEstatisticas(prev => ({
          ...prev,
          nao_lidas: Math.max(0, prev.nao_lidas - 1)
        }));
      }
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
    } finally {
      setProcessando(null);
    }
  };

  // Função para desativar (eliminar) notificação
  const eliminarNotificacao = async (id: number) => {
    // Evita processar a mesma notificação mais de uma vez
    if (processando === id) return;
    
    // Verifica se o usuário está autenticado
    if (!token) {
      console.error('Usuário não autenticado');
      return;
    }
    
    try {
      setProcessando(id);
      setMenuAberto(null); // Fecha o menu de opções
      
      const response = await axios.put(
        `https://skyvendas-production.up.railway.app/usuario/notificacoes/${id}/desativar`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Remove a notificação da lista após desativar
      if (response.status === 200) {
        // Verifica se a notificação que está sendo desativada não estava lida
        const notificacao = notificacoes.find(n => n.id === id);
        const eraLida = notificacao?.lida || notificacao?.estado === 'lida';
        
        // Remove a notificação da lista
        setNotificacoes(prevNotificacoes => 
          prevNotificacoes.filter(notificacao => notificacao.id !== id)
        );
        
        // Atualiza as estatísticas
        setEstatisticas(prev => ({
          total: prev.total - 1,
          nao_lidas: eraLida ? prev.nao_lidas : Math.max(0, prev.nao_lidas - 1)
        }));
      }
    } catch (err) {
      console.error('Erro ao eliminar notificação:', err);
    } finally {
      setProcessando(null);
    }
  };
  
  useEffect(() => {
    fetchNotificacoes();
    
    // Resetar a contagem de notificações quando abrir o menu
    if (setNewNotification) setNewNotification(0);
    
    // Adicionar listener para novas notificações via WebSocket
    const handleNewNotification = (event: CustomEvent) => {
      const newNotification = event.detail;
      console.log('Nova notificação recebida via WebSocket:', newNotification);
      
      // Adicionar a nova notificação à lista
      if (newNotification && newNotification.data) {
        const notificacaoFormatada: Notification = {
          id: newNotification.data.id,
          mensagem: newNotification.message,
          data: newNotification.data.data,
          estado: newNotification.data.estado || 'nao_lida',
          aberta: newNotification.data.aberta || false,
          lida: newNotification.data.lida || false,
          tipo: newNotification.data.tipo,
          referencia_id: newNotification.data.referencia_id,
          referencia_tipo: newNotification.data.referencia_tipo,
          url_destino: newNotification.data.url_destino,
          icone: newNotification.data.icone
        };
        
        setNotificacoes(prev => [notificacaoFormatada, ...prev]);
        
        // Atualizar as estatísticas
        setEstatisticas(prev => ({
          total: prev.total + 1,
          nao_lidas: prev.nao_lidas + 1
        }));
      }
    };
    
    // Registrar o listener para o evento personalizado
    window.addEventListener('new-notification', handleNewNotification as EventListener);
    
    // Limpar o listener ao desmontar o componente
    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener);
    };
  }, []);

  return (
    <div className="absolute right-0 mt-2 w-96 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transform origin-top-right transition-all duration-200 animate-fadeIn z-50">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 py-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Notificações</h3>
          </div>
          <span className="bg-white bg-opacity-20 text-white text-xs font-medium px-2 py-1 rounded-full">
            {estatisticas.nao_lidas} novas
          </span>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="flex border-b border-gray-100">
        <button 
          className={`flex-1 py-2 text-sm font-medium ${filtro === 'todas' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setFiltro('todas')}
        >
          Tudo
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium ${filtro === 'nao_lidas' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setFiltro('nao_lidas')}
        >
          Não lida(s)
        </button>
      </div>
      <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Carregando notificações...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notificacoesFiltradas.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {filtro === 'todas' ? 'Nenhuma notificação encontrada' : 'Nenhuma notificação não lida'}
          </div>
        ) : (
          notificacoesFiltradas.map(notificacao => (
            <div 
              key={notificacao.id} 
              className="flex items-start gap-4 p-4 hover:bg-indigo-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 relative group cursor-pointer"
              onClick={() => navegarParaDestino(notificacao)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  {getIconForNotificationType(notificacao.tipo)}
                </div>
                {!notificacao.lida && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">{notificacao.mensagem}</p>
                <span className="text-xs text-indigo-600 font-medium mt-1 block">
                  {new Date(notificacao.data).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {notificacao.url_destino && (
                  <span className="text-xs text-gray-500 mt-1 block truncate">
                    Clique para visualizar
                  </span>
                )}
              </div>
              
              {/* Três pontinhos e menu de opções */}
              <div className="relative">
                <button 
                  className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique propague para o elemento pai
                    setMenuAberto(menuAberto === notificacao.id ? null : notificacao.id);
                  }}
                >
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                
                {menuAberto === notificacao.id && (
                  <div 
                    className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-md border border-gray-100 py-1 w-36 z-10"
                    onClick={(e) => e.stopPropagation()} // Impede que o clique propague para o elemento pai
                  >
                    {!notificacao.lida && (
                      <button 
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoLida(notificacao.id);
                          if (onClose) setTimeout(onClose, 500);
                        }}
                        disabled={processando === notificacao.id}
                      >
                        <Check className="w-4 h-4 text-indigo-500" />
                        Marcar como lida
                      </button>
                    )}
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarNotificacao(notificacao.id);
                      }}
                      disabled={processando === notificacao.id}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
              
              {/* Indicador de processamento */}
              {processando === notificacao.id && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-gray-50">
        <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
          Ver todas as notificações
        </button>
      </div>
    </div>
  );
}