"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge, OverdueBadge } from "@/components/shared/Badges";
import { MoreVertical, Pencil, Trash2, Calendar, User } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const STATUS_DOT_COLOR = {
  todo: "border-slate-400",
  "in-progress": "border-blue-500",
  done: "border-emerald-500 bg-emerald-500",
};

/**
 * TaskCard – single task row in the task list.
 *
 * Props:
 *   task          – task object from API
 *   onEdit        – () => void
 *   onDelete      – () => void
 *   onStatusChange – (status) => void
 *   canEdit       – boolean
 */
export function TaskCard({ task, onEdit, onDelete, onStatusChange, canEdit }) {
  const [statusLoading, setStatusLoading] = useState(false);

  async function changeStatus(newStatus) {
    if (newStatus === task.status || statusLoading) return;
    setStatusLoading(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setStatusLoading(false);
    }
  }

  return (
    <div className="group flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors border-b last:border-0">
      {/* Status dot — base-ui Trigger already renders a <button>, style it directly */}
      <DropdownMenu>
        <DropdownMenuTrigger
          title="Change status"
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${STATUS_DOT_COLOR[task.status] || STATUS_DOT_COLOR.todo}`}
        />
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Set status
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {STATUS_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => changeStatus(opt.value)}
              className={`cursor-pointer ${task.status === opt.value ? "font-medium" : ""}`}
            >
              {task.status === opt.value && "✓ "}
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            task.status === "done"
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {task.assignedTo && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              {task.assignedTo.name}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          )}
        </div>
      </div>

      {/* Badges + actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {task.isOverdue && task.status !== "done" && <OverdueBadge />}
        <StatusBadge status={task.status} />
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-muted focus-visible:outline-none"
            >
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Pencil className="w-3.5 h-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
