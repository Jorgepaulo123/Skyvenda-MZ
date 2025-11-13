import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDelete({ isOpen, onClose, product, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-in fade-in slide-in-from-bottom-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Confirmar Deleção
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Você tem certeza que deseja excluir o produto{' '}
              <span className="font-medium text-gray-900 dark:text-white">
                {product?.title}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Esta ação não pode ser desfeita. O produto será permanentemente removido do sistema.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onDelete(product?.id);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
