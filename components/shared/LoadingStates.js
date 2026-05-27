import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LoadingSpinner – a simple spinning ring
 */
export function LoadingSpinner({ size = "md", className }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  };

  return (
    <div
      className={cn(
        "rounded-full border-transparent border-t-indigo-500 animate-spin",
        sizes[size],
        className
      )}
    />
  );
}

/**
 * FullPageLoader – centers a spinner on the whole viewport
 */
export function FullPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Preparing workspace…</p>
      </div>
    </div>
  );
}

/**
 * CardSkeleton – placeholder card while data loads
 */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

/**
 * TableRowSkeleton – placeholder table rows
 */
export function TableRowSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-border/50 last:border-0"
        >
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-3 w-1/3 rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </>
  );
}
