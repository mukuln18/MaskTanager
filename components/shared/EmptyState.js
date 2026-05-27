import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * EmptyState – shown when a list/section has no data.
 *
 * Props:
 *   icon       – JSX element (e.g. a Lucide icon)
 *   title      – heading text
 *   description – supporting text
 *   action      – { label, onClick } optional CTA button
 *   className   – extra wrapper classes
 */
export function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-border/50 rounded-2xl bg-gradient-to-b from-background/50 to-muted/20 m-6",
        className
      )}
    >
      {icon && (
        <motion.div 
          initial={{ y: 0 }}
          animate={{ y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mb-5 flex items-center justify-center w-16 h-16 rounded-2xl bg-muted text-muted-foreground shadow-sm ring-1 ring-border/50"
        >
          <span className="w-8 h-8 opacity-80">{icon}</span>
        </motion.div>
      )}
      <h3 className="text-base font-bold text-foreground mb-1.5 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm font-medium text-muted-foreground max-w-sm mb-5">
          {description}
        </p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} className="rounded-xl shadow-sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
