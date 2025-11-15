export default function Loading() {
  return (
    <div className="p-4 animate-pulse">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-6 w-6 bg-gray-300 rounded" />
        <div className="h-5 w-48 bg-gray-300 rounded" />
      </div>

      {/* Avatar + nome */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-300 rounded-full" />
        <div className="flex flex-col justify-center">
          <div className="h-5 w-40 bg-gray-300 rounded mb-2" />
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center">
              <div className="h-4 w-6 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-4 w-6 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-col items-center">
              <div className="h-4 w-6 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Botões Seguir + Mensagem */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 flex-1 bg-gray-300 rounded-full" />
        <div className="h-10 flex-1 bg-gray-200 rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b pb-3 mb-6">
        <div className="h-5 w-20 bg-gray-300 rounded" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>

      {/* Área de conteúdo */}
      <div className="flex justify-center">
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

    </div>
  );
    }
        
