import { cn } from "@/lib/utils";

/**
 * StatusBadge – displays task status with colour coding.
 * status: "todo" | "in-progress" | "done"
 */
export function StatusBadge({ status, className }) {
  const styles = {
    todo: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    "in-progress":
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    done: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  };

  const labels = {
    todo: "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status] || styles.todo,
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full", {
          "bg-slate-500": status === "todo",
          "bg-blue-500": status === "in-progress",
          "bg-emerald-500": status === "done",
        })}
      />
      {labels[status] || status}
    </span>
  );
}

/**
 * OverdueBadge – shown when a task is overdue
 */
export function OverdueBadge({ className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Overdue
    </span>
  );
}

/**
 * RoleBadge – displays user role
 */
export function RoleBadge({ role, className }) {
  const styles = {
    admin:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
    member:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
        styles[role] || styles.member,
        className
      )}
    >
      {role}
    </span>
  );
}
