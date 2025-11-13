import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export function SellerCardSkeleton() {
  return (
    <Card className="w-full max-w-sm bg-white">
      <CardHeader className="flex flex-row items-center gap-4">
        {/* Avatar skeleton */}
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex flex-col gap-2">
          {/* Name and badge skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16" />
          </div>
          {/* Rating skeleton */}
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats skeleton */}
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        {/* Button skeletons */}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}