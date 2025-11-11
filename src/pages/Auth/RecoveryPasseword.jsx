import React, { useState } from 'react';
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function RecoveryPasseword() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://skyvenda-mz.up.railway.app/usuario/recuperar_senha/?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        toast.success(data.message);
        setScreen('otp');
      } else {
        setError(data.detail || 'Erro ao enviar código de recuperação');
        toast.error(data.detail || 'Erro ao enviar código de recuperação');
      }
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      setError('Erro ao conectar com o servidor. Tente novamente.');
      toast.error('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const otpValue = otp.join('');
    
    try {
      const response = await fetch(`https://skyvenda-mz.up.railway.app/usuario/verificar_otp/?email=${encodeURIComponent(email)}&otp=${otpValue}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        toast.success(data.message);
        setResetToken(data.reset_token);
        setScreen('password');
      } else {
        setError(data.detail || 'Código OTP inválido');
        toast.error(data.detail || 'Código OTP inválido');
      }
    } catch (error) {
      console.error('Erro na verificação do OTP:', error);
      setError('Erro ao conectar com o servidor. Tente novamente.');
      toast.error('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (!isPasswordValid(password)) {
      setError('A senha não atende aos requisitos de segurança');
      toast.error('A senha não atende aos requisitos de segurança');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`https://skyvenda-mz.up.railway.app/usuario/resetar_senha/?reset_token=${resetToken}&nova_senha=${password}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        toast.success(data.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.detail || 'Erro ao redefinir a senha');
        toast.error(data.detail || 'Erro ao redefinir a senha');
      }
    } catch (error) {
      console.error('Erro na redefinição de senha:', error);
      setError('Erro ao conectar com o servidor. Tente novamente.');
      toast.error('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const isPasswordValid = (pass) => {
    // Simplificando a validação para aceitar qualquer senha com pelo menos 6 caracteres
    return pass.length >= 6;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Recuperação de Senha</h2>
          <p className="mt-2 text-gray-600">
            {screen === 'email' && 'Digite seu email para receber um código de recuperação'}
            {screen === 'otp' && 'Digite o código de 6 dígitos enviado para seu email'}
            {screen === 'password' && 'Crie uma nova senha'}
          </p>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </div>
          )}
        </div>

        {screen === 'email' && (
          <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Digite seu email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar Código de Recuperação'}
            </button>
          </form>
        )}

        {screen === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
            <div className="flex gap-2 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verificar Código'}
            </button>
          </form>
        )}

        {screen === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Confirme a senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password && !isPasswordValid(password) && (
                <p className="text-sm text-red-500">
                  A senha deve conter pelo menos 6 caracteres
                </p>
              )}
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500">As senhas não coincidem</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !isPasswordValid(password) || password !== confirmPassword}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Redefinir Senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecoveryPasseword;