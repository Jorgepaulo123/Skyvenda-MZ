import React, { useEffect, useState } from 'react';

import { AlertTriangle } from 'lucide-react';
import { FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiMoneygram } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import api from '../../api/api';
import PinModal from '../modals/PinModal';

import { useAuth } from '../../context/AuthContext';

export default function WithdrawForm() {
  const { token } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    // obter id do usuário atual
    const loadUser = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await api.get('/usuario/user', { headers });
        setUserId(res.data.id);
      } catch (e) {
        console.error('Erro ao obter utilizador', e);
      }
    };
    if (token) loadUser();
  }, [token]);

  const resetForm = () => {
    setWithdrawAmount('');
    setPhoneNumber('');
    setAccountNumber('');
    setAccountHolder('');
    setBankName('');
    setSwiftCode('');
    setEmail('');
    setStep(1);
    setSelectedPaymentMethod('mpesa');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setErrorMessage('Por favor, insira um valor válido');
      return;
    }

    if (selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'emola') {
      if (!phoneNumber || !/^[0-9]{9}$/.test(phoneNumber)) {
        setErrorMessage('Por favor, insira um número de telefone válido (9 dígitos)');
        return;
      }
    }

    if (selectedPaymentMethod === 'bank') {
      if (!accountNumber || !accountHolder || !bankName) {
        setErrorMessage('Por favor, preencha todos os campos bancários');
        return;
      }
    }

    if (selectedPaymentMethod === 'paypal') {
      if (!paypalEmail || !paypalEmail.includes('@')) {
        setErrorMessage('Por favor, insira um email válido');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage('');

    // Guardar dados e abrir modal do PIN
    setPendingData({
      valor: parseInt(withdrawAmount, 10),
      telefone: phoneNumber,
      paypalEmail: paypalEmail
    });
    setPinOpen(true);
  };

  const handlePinSubmit = async (pin) => {
    try {
      setPinLoading(true);
      if (selectedPaymentMethod === 'paypal') {
        // PayPal payout: use JSON + Idempotency-Key
        const idem = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
        const headers = {
          Authorization: `Bearer ${token}`,
          'Idempotency-Key': idem
        };
        await api.post(`/paypal/payouts/create`, null, {
          headers,
          params: {
            receiver_email: pendingData.paypalEmail,
            amount_mzn: parseInt(pendingData.valor, 10),
            pin
          }
        });
        toast.success(`Solicitação de saque para PayPal criada com sucesso! (${pendingData.valor} MTn → USD @70)`);
        setSuccessMessage(`Saque para PayPal solicitado com sucesso. Você receberá em USD equivalente a ${pendingData.valor} MTn pela taxa 70 MZN/USD.`);
      } else {
        // M-Pesa path (mantido como antes)
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        const params = new URLSearchParams();
        params.set('msisdn', pendingData.telefone);
        params.set('valor', String(pendingData.valor));
        params.set('pin', pin);
        await api.post(`/usuario/${userId}/pagamento/`, params, { headers });
        toast.success(`Solicitação de saque de ${pendingData.valor} MTn enviada com sucesso!`);
        setSuccessMessage(`Solicitação de saque de ${pendingData.valor} MTn enviada com sucesso! Aguarde o processamento.`);
      }
      setPinOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao confirmar PIN/saque:', error);
      const msg = error?.userMessage || error?.response?.data?.detail || error?.message || 'Não foi possível concluir o saque.';
      setErrorMessage(String(msg));
    } finally {
      setPinLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PinModal
        open={pinOpen}
        mode="confirm"
        onClose={() => { setPinOpen(false); setIsProcessing(false); }}
        onSubmit={handlePinSubmit}
        loading={pinLoading}
      />

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
        <h3 className="text-lg font-semibold mb-4">Sacar Fundos</h3>
        
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor a sacar (MTn)
                </label>
                <input
                  type="number"
                  id="amount"
                  min="10"
                  step="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: 100"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Valor mínimo para saque: 10 MTn
                </p>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                disabled={!withdrawAmount || parseFloat(withdrawAmount) < 10}
              >
                Continuar
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleWithdraw}>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha o método de saque</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('mpesa')}
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
                      selectedPaymentMethod === 'emola' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('emola')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-white p-2 rounded-full mb-2 flex items-center justify-center" style={{width: '40px', height: '40px'}}>
                        <img 
                          src="https://play-lh.googleusercontent.com/iqKeCVTHvdTVoAg-YGmC5cxA83JmjkwaTJ0r6_sls1wANm_v1SVId3zaNe4xA_qfi9B2" 
                          alt="E-mola" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium">E-mola</span>
                    </div>
                  </div>
                  
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'bank' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('bank')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-blue-700 text-white p-2 rounded-full mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Banco</span>
                    </div>
                  </div>
                  
                  <div
                    className={`border p-4 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="bg-blue-600 text-white p-2 rounded-full mb-2">
                        <FaPaypal size={20} />
                      </div>
                      <span className="text-sm font-medium">PayPal</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {(selectedPaymentMethod === 'mpesa' || selectedPaymentMethod === 'emola') && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Telefone {selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'E-mola'}
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
                    {selectedPaymentMethod === 'mpesa' 
                      ? 'O valor será enviado para sua conta M-Pesa.' 
                      : 'O valor será enviado para sua conta E-mola.'}
                  </p>
                </div>
              )}
              
              {selectedPaymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Banco
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Millennium BIM"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-1">
                      Titular da Conta
                    </label>
                    <input
                      type="text"
                      id="accountHolder"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="NOME COMO ESTÁ NO BANCO"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Número da Conta
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: 123456789"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Código SWIFT/BIC (opcional)
                    </label>
                    <input
                      type="text"
                      id="swiftCode"
                      value={swiftCode}
                      onChange={(e) => setSwiftCode(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: ABCDMZMZ"
                    />
                  </div>
                </div>
              )}
              
              {selectedPaymentMethod === 'paypal' && (
                <div>
                  <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email do PayPal
                  </label>
                  <input
                    type="email"
                    id="paypalEmail"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    O valor será enviado para sua conta PayPal associada a este email. A conversão será feita pela taxa fixa de 70 MZN por 1 USD.
                  </p>
                  {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                    <p className="mt-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
                      Você sacará <strong>{parseInt(withdrawAmount, 10)} MZN</strong> e receberá aproximadamente <strong>{(Number(withdrawAmount) / 70).toFixed(2)} USD</strong> no PayPal (taxa fixa 70 MZN por 1 USD).
                    </p>
                  )}
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
                    'Solicitar Saque'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 