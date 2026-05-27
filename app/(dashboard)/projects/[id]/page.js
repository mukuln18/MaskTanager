"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { projectsApi, tasksApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { TaskCard } from "@/components/projects/TaskCard";
import { TaskForm } from "@/components/projects/TaskForm";
import { ManageMembersDialog } from "@/components/projects/ManageMembersDialog";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/Badges";
import { TableRowSkeleton, CardSkeleton } from "@/components/shared/LoadingStates";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus,
  ArrowLeft,
  CheckSquare,
  Users,
  Calendar,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Filter tabs
const FILTERS = ["all", "todo", "in-progress", "done"];

export default function ProjectDetailPage({ params }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [manageMembersOpen, setManageMembersOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");

  // ─── Load project ────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await projectsApi.get(id);
        setProject(res.data.project);
      } catch (err) {
        toast.error("Project not found");
        router.push("/projects");
      } finally {
        setLoadingProject(false);
      }
    }
    loadProject();
  }, [id, router]);

  // ─── Load tasks ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await tasksApi.list(id);
        setTasks(res.data.tasks || []);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        setLoadingTasks(false);
      }
    }
    loadTasks();
  }, [id]);

  // ─── Filtered tasks ──────────────────────────────────────────────────────
  const filteredTasks =
    activeFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === activeFilter);

  // ─── Task CRUD ───────────────────────────────────────────────────────────
  async function handleCreateTask(data) {
    try {
      const res = await tasksApi.create({ ...data, projectId: id });
      setTasks((prev) => [...prev, res.data.task]);
      toast.success("Task created!");
    } catch (err) {
      toast.error(err.message || "Failed to create task");
      throw err;
    }
  }

  async function handleEditTask(data) {
    try {
      const res = await tasksApi.update(editTask._id, data);
      setTasks((prev) =>
        prev.map((t) => (t._id === editTask._id ? res.data.task : t))
      );
      toast.success("Task updated!");
      setEditTask(null);
    } catch (err) {
      toast.error(err.message || "Failed to update task");
      throw err;
    }
  }

  async function handleDeleteTask() {
    setDeleteLoading(true);
    try {
      await tasksApi.delete(deleteTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTask._id));
      toast.success("Task deleted");
      setDeleteTask(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleStatusChange(taskId, newStatus) {
    try {
      const res = await tasksApi.updateStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  }

  // ─── Stats ───────────────────────────────────────────────────────────────
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const members = project?.members || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Button>

      {/* Project header */}
      {loadingProject ? (
        <div className="rounded-xl border bg-card p-6 space-y-3">
          <CardSkeleton />
        </div>
      ) : project ? (
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground mb-1">
                {project.title}
              </h2>
              {project.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Created{" "}
                {formatDistanceToNow(new Date(project.createdAt), {
                  addSuffix: true,
                })}{" "}
                by{" "}
                <span className="font-medium text-foreground">
                  {project.createdBy?.name || "Unknown"}
                </span>
              </p>
            </div>

            {/* Progress ring */}
            <div className="flex flex-col items-center gap-1">
              <div className="relative w-14 h-14">
                <svg
                  className="w-14 h-14 -rotate-90"
                  viewBox="0 0 56 56"
                  fill="none"
                >
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                    className="text-emerald-500 transition-all duration-500"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                  {progress}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {done}/{total} done
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Members */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex -space-x-2">
                {members.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    No members
                  </span>
                )}
                {members.slice(0, 6).map((m, i) => (
                  <Avatar
                    key={m._id}
                    className="h-7 w-7 border-2 border-card"
                    title={m.name}
                  >
                    <AvatarFallback
                      className={`text-[10px] font-semibold text-white ${
                        AVATAR_COLORS[i % AVATAR_COLORS.length]
                      }`}
                    >
                      {getInitials(m.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 6 && (
                  <div className="flex items-center justify-center h-7 w-7 rounded-full border-2 border-card bg-muted text-[10px] text-muted-foreground">
                    +{members.length - 6}
                  </div>
                )}
              </div>
              {members.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {members.length} member{members.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => setManageMembersOpen(true)}
              >
                Manage Members
              </Button>
            )}
          </div>
        </div>
      ) : null}

      {/* Tasks section */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Task header + filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b">
          <div>
            <h3 className="font-semibold text-foreground">Tasks</h3>
            <p className="text-xs text-muted-foreground">
              {total} task{total !== 1 ? "s" : ""} total
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            <div className="flex rounded-lg border p-0.5 bg-muted/40 gap-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    activeFilter === f
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f === "todo" ? "To Do" : "Done"}
                </button>
              ))}
            </div>

            {isAdmin && (
              <Button
                id="create-task-btn"
                size="sm"
                onClick={() => {
                  setEditTask(null);
                  setTaskFormOpen(true);
                }}
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Task list */}
        {loadingTasks ? (
          <TableRowSkeleton rows={5} />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="w-full h-full" />}
            title={
              activeFilter === "all" ? "No tasks yet" : `No ${activeFilter} tasks`
            }
            description={
              activeFilter === "all"
                ? "Add your first task to start tracking work."
                : "Switch filters or create new tasks."
            }
            action={
              (activeFilter === "all" && isAdmin)
                ? {
                    label: "Add Task",
                    onClick: () => setTaskFormOpen(true),
                  }
                : undefined
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                canEdit={isAdmin}
                onEdit={() => {
                  setEditTask(task);
                  setTaskFormOpen(true);
                }}
                onDelete={() => setDeleteTask(task)}
                onStatusChange={(newStatus) =>
                  handleStatusChange(task._id, newStatus)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Task form dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={(v) => {
          setTaskFormOpen(v);
          if (!v) setEditTask(null);
        }}
        task={editTask}
        members={members}
        projectId={id}
        onSubmit={editTask ? handleEditTask : handleCreateTask}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTask}
        onOpenChange={(v) => !v && setDeleteTask(null)}
        title="Delete Task?"
        description={`"${deleteTask?.title}" will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteTask}
        loading={deleteLoading}
      />

      {/* Manage members dialog */}
      <ManageMembersDialog
        open={manageMembersOpen}
        onOpenChange={setManageMembersOpen}
        project={project}
        onProjectUpdated={async () => {
          const res = await projectsApi.get(id);
          setProject(res.data.project);
        }}
      />
    </div>
  );
}
