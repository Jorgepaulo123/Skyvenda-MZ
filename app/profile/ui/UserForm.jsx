"use client";
import React, { useState } from 'react';
import api from '../../../api/api';
import { Upload, User, MapPin, Phone, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import StepIndicator from './StepIndicator';
import ImagePreview from './ImagePreview';
import { PROVINCIAS ,DISTRITOS} from '../data/consts';

const STEPS = ['Dados Pessoais', 'Localização', 'Documentos'];



export default function UserForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    data_nascimento: '',
    nacionalidade: '',
    bairro: '',
    sexo: '',
    localizacao: '',
    provincia: '',
    contacto: '',
    distrito: '',
    foto_bi_verso: null,
    foto_bi_frente: null,
    foto_retrato: null,
  });
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'provincia') {
        return { ...prev, [name]: value, distrito: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setLoading(true);
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSend.append(key, value);
      } else if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await api.post(
        '/info_usuario/',
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload()
      console.log(response.data);
    } catch (error) {
      toast.error('Erro ao enviar');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "h-[40px] mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-gray-400";
  const selectClassName = "h-[40px] mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-gray-400 bg-white";

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <Calendar className="inline-block w-4 h-4 mr-2" />
          Data de Nascimento
        </label>
        <input
          type="date"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleInputChange}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <User className="inline-block w-4 h-4 mr-2" />
          Nacionalidade
        </label>
        <input
          type="text"
          name="nacionalidade"
          value={formData.nacionalidade}
          onChange={handleInputChange}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sexo
        </label>
        <select
          name="sexo"
          value={formData.sexo}
          onChange={handleInputChange}
          className={selectClassName}
          required
        >
          <option value="">Selecione o sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
    </div>
  );

  const renderLocationInfo = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Província
        </label>
        <select
          name="provincia"
          value={formData.provincia}
          onChange={handleInputChange}
          className={selectClassName}
          required
        >
          <option value="">Selecione a província</option>
          {PROVINCIAS.map((provincia) => (
            <option key={provincia} value={provincia}>
              {provincia}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Distrito
        </label>
        <select
          name="distrito"
          value={formData.distrito}
          onChange={handleInputChange}
          className={selectClassName}
          required
          disabled={!formData.provincia}
        >
          <option value="">Selecione o distrito</option>
          {formData.provincia &&
            DISTRITOS[formData.provincia].map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Bairro
        </label>
        <input
          type="text"
          name="bairro"
          value={formData.bairro}
          onChange={handleInputChange}
          className={inputClassName}
          required
          placeholder="Digite o nome do bairro"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          <Phone className="inline-block w-4 h-4 mr-2" />
          Contacto
        </label>
        <input
          type="tel"
          name="contacto"
          value={formData.contacto}
          onChange={handleInputChange}
          className={inputClassName}
          required
          placeholder="Ex: +258 84 123 4567"
        />
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {formData.foto_bi_frente ? (
          <ImagePreview
            file={formData.foto_bi_frente}
            onRemove={() => setFormData({ ...formData, foto_bi_frente: null })}
            label="BI (Frente)"
          />
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
            <input
              type="file"
              name="foto_bi_frente"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">BI (Frente)</p>
            </div>
          </div>
        )}

        {formData.foto_bi_verso ? (
          <ImagePreview
            file={formData.foto_bi_verso}
            onRemove={() => setFormData({ ...formData, foto_bi_verso: null })}
            label="BI (Verso)"
          />
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
            <input
              type="file"
              name="foto_bi_verso"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">BI (Verso)</p>
            </div>
          </div>
        )}

        {formData.foto_retrato ? (
          <ImagePreview
            file={formData.foto_retrato}
            onRemove={() => setFormData({ ...formData, foto_retrato: null })}
            label="Foto Retrato"
          />
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors">
            <input
              type="file"
              name="foto_retrato"
              onChange={handleFileChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">Foto Retrato</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Registro de Usuário</h2>
            <p className="mt-2 text-gray-600">Preencha seus dados pessoais</p>
          </div>

          <StepIndicator currentStep={currentStep} steps={STEPS} />

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderLocationInfo()}
            {currentStep === 3 && renderDocuments()}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Enviando...'
                ) : currentStep === 3 ? (
                  'Finalizar'
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}