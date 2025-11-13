export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
} 