import { DollarSign, Package, CreditCard, ArrowDownLeft, ArrowUpRight, History, Calendar, Wallet, BanknoteIcon, ShoppingBag, Store, ArrowDownIcon, ArrowUpIcon, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Overview({ totalVendas, totalProdutos, saldoCarteira, percentualCrescimento, produtosHoje }) {
  const [activeTab, setActiveTab] = useState('todos');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!token) {
          console.error('Token não encontrado');
          setError('Sessão expirada. Por favor, faça login novamente.');
          router.push('/login');
          return;
        }

        const response = await axios.get('https://skyvendas-production.up.railway.app/usuario/transacoes/listar', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        setTransactions(response.data);
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        
        if (error.response?.status === 401) {
          setError('Sessão expirada. Por favor, faça login novamente.');
          localStorage.removeItem('auth_token');
          router.push('/login');
        } else {
          setError(error.response?.data?.detail || 'Erro ao carregar transações. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [router, token]);

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
  const depositos = transactions.filter(t => t.tipo === 'entrada');
  const levantamentos = transactions.filter(t => t.tipo === 'saida' && !t.referencia.includes('Publicação'));
  const publicacoes = transactions.filter(t => t.referencia.includes('Publicação'));

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

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendas.toLocaleString('pt-PT')} MTn</div>
            <p className="text-xs text-muted-foreground">
              {percentualCrescimento >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  +{percentualCrescimento.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                  {percentualCrescimento.toFixed(2)}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProdutos.toLocaleString('pt-PT')}</div>
            <p className="text-xs text-muted-foreground">
              +{produtosHoje.toLocaleString('pt-PT')} desde hoje
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo da Carteira</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{saldoCarteira.toLocaleString('pt-PT')} MTn</div>
            <p className="text-xs text-muted-foreground">
              Saldo disponível para saque
            </p>
          </CardContent>
        </Card>
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
                        <Store className="w-4 h-4 text-[#4070F4]" />
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
  );
} 