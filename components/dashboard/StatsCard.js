import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * StatsCard – a single metric card on the dashboard.
 * Props: title, value, icon (JSX), description, color ("indigo"|"emerald"|"amber"|"red"|"violet")
 */
export function StatsCard({ title, value, icon, description, color = "indigo", loading }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 ring-indigo-500/20",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 ring-emerald-500/20",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 ring-amber-500/20",
    red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 ring-red-500/20",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 ring-violet-500/20",
  };

  const topStripeColors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    violet: "bg-violet-500",
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-3 w-32 rounded-md" />
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Top Stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", topStripeColors[color] || topStripeColors.indigo)} />
      
      <div className="relative flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl ring-1 shadow-inner", colors[color])}>
          <span className="w-5 h-5">{icon}</span>
        </div>
      </div>
      <p className="relative text-3xl font-bold text-foreground mb-1 tracking-tight">
        {value ?? "—"}
      </p>
      {description && (
        <p className="relative text-xs text-muted-foreground font-medium">{description}</p>
      )}
    </div>
  );
}
