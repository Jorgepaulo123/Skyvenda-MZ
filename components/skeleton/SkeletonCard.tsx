

const SkeletonCard = () => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-lg p-2">
          <div className="w-full h-24 bg-gray-200 rounded-lg mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonCard;