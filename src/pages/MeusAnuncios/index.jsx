import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Clock, AlertCircle, Trash2, X, Edit2, Plus, Upload, RefreshCw, LayoutGrid, List as ListIcon } from 'lucide-react';

import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const api = axios.create({
  baseURL: 'https://skyvenda-mz.up.railway.app',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const EditAdDialog = ({ isOpen, onClose, onSave, ad, isSaving }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    link: ''
  });

  useEffect(() => {
    if (ad) {
      setFormData({
        nome: ad.nome || '',
        descricao: ad.descricao || '',
        preco: ad.preco || '',
        link: ad.link || ''
      });
    }
  }, [ad]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-blue-500" />
            Editar Anúncio
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do seu anúncio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço
            </label>
            <input
              type="number"
              value={formData.preco}
              onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, isDeleting }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          Confirmar Exclusão
        </DialogTitle>
        <DialogDescription>
          Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
        </DialogDescription>
      </DialogHeader>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          disabled={isDeleting}
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {isDeleting ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

const AdCard = ({ ad, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewDays, setRenewDays] = useState(7);
  const { token } = useAuth();

  const isApproved = ad.status === 'aprovado';

  const formatPrice = (price) => {
    if (!price) return 'Preço não definido';
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/produtos/anuncios/${ad.id}`);
      toast.success('Anúncio excluído com sucesso');
      onDelete(ad.id);
    } catch (err) {
      console.error('Erro ao excluir anúncio:', err);
      toast.error('Erro ao excluir anúncio. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleUpdate = async (formData) => {
    setIsSaving(true);
    try {
      const response = await api.put(`/produtos/anuncios/${ad.id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Anúncio atualizado com sucesso');
      onUpdate(response.data.anuncio);
      setShowEditDialog(false);
    } catch (err) {
      console.error('Erro ao atualizar anúncio:', err);
      toast.error('Erro ao atualizar anúncio. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenew = async () => {
    try {
      const diasInt = parseInt(renewDays, 10);
      if (Number.isNaN(diasInt) || diasInt <= 0) {
        toast.error('Informe um número de dias válido');
        return;
      }
      setIsRenewing(true);
      const form = new URLSearchParams();
      form.append('dias', String(diasInt));
      const response = await api.put(`/produtos/anuncios/${ad.id}/renovar`, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });
      toast.success(response.data?.message || 'Anúncio renovado com sucesso');
      // Atualizar dados locais se backend retornar anuncio atualizado
      if (response.data?.anuncio) {
        onUpdate(response.data.anuncio);
      } else if (typeof ad.dias_restantes === 'number') {
        onUpdate({ ...ad, dias_restantes: ad.dias_restantes + diasInt });
      }
      setShowRenewDialog(false);
    } catch (err) {
      console.error('Erro ao renovar anúncio:', err);
      const data = err?.response?.data;
      let msg = err?.message || 'Erro ao renovar anúncio';
      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          msg = data.detail.map((d) => d?.msg || JSON.stringify(d)).join(' | ');
        } else if (typeof data.detail === 'string') {
          msg = data.detail;
        } else if (typeof data.detail === 'object' && data.detail.msg) {
          msg = data.detail.msg;
        } else {
          try { msg = JSON.stringify(data.detail); } catch (_) {}
        }
      } else if (typeof data?.message === 'string') {
        msg = data.message;
      }
      toast.error(String(msg));
    } finally {
      setIsRenewing(false);
    }
  };

  const handleEditClick = (e) => {
    if (isApproved) {
      e.preventDefault();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }
    setShowEditDialog(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-2">
      <div className="relative aspect-square">
        <img
          src={ad.foto}
          alt={ad.nome}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://storage.googleapis.com/skyvendamz1/default.png';
          }}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
          {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{ad.nome}</h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{ad.descricao}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(ad.preco)}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Eye className="w-4 h-4 mr-1" />
            <span>{ad.cliques || 0} cliques</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{ad.dias_restantes || 0} dias</span>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to={`/anuncio/${ad.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver detalhes →
            </Link>
            <div className="relative">
              <button
                onClick={handleEditClick}
                className={`text-blue-500 transition-colors p-1 rounded-full ${
                  isApproved 
                    ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
                    : 'hover:text-blue-700 hover:bg-blue-50'
                }`}
                title={isApproved ? 'Anúncios aprovados não podem ser editados' : 'Editar anúncio'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {showTooltip && isApproved && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap">
                  Anúncios aprovados não podem ser editados
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-solid border-t-gray-900 border-t-8 border-x-transparent border-x-8 border-b-0" />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowRenewDialog(true)}
              className="text-emerald-600 hover:text-emerald-700 transition-colors p-1 rounded-full hover:bg-emerald-50"
              title="Renovar anúncio"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
              title="Excluir anúncio"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              Renovar Anúncio
            </DialogTitle>
            <DialogDescription>
              Informe por quantos dias deseja renovar este anúncio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dias</label>
              <input
                type="number"
                min={1}
                value={renewDays}
                onChange={(e) => setRenewDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowRenewDialog(false)}
                disabled={isRenewing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRenew}
                disabled={isRenewing}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {isRenewing ? 'Renovando...' : 'Renovar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!isApproved && (
        <EditAdDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          onSave={handleUpdate}
          ad={ad}
          isSaving={isSaving}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

const AdRow = ({ ad, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewDays, setRenewDays] = useState(7);
  const { token } = useAuth();

  const isApproved = ad.status === 'aprovado';

  const formatPrice = (price) => {
    if (!price) return 'Preço não definido';
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/produtos/anuncios/${ad.id}`);
      toast.success('Anúncio excluído com sucesso');
      onDelete(ad.id);
    } catch (err) {
      console.error('Erro ao excluir anúncio:', err);
      toast.error('Erro ao excluir anúncio. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleUpdate = async (formData) => {
    setIsSaving(true);
    try {
      const response = await api.put(`/produtos/anuncios/${ad.id}`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Anúncio atualizado com sucesso');
      onUpdate(response.data.anuncio);
      setShowEditDialog(false);
    } catch (err) {
      console.error('Erro ao atualizar anúncio:', err);
      toast.error('Erro ao atualizar anúncio. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenew = async () => {
    try {
      const diasInt = parseInt(renewDays, 10);
      if (Number.isNaN(diasInt) || diasInt <= 0) {
        toast.error('Informe um número de dias válido');
        return;
      }
      setIsRenewing(true);
      const form = new URLSearchParams();
      form.append('dias', String(diasInt));
      const response = await api.put(`/produtos/anuncios/${ad.id}/renovar`, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });
      toast.success(response.data?.message || 'Anúncio renovado com sucesso');
      // Atualizar dados locais se backend retornar anuncio atualizado
      if (response.data?.anuncio) {
        onUpdate(response.data.anuncio);
      } else if (typeof ad.dias_restantes === 'number') {
        onUpdate({ ...ad, dias_restantes: ad.dias_restantes + diasInt });
      }
      setShowRenewDialog(false);
    } catch (err) {
      console.error('Erro ao renovar anúncio:', err);
      const data = err?.response?.data;
      let msg = err?.message || 'Erro ao renovar anúncio';
      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          msg = data.detail.map((d) => d?.msg || JSON.stringify(d)).join(' | ');
        } else if (typeof data.detail === 'string') {
          msg = data.detail;
        } else if (typeof data.detail === 'object' && data.detail.msg) {
          msg = data.detail.msg;
        } else {
          try { msg = JSON.stringify(data.detail); } catch (_) {}
        }
      } else if (typeof data?.message === 'string') {
        msg = data.message;
      }
      toast.error(String(msg));
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 mb-2">
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium text-gray-900">{ad.nome}</h3>
          <p className="text-sm text-gray-500">{ad.descricao}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/anuncio/${ad.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver detalhes →
          </Link>
          <button
            onClick={() => setShowRenewDialog(true)}
            className="text-emerald-600 hover:text-emerald-700 transition-colors p-1 rounded-full hover:bg-emerald-50"
            title="Renovar anúncio"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
            title="Excluir anúncio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              Renovar Anúncio
            </DialogTitle>
            <DialogDescription>
              Informe por quantos dias deseja renovar este anúncio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dias</label>
              <input
                type="number"
                min={1}
                value={renewDays}
                onChange={(e) => setRenewDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowRenewDialog(false)}
                disabled={isRenewing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRenew}
                disabled={isRenewing}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {isRenewing ? 'Renovando...' : 'Renovar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="h-9 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const CreateAdDialog = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    link: '',
    dias: '1',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  const COST_PER_DAY = 115; // 115 meticais per day
  const DISCOUNT_DAYS_THRESHOLD = 10;
  const DISCOUNT_PERCENTAGE = 3;
  
  const subtotal = parseInt(formData.dias) * COST_PER_DAY;
  const hasDiscount = parseInt(formData.dias) > DISCOUNT_DAYS_THRESHOLD;
  const discountAmount = hasDiscount ? (subtotal * DISCOUNT_PERCENTAGE / 100) : 0;
  const totalCost = subtotal - discountAmount;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('imagem', selectedImage);

    try {
      const response = await api.post('/produtos/anuncios/enviar', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data && response.data.anuncio) {
        toast.success('Anúncio enviado com sucesso para revisão');
        onSuccess(response.data.anuncio);
        onClose();
        // Reset form
        setFormData({
          nome: '',
          descricao: '',
          preco: '',
          link: '',
          dias: '1',
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('Erro ao criar anúncio:', err);
      if (err.response?.status === 413) {
        toast.error('Imagem muito grande. Por favor, use uma imagem menor que 5MB.');
      } else if (err.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error('Erro ao criar anúncio. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-500" />
            Criar Novo Anúncio
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes do seu novo anúncio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  value={formData.preco}
                  onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (dias)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={formData.dias}
                      onChange={(e) => setFormData(prev => ({ ...prev, dias: e.target.value }))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                    />
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-gray-900">{formData.dias}</span>
                      <span className="text-sm text-gray-500">dias</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({COST_PER_DAY} MT/dia)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem do Anúncio
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-auto rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer py-8"
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Clique para selecionar uma imagem
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG até 5MB
                      </p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="bg-violet-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Resumo dos Custos</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      Subtotal:
                    </span>
                    <span className="text-sm text-gray-900">
                      {subtotal.toLocaleString('pt-MZ')} MT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      {formData.dias} {parseInt(formData.dias) === 1 ? 'dia' : 'dias'} × {COST_PER_DAY} MT
                    </span>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm">
                        Desconto ({DISCOUNT_PERCENTAGE}%):
                      </span>
                      <span className="text-sm">
                        -{discountAmount.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Total a pagar:
                      </span>
                      <span className="text-lg font-bold text-violet-600">
                        {totalCost.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>
                  </div>
                  {hasDiscount && (
                    <p className="text-xs text-green-600 mt-1">
                      Você economizou {discountAmount.toLocaleString('pt-MZ')} MT com o desconto!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {isSubmitting ? 'Enviando...' : 'Criar Anúncio'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function MeusAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const { token } = useAuth();

  const fetchAnuncios = async () => {
    try {
      if (!token) {
        setError('Você precisa estar logado para ver seus anúncios.');
        setLoading(false);
        return;
      }

      const response = await api.get('/produtos/meus-anuncios/todos');
      setAnuncios(response.data.anuncios);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar anúncios:', err);
      if (err.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
      } else {
        setError('Não foi possível carregar seus anúncios. Por favor, tente novamente mais tarde.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const handleDelete = (deletedId) => {
    setAnuncios(anuncios.filter(ad => ad.id !== deletedId));
  };

  const handleUpdate = (updatedAd) => {
    setAnuncios(anuncios.map(ad => 
      ad.id === updatedAd.id ? { ...ad, ...updatedAd } : ad
    ));
  };

  const handleCreate = (newAd) => {
    setAnuncios([newAd, ...anuncios]);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pt-4 sm:pt-8 md:pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meus Anúncios</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie todos os seus anúncios em um só lugar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border ${viewMode === 'grid' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
                title="Ver em grade"
              >
                <LayoutGrid className="w-4 h-4" />
                Grade
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-md border ${viewMode === 'list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300'}`}
                title="Ver em lista"
              >
                <ListIcon className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Anúncio
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : anuncios.length > 0 ? (
                anuncios.map((ad) => (
                  <AdCard 
                    key={ad.id} 
                    ad={ad} 
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    Nenhum anúncio encontrado
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 px-4">
                    Você ainda não tem nenhum anúncio publicado.
                  </p>
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Criar novo anúncio
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 h-20 animate-pulse" />
                ))
              ) : anuncios.length > 0 ? (
                anuncios.map((ad) => (
                  <AdRow
                    key={ad.id}
                    ad={ad}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    Nenhum anúncio encontrado
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 px-4">
                    Você ainda não tem nenhum anúncio publicado.
                  </p>
                  <button
                    onClick={() => setShowCreateDialog(true)}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Criar novo anúncio
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateAdDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreate}
      />
    </MainLayout>
  );
} 