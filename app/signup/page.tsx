"use client";
import React, { useEffect, useState } from 'react';
import { Loader2, User, Mail, Lock, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

type GoogleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function BotaoGoogle(props: GoogleButtonProps) {
  const { className = '', onClick, ...rest } = props;
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-3 lg:px-4 border border-gray-300 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-300 sm:w-12 sm:h-12 w-full py-4 ${className}`}
      type="button"
      {...rest}
    >
      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      <span className="whitespace-nowrap text-sm sm:text-xs sm:hidden">Continuar com Google</span>
    </button>
  );
}

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading]=useState(false)
  const [refCode, setRefCode] = useState('');
  
  const { signup } = useAuth() as any;

  // Detect and persist referral code from URL/localStorage
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get('referencia');
      if (urlRef) {
        setRefCode(urlRef);
        try { localStorage.setItem('referencia', urlRef); } catch {}
      } else {
        const stored = localStorage.getItem('referencia');
        if (stored) setRefCode(stored);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    
    try{
      await signup(name, email, username, password, refCode || undefined);
    }catch(e){
      console.log(e)
    }finally{
      setLoading(false)
    }
  };

  const handleGoogleSignup = () => {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options: Record<string, string> = {
      client_id: '830630003244-nn0s7nkrf7ufa7670eigobjppdfesd7h.apps.googleusercontent.com',
      redirect_uri: 'https://skyvenda.com/usuario/auth/callback',
      response_type: 'code',
      scope: 'email profile',
      access_type: 'offline',
      prompt: 'consent',
    };

    // Include referral code in OAuth state if present
    const queryString = new URLSearchParams({
      ...options,
      ...(refCode ? { state: refCode } : {}),
    }).toString();
    window.location.href = `${baseUrl}?${queryString}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <div className="max-w-md w-full space-y-6 p-4 sm:p-6 sm:bg-white/80 sm:backdrop-blur-sm sm:rounded-xl sm:shadow-xl relative min-h-[100dvh] sm:min-h-0 flex flex-col justify-center overflow-y-auto">
        <div className="text-center">
          <div className="flex justify-center mb-14">
            <UserCircle className="h-16 w-16 sm:h-12 sm:w-12 text-indigo-500" />
          </div>
          <h2 className="hidden sm:block text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            SkyVenda MZ
          </h2>
          <p className="hidden sm:block mt-2 text-gray-600">Crie sua conta</p>
        </div>

        <form className="mt-6 space-y-4 sm:space-y-6 px-5" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                placeholder="Nome completo"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                placeholder="Email"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                placeholder="Nome de usuário"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                placeholder="Senha"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-4 sm:py-3 px-4 rounded-full shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 text-sm sm:text-base"
          >
            {loading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              </div>
            ) : (
              'Criar conta'
            )}
          </button>

          {refCode && (
            <div className="text-[11px] sm:text-xs text-gray-600 text-center px-4 -mt-2">
              Código de referência detectado: <span className="font-medium">{refCode}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row flex-1 pt-8 items-center justify-between space-y-2 sm:space-y-0 text-xs sm:text-sm gap-2">
            <BotaoGoogle onClick={handleGoogleSignup} />
            <Link href="/login" className="w-full flex items-center justify-center py-4 sm:py-3 px-4 rounded-full border-indigo-500 border text-indigo-500 transition-all duration-300 text-sm sm:text-base">
              Já tenho conta
            </Link>
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 text-center px-4 leading-relaxed">
            Ao continuar, você concorda com os
            <Link href="/termos" className="text-indigo-600 hover:underline"> Termos de Serviço</Link>
            {" "}e a
            <Link href="/privacidade" className="text-indigo-600 hover:underline"> Política de Privacidade</Link>
            {" "}da Skyvenda.
          </p>
        </form>

        <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center lg:hidden">
          <span className="text-gray-400 text-sm font-bold sm:text-sm">BlueSpark MZ</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;