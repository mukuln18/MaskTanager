"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, Pencil, Trash2, ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
];

/**
 * ProjectCard – displays a project summary card.
 * Props:
 *   project  – project object from API
 *   onEdit   – () => void (admin only)
 *   onDelete – () => void (admin only)
 *   isAdmin  – boolean
 */
export function ProjectCard({ project, onEdit, onDelete, isAdmin }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border bg-card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
      {/* Colour bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-violet-500" />

      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Link
            href={`/projects/${project._id}`}
            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 group/link"
          >
            {project.title}
          </Link>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-muted focus-visible:outline-none"
              >
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Members */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {(project.members || []).slice(0, 4).map((m, i) => (
              <Avatar
                key={m._id}
                className={cn(
                  "h-7 w-7 border-2 border-card text-[10px] font-semibold text-white",
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                )}
              >
                <AvatarFallback
                  className={cn(
                    "text-[10px] font-semibold text-white",
                    AVATAR_COLORS[i % AVATAR_COLORS.length]
                  )}
                >
                  {getInitials(m.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members?.length > 4 && (
              <div className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-card bg-muted text-[10px] font-medium text-muted-foreground">
                +{project.members.length - 4}
              </div>
            )}
          </div>
          {project.members?.length > 0 ? (
            <span className="text-xs text-muted-foreground">
              {project.members.length} member
              {project.members.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" /> No members
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-5 py-3 flex items-center justify-between bg-muted/20">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
          })}
        </span>
        <Link
          href={`/projects/${project._id}`}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Open <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
