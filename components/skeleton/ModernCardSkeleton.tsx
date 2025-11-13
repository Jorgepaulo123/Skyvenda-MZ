import { cn } from "@/lib/utils";

interface ModernCardSkeletonProps {
  className?: string;
}

export default function ModernCardSkeleton({ className }: ModernCardSkeletonProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 shadow-sm", className)}>
      {/* Image skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted animate-pulse" />
      
      {/* Content container */}
      <div className="mt-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse" />
        
        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted animate-pulse" />
          <div className="h-3 w-1/3 rounded-md bg-muted animate-pulse" />
        </div>
        
        {/* Price skeleton */}
        <div className="h-5 w-1/2 rounded-md bg-muted animate-pulse" />
        
        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-2">
          {/* User info skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-20 rounded-md bg-muted animate-pulse" />
          </div>
          
          {/* Stats skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-8 rounded-md bg-muted animate-pulse" />
            <div className="h-3 w-8 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}