"use client";

import Link from "next/link";
import { format } from "date-fns";
import { StatusBadge, OverdueBadge } from "@/components/shared/Badges";
import { TableRowSkeleton } from "@/components/shared/LoadingStates";
import { EmptyState } from "@/components/shared/EmptyState";
import { CheckSquare } from "lucide-react";

/**
 * RecentTasks – table of recent tasks shown on the dashboard.
 */
export function RecentTasks({ tasks, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border/50">
          <h2 className="font-bold text-lg tracking-tight text-foreground">Recent Tasks</h2>
        </div>
        <TableRowSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="font-bold text-lg tracking-tight text-foreground">Recent Tasks</h2>
        <Link
          href="/projects"
          className="group flex items-center text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
        >
          View all →
        </Link>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-full h-full" />}
          title="No tasks yet"
          description="Tasks you create or are assigned to will appear here."
        />
      ) : (
        <div className="divide-y divide-border/50">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="group flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-all cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {task.title}
                </p>
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground truncate mt-1">
                  <span className="font-medium text-foreground/70">{task.project?.title || "Unknown project"}</span>
                  {task.assignedTo && (
                    <>
                      <span className="text-muted-foreground/40">•</span>
                      <span>{task.assignedTo.name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                {task.isOverdue && task.status !== "done" && <OverdueBadge />}
                <StatusBadge status={task.status} />
                {task.dueDate && (
                  <span className="text-xs font-medium text-muted-foreground hidden sm:inline w-16 text-right">
                    {format(new Date(task.dueDate), "MMM d")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
