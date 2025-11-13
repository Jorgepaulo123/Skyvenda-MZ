import React, { useState, useEffect } from 'react';

export default function PinModal({
  open,
  mode = 'confirm', // 'setup' | 'confirm'
  onClose,
  onSubmit, // (pin) => void
  loading = false,
  title,
  description,
}) {
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');

  useEffect(() => {
    if (!open) {
      setPin('');
      setPin2('');
    }
  }, [open]);

  if (!open) return null;

  const isSetup = mode === 'setup';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSetup) {
      if (!/^\d{4,6}$/.test(pin)) return;
      if (pin !== pin2) return;
      onSubmit(pin);
    } else {
      if (!/^\d{4,6}$/.test(pin)) return;
      onSubmit(pin);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {title || (isSetup ? 'Ativar PIN da SkyWallet' : 'Confirmar PIN')}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {description || (isSetup
              ? 'Defina um PIN (4–6 dígitos) para proteger suas compras.'
              : 'Insira o seu PIN para concluir a compra.')}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">{isSetup ? 'Novo PIN' : 'PIN'}</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              maxLength={6}
              className="w-full border rounded-md px-3 py-2"
              required
              pattern="\n?\\d{4,6}"
              autoComplete={isSetup ? 'new-password' : 'one-time-code'}
            />
          </div>
          {isSetup && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirmar PIN</label>
              <input
                type="password"
                value={pin2}
                onChange={(e) => setPin2(e.target.value)}
                placeholder="••••"
                maxLength={6}
                className="w-full border rounded-md px-3 py-2"
                required
                pattern="\n?\\d{4,6}"
                autoComplete="new-password"
              />
              {pin && pin2 && pin !== pin2 && (
                <p className="text-xs text-red-500 mt-1">Os PINs não correspondem.</p>
              )}
            </div>
          )}
        </form>
        <div className="px-5 py-4 border-t flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {loading ? 'Aguarde...' : (isSetup ? 'Ativar PIN' : 'Confirmar')}
          </button>
        </div>
      </div>
    </div>
  );
}
