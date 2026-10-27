export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`skeleton ${className}`} />
);

export const BlogCardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  </div>
);
