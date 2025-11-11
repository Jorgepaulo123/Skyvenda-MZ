import { DollarSign, Package, CreditCard, ArrowDownLeft, ArrowUpRight, History, Calendar, Wallet, BanknoteIcon, ShoppingBag, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function OverviewPage() {
  const [activeTab, setActiveTab] = useState('todos');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState({
    id: null,
    identificador_unico: null,
    saldo_principal: 0,
    saldo_congelado: 0,
    bonus: 0
  });
  const [userData, setUserData] = useState({
    username: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          console.error('Token não encontrado');
          setError('Sessão expirada. Por favor, faça login novamente.');
          navigate('/login');
          return;
        }

        console.log('Token encontrado, tentando fazer requisições...');
        
        // Headers de autenticação
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        // Requisição para obter transações
        const transactionsResponse = await axios.get('https://skyvenda-mz.up.railway.app/usuario/transacoes/listar', { headers });
        setTransactions(transactionsResponse.data);
        
        // Requisição para obter dados do cartão
        const cardResponse = await axios.get('https://skyvenda-mz.up.railway.app/usuario/card', { headers });
        setCardData(cardResponse.data);
        
        // Requisição para obter dados do usuário
        const userResponse = await axios.get('https://skyvenda-mz.up.railway.app/usuario/user', { headers });
        setUserData(userResponse.data);
        
        console.log('Dados carregados com sucesso!');
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        
        if (error.response?.status === 401) {
          console.error('Erro 401: Token inválido ou expirado');
          setError('Sessão expirada. Por favor, faça login novamente.');
          localStorage.removeItem('auth_token');
          navigate('/login');
        } else {
          setError(error.response?.data?.detail || 'Erro ao carregar dados. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatValue = (value) => {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Filtrar transações por tipo
  // Entradas (depósitos)
  const depositos = transactions.filter(t => t.tipo === 'entrada');
  // Saídas que não são compras de produtos (levantamentos)
  const levantamentos = transactions.filter(t => t.tipo === 'saida' && (t.referencia||'').toLowerCase().includes('levantamento'));
  // Saídas relacionadas a publicação de anúncios
  const publicacoes = transactions.filter(t => (t.referencia||'').toLowerCase().includes('publicação'));

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'depositos', label: 'Depósitos' },
    { id: 'transacoes', label: 'Levantamentos' },
    { id: 'historico', label: 'Histórico' },
    { id: 'atividades', label: 'Atividades' }
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-skyvenda-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  // Totais reais
  const totalDepositos = depositos.reduce((acc, t)=>acc + Number(t.valor || t.valor_transacao || 0), 0);
  const compras = transactions.filter(t => t.tipo === 'saida' && !(t.referencia||'').toLowerCase().includes('publicação') && !(t.referencia||'').toLowerCase().includes('levantamento'));
  const totalCompras = compras.reduce((acc, t)=>acc + Number(t.valor || t.valor_transacao || 0), 0);
  // Crescimento fictício (poderá ser recalculado se desejar)
  const percentualCrescimento = 0;
  // Quantidade de depósitos feitos hoje
  const hoje = new Date().toDateString();
  const depositosHoje = depositos.filter(d => {
    const data = new Date(d.created_at || d.data || d.timestamp || d.data_transacao || d.updated_at || d.createdAt);
    return data.toDateString() === hoje;
  }).length;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Visão Geral</h1>
      
      <div className="space-y-6">
        {/* Cards Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total de Compras */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <span>Total de Compras</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{formatValue(totalCompras)} MZN</div>
            <div className="text-sm text-green-500">+{percentualCrescimento}% desde último mês</div>
          </div>

          {/* Total de Depósitos */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <span>Total de Depósitos</span>
              <Package className="w-4 h-4 text-skyvenda-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{formatValue(totalDepositos)}</div>
            <div className="text-sm text-skyvenda-500">{depositosHoje} depósitos hoje</div>
          </div>

          {/* SkyWallet Card - Design melhorado */}
          <div className="relative overflow-hidden rounded-2xl" style={{
            background: 'linear-gradient(135deg, rgba(64, 112, 244, 0.9) 0%, rgba(33, 55, 123, 0.8) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Padrão de fundo para efeito visual */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white -mt-16 -mr-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white -mb-10 -ml-10"></div>
            </div>
            
            {/* Conteúdo do cartão */}
            <div className="relative p-6 text-white">
              {/* Logo e título */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">SkyWallet</span>
                </div>
              </div>
              
              {/* Nome do usuário */}
              <div className="text-md font-light opacity-90 mb-5">
                {userData.username || "Utilizador"}
              </div>
              
              {/* Saldo */}
              <div className="text-3xl font-bold mb-3">{formatValue(cardData.saldo_principal)} MZN</div>
              
              {/* ID e detalhes */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm opacity-90">
                  <span>ID: {cardData.identificador_unico || '****'}</span>
                </div>
                <div className="opacity-80">
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="21" cy="10" r="10" fill="rgba(255,255,255,0.8)" fillOpacity="0.8" />
                    <circle cx="10" cy="10" r="10" fill="rgba(255,255,255,0.6)" fillOpacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-[#4070F4] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          <div className="mt-6">
            {activeTab === 'todos' && (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhuma transação encontrada
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.tipo === 'entrada' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.tipo === 'entrada' ? (
                            <BanknoteIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <Wallet className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.referencia}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.data_hora)}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${transaction.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.tipo === 'entrada' ? '+' : '-'}{formatValue(transaction.valor)} MZN
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'depositos' && (
              <div className="space-y-4">
                {depositos.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum depósito encontrado
                  </div>
                ) : (
                  depositos.map((deposito) => (
                    <div key={deposito.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <BanknoteIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Depósito via {deposito.msisdn}</p>
                          <p className="text-sm text-gray-500">{formatDate(deposito.data_hora)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-green-600">+{formatValue(deposito.valor)} MZN</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'transacoes' && (
              <div className="space-y-4">
                {levantamentos.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhum levantamento encontrado
                  </div>
                ) : (
                  levantamentos.map((levantamento) => (
                    <div key={levantamento.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Wallet className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Levantamento via {levantamento.msisdn}</p>
                          <p className="text-sm text-gray-500">{formatDate(levantamento.data_hora)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-red-600">-{formatValue(levantamento.valor)} MZN</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'atividades' && (
              <div className="space-y-4">
                {publicacoes.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhuma publicação encontrada
                  </div>
                ) : (
                  publicacoes.map((publicacao) => (
                    <div key={publicacao.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-skyvenda-500 p-2 rounded-lg">
                          <Store className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{publicacao.referencia}</p>
                          <p className="text-sm text-gray-500">{formatDate(publicacao.data_hora)}</p>
                        </div>
                      </div>
                      <span className="font-medium text-red-600">-{formatValue(publicacao.valor)} MZN</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Nenhuma transação encontrada
                  </div>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{transaction.referencia}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.data_hora)}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${transaction.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.tipo === 'entrada' ? '+' : '-'}{formatValue(transaction.valor)} MZN
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


