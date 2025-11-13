import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
// Deposits no longer require PIN (PayPal)

export default function DepositForm() {
  const { token, user } = useAuth();
  const [depositAmount, setDepositAmount] = useState('');
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('wallet_currency') || 'MZN';
    } catch (_) {
      return 'MZN';
    }
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    const init = (typeof window !== 'undefined' && localStorage.getItem('wallet_currency') === 'USD') ? 'paypal' : 'mpesa';
    return init;
  });
  // PayPal state
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [paypalApproveLink, setPaypalApproveLink] = useState(null);
  const [step, setStep] = useState(1);
  // Removed PIN modal/session for deposits

  // Auto-capture on return from PayPal
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('paypal') === 'success';
      const orderToken = params.get('token'); // PayPal usually returns order ID as 'token'
      if (isSuccess && orderToken) {
        setCurrency('USD');
        setSelectedPaymentMethod('paypal');
        setStep(2);
        setPaypalOrderId(orderToken);
        // Clear the query params from URL after processing to avoid re-trigger
        window.history.replaceState({}, document.title, window.location.pathname);
        // Auto-capture on return (PIN not required)
        (async () => {
          try {
            setIsProcessing(true);
            const idem = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
            const headers = {
              Authorization: `Bearer ${token}`,
              'Idempotency-Key': idem
            };
            const res = await api.post(`/paypal/orders/${orderToken}/capture`, null, { headers });
            if (res.data?.status === 'COMPLETED') {
              toast.success('Depósito via PayPal confirmado com PIN!');
              setSuccessMessage('Depósito via PayPal confirmado com PIN!');
              resetForm();
            } else {
              toast.error(`Falha ao capturar pagamento: ${res.data?.status || 'status desconhecido'}`);
            }
          } catch (err) {
            console.error('Erro ao auto-capturar PayPal (PIN session):', err);
            const msg = err?.response?.data?.detail || err?.message || 'Não foi possível confirmar o pagamento.';
            setErrorMessage(String(msg));
          } finally {
            setIsProcessing(false);
          }
        })();
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // PIN flow removed

  const resetForm = () => {
    setDepositAmount('');
    setPhoneNumber('');
    setStep(1);
    const cur = currency === 'USD' ? 'paypal' : 'mpesa';
    setSelectedPaymentMethod(cur);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDeposit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setErrorMessage('Por favor, insira um valor válido');
      return;
    }

    if (currency === 'MZN' && selectedPaymentMethod === 'mpesa') {
      if (!phoneNumber || !/^[0-9]{9}$/.test(phoneNumber)) {
        setErrorMessage('Por favor, insira um número de telefone válido (9 dígitos)');
        return;
      }
      // Validar prefixo M-Pesa: 84/85/86/87
      if (!/^(84|85|86|87)\d{7}$/.test(phoneNumber)) {
        setErrorMessage('Insira um número M-Pesa válido começando por 84, 85, 86 ou 87.');
        return;
      }
    }

    // Métodos suportados por moeda:
    // - MZN: apenas M-Pesa
    // - USD: apenas PayPal
    setErrorMessage('');
    // Bloquear combinação inválida
    if (currency === 'MZN' && selectedPaymentMethod !== 'mpesa') {
      setErrorMessage('Para MZN, utilize M-Pesa.');
      return;
    }
    if (currency === 'USD' && selectedPaymentMethod !== 'paypal') {
      setErrorMessage('Para USD, utilize PayPal.');
      return;
    }
    setIsProcessing(true);

    try {
      if (currency === 'MZN' && selectedPaymentMethod === 'mpesa') {
        if (!user?.id) { throw new Error('ID do usuário não encontrado'); }
        const headers = {
          Authorization: `Bearer ${token}`
        };
        await api.post(`/usuario/${user.id}/adicionar_saldo/`, null, {
          headers,
          params: {
            msisdn: `258${phoneNumber}`,
            valor: parseInt(depositAmount, 10)
          }
        });
        toast.success(`Depósito de ${parseInt(depositAmount, 10)} MTn iniciado com sucesso!`);
        setSuccessMessage(`Depósito de ${parseInt(depositAmount, 10)} MTn iniciado com sucesso! Aguarde a confirmação.`);
        resetForm();
      } else if (currency === 'USD' && selectedPaymentMethod === 'paypal') {
        // PayPal Create Order
        if (!user?.id) { throw new Error('ID do usuário não encontrado'); }
        const idem = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
        const headers = {
          Authorization: `Bearer ${token}`,
          'Idempotency-Key': idem
        };
        const amountUSD = parseFloat(depositAmount).toFixed(2); // USD
        const res = await api.post(`/paypal/orders/create`, null, {
          headers,
          params: {
            valor: amountUSD,
            currency_code: 'USD'
          }
        });
        const { order_id, approve_link } = res.data || {};
        if (!order_id) {
          throw new Error('Falha ao criar ordem no PayPal');
        }
        setPaypalOrderId(order_id);
        setPaypalApproveLink(approve_link || null);
        // Abrir janela de aprovação, se link existir
        if (approve_link) {
          // Redirect in the same tab to avoid popup blockers and ensure smooth flow
          window.location.href = approve_link;
          return; // stop further UI updates; navigation will occur
        }
        toast.error('Link de aprovação do PayPal indisponível. Tente novamente em alguns segundos.');
      }
      
    } catch (error) {
      console.error('Erro ao processar depósito:', error);
      if (error.message === 'ID do usuário não encontrado') {
        setErrorMessage('Erro de autenticação. Por favor, faça login novamente.');
      } else {
        const detail = error.response?.data?.detail || '';
        if (typeof detail === 'string' && detail.includes('INS-2051')) {
          setErrorMessage('Erro M-Pesa (INS-2051): MSISDN inválido. Confirme que é um número M-Pesa ativo (84/85/86/87) e tente novamente.');
        } else {
          setErrorMessage(detail || 'Ocorreu um erro ao processar seu depósito. Por favor, tente novamente.');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaypalCapture = async () => {
    if (!paypalOrderId) {
      setErrorMessage('Crie o pedido no PayPal primeiro.');
      return;
    }
    try {
      setIsProcessing(true);
      const idem = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Idempotency-Key': idem
      };
      const res = await api.post(`/paypal/orders/${paypalOrderId}/capture`, {}, { headers });
      if (res.data?.status === 'COMPLETED') {
        toast.success('Depósito via PayPal concluído com sucesso!');
        setSuccessMessage('Depósito via PayPal concluído com sucesso!');
        // Limpa estados PayPal e formulário
        setPaypalOrderId(null);
        setPaypalApproveLink(null);
        resetForm();
      } else {
        toast.error(`Falha ao capturar pagamento: ${res.data?.status || 'status desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao capturar PayPal:', error);
      setErrorMessage(error.response?.data?.detail || 'Erro ao capturar pagamento PayPal.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PIN no longer required for deposits */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
          <div className="flex-shrink-0 mr-3">
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p>{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Depositar Fundos</h3>
        
        {step === 1 && (
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            try { localStorage.setItem('wallet_currency', currency); } catch (_) {}
            setSelectedPaymentMethod(currency === 'USD' ? 'paypal' : 'mpesa');
            setStep(2); 
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor a depositar ({currency === 'USD' ? 'USD' : 'MTn'})
                </label>
                <input
                  type="number"
                  id="amount"
                  min="10"
                  step="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={currency === 'USD' ? 'Ex: 10' : 'Ex: 100'}
                  required
                />
                {currency === 'USD' && depositAmount && parseFloat(depositAmount) > 0 && (
                  <p className="mt-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
                    Você pagará <strong>{Number(depositAmount).toFixed(2)} USD</strong> e receberá aproximadamente <strong>{(Number(depositAmount) * 63).toFixed(0)} MZN</strong> na SkyWallet (taxa fixa 63 MZN por 1 USD).
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrency(val);
                    try { localStorage.setItem('wallet_currency', val); } catch (_) {}
                    setSelectedPaymentMethod(val === 'USD' ? 'paypal' : 'mpesa');
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="MZN">Metical (MZN)</option>
                  <option value="USD">Dólar (USD)</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  {currency === 'USD' 
                    ? 'Pagamentos em USD são processados via PayPal. O valor creditado na SkyWallet será convertido a uma taxa fixa de 63 MZN por 1 USD.'
                    : 'Pagamentos em MZN são processados via M-Pesa.'}
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
              >
                Continuar
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleDeposit}>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha o método de pagamento</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      currency === 'MZN' && selectedPaymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 ' + (currency === 'MZN' ? 'hover:border-indigo-300' : 'opacity-60 cursor-not-allowed')
                    }`}
                    onClick={() => currency === 'MZN' && setSelectedPaymentMethod('mpesa')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-white p-2 rounded-full mb-2 flex items-center justify-center" style={{width: '40px', height: '40px'}}>
                        <img 
                          src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/35/b8/06/35b80684-5547-d7a5-0a0d-919fa3d073d1/AppIcon-mz-0-0-1x_U007emarketing-0-5-0-0-85-220.png/434x0w.webp" 
                          alt="M-Pesa" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">M-Pesa</span>
                    </div>
                  </div>

                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      currency === 'USD' && selectedPaymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 ' + (currency === 'USD' ? 'hover:border-indigo-300' : 'opacity-60 cursor-not-allowed')
                    }`}
                    onClick={() => currency === 'USD' && setSelectedPaymentMethod('paypal')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-white p-2 rounded-full mb-2 flex items-center justify-center" style={{width: '40px', height: '40px'}}>
                        <img 
                          src="https://www.paypalobjects.com/webstatic/icon/pp258.png" 
                          alt="PayPal" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                  </div>
                  
                  {/* E-mola removido do fluxo conforme política atual */}
                </div>
              </div>
              
              {currency === 'MZN' && selectedPaymentMethod === 'mpesa' && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Telefone M-Pesa
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +258
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 9))}
                      className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: 84XXXXXXX"
                      maxLength={9}
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Você receberá uma solicitação de pagamento no seu M-Pesa.
                  </p>
                </div>
              )}
              
              {currency === 'USD' && selectedPaymentMethod === 'paypal' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
                  Ao selecionar PayPal, redirecionaremos para a página de aprovação. Após aprovar, o depósito será confirmado automaticamente.
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  onClick={() => {
                    setStep(1);
                    setErrorMessage('');
                  }}
                >
                  Voltar
                </button>
                
                {currency === 'MZN' && selectedPaymentMethod === 'mpesa' && (
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      'Continuar'
                    )}
                  </button>
                )}

                {currency === 'USD' && selectedPaymentMethod === 'paypal' && (
                  <div className="flex-1 flex gap-2">
                    <button
                      type="button"
                      onClick={async () => { await handleDeposit(); }}
                      className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Criando pedido...' : 'Pagar com PayPal'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}

      {/* PIN modal removed for PayPal deposits */}
      </div>
    </div>
  );
}