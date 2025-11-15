export default function Loading() {
  return (
    <div className="p-4 animate-pulse">

      {/* Título */}
      <div className="h-6 w-24 bg-gray-300 rounded mb-4" />

      {/* Card do perfil */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full" />
          <div className="flex flex-col flex-1">
            <div className="h-4 w-32 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Lista Nhonguistas */}
      <div className="bg-white p-4 rounded-2xl shadow mb-4">
        <div className="flex justify-between">
          <div className="h-5 w-40 bg-gray-300 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        <div className="mt-4 space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="flex-1">
                <div className="h-4 w-36 bg-gray-300 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </div>
              <div className="flex flex-col items-end">
                <div className="h-4 w-8 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 h-4 w-40 bg-gray-300 rounded mx-auto" />
      </div>

      {/* Cards de Produtos e Pedidos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-gray-200 rounded-2xl" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>

    </div>
  );
    }
    
