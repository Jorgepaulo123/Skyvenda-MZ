import { Skeleton } from "../ui/skeleton";

export function ProductCardSkeleton2() {
  return (
    <div className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100" style={{ maxHeight: '130px', height: '100%', width: '100%' }}>
      {/* Thumbnail Skeleton */}
      <div className="w-1/3 shrink-0">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-grow p-3 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" /> {/* Status badge */}
            <Skeleton className="h-4 w-40" /> {/* Title */}
          </div>
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Action button */}
        </div>

        <div className="flex gap-2 mt-2">
          <Skeleton className="h-4 w-16" /> {/* Views */}
          <Skeleton className="h-4 w-16" /> {/* Likes */}
        </div>

        <div className="mt-auto">
          <Skeleton className="h-4 w-32" /> {/* Date */}
        </div>
      </div>
    </div>
  );
}