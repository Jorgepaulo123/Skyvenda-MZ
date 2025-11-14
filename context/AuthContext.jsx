"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('auth_token') || null;
      }
    } catch {}
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  // Função para obter o token
  const getToken = async (username, password) => {
    try {
      // Use x-www-form-urlencoded format as required by the API
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', username);
      params.append('password', password);
      params.append('scope', '');
      params.append('client_id', 'string');
      params.append('client_secret', 'string');
      
      const response = await api.post('/usuario/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const token = response.data.access_token;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_id", response.data.id);
      
      setToken(token);
      const userResponse = await api.get("/usuario/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      
      // Handle all errors
      if (error.message === "Network Error") {
        toast.error("Verifique a sua ligação");
      } else if (error.message === "Request failed with status code 401") {
        toast.error("Username ou palavra-passe incorreta");
      } else if (error.response && error.response.status === 422) {
        toast.error("Dados inválidos. Verifique seu username e senha.");
        console.error("API Error:", error.response.data);
      } else {
        toast.error("Erro desconhecido");
        console.error("Unknown error:", error);
      }
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href ='login';
  };

  // Função de cadastro
  const signup = async (name, email, username, password, referenciaCode) => {
    const formData = new FormData();
    formData.append('nome', name);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('senha', password);
    formData.append('tipo', 'nhonguista');

    // Captura o código de referência da URL/localStorage, se não for passado explicitamente
    let referencia = referenciaCode || null;
    try {
      if (!referencia && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        referencia = params.get('referencia') || localStorage.getItem('referencia') || null;
      }
    } catch {}

    const endpoint = referencia
      ? `/usuario/cadastro?referencia=${encodeURIComponent(referencia)}`
      : '/usuario/cadastro';

    try {
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Cadastrado com sucesso");
        try { localStorage.removeItem('referencia'); } catch {}
        window.location.href = 'login';
      }
    } catch (error) {
      if (error.message === "Network Error") {
        toast.error("Verifique a Ligação");
      } else {
        toast.error("Falha no cadastro. Tente novamente.");
      }
    }
  };

  // Recupera o usuário
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await api.get("/usuario/user", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          if (error.message === "Network Error") {
            toast.error("Verifique a sua ligação");
          } else if (error.status === 401) {
            logout();
          } else {
            toast.error("Erro desconhecido");
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Atualiza dados do usuário sob demanda (ex: saldo após eventos)
  const refreshUser = async () => {
    if (!token) return null;
    try {
      const response = await api.get('/usuario/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Falha ao atualizar usuário', error);
      if (error?.response?.status === 401) logout();
      return null;
    }
  };

  // Escuta eventos globais para atualizar saldo imediatamente
  useEffect(() => {
    const onRefresh = () => { refreshUser(); };
    window.addEventListener('wallet:refresh-balance', onRefresh);
    return () => window.removeEventListener('wallet:refresh-balance', onRefresh);
  }, [token]);

  // Redireciona para a página inicial após o login
  useEffect(() => {
    if (!loading && isAuthenticated && user && window.location.pathname === '/login') {
      window.location.href ='/'
    }
  }, [isAuthenticated, user, loading]);

  // O loader global é controlado fora deste provider (AppGate)

  // Ativar conta PRO
  const activatePro = async () => {
    if (!token) return;
    try {
      const res = await api.post('/usuario/ativar_pro', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Tenta atualizar o usuário atual com a resposta ou refetch
      let updatedUser = res?.data?.user || res?.data || null;
      if (!updatedUser) {
        const userResponse = await api.get('/usuario/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        updatedUser = userResponse.data;
      }
      setUser(updatedUser);
      setIsAuthenticated(true);
      try { const toast = (await import('react-hot-toast')).default; toast.success('Conta PRO ativada!'); } catch {}
      return updatedUser;
    } catch (e) {
      console.error('Falha ao ativar PRO', e);
      try { const toast = (await import('react-hot-toast')).default; toast.error('Não foi possível ativar PRO'); } catch {}
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      setLoading,  
      logout,
      signup, 
      token, 
      setUser,
      getToken, 
      setToken, 
      isAuthenticated,
      activatePro,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
