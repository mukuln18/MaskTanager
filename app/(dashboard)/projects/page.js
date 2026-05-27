"use client";

import { useState, useEffect } from "react";
import { projectsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { CardSkeleton } from "@/components/shared/LoadingStates";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function loadProjects() {
    try {
      const res = await projectsApi.list();
      setProjects(res.data.projects || []);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(data) {
    try {
      const res = await projectsApi.create(data);
      setProjects((prev) => [res.data.project, ...prev]);
      toast.success("Project created!");
    } catch (err) {
      toast.error(err.message || "Failed to create project");
      throw err;
    }
  }

  async function handleEdit(data) {
    try {
      const res = await projectsApi.update(editTarget._id, data);
      setProjects((prev) =>
        prev.map((p) => (p._id === editTarget._id ? res.data.project : p))
      );
      toast.success("Project updated!");
      setEditTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to update project");
      throw err;
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      await projectsApi.delete(deleteTarget._id);
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Project deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Loading…"
              : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        {isAdmin && (
          <Button
            id="create-project-btn"
            onClick={() => {
              setEditTarget(null);
              setFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border bg-card">
          <EmptyState
            icon={<FolderKanban className="w-full h-full" />}
            title="No projects yet"
            description={
              isAdmin
                ? "Create your first project to start organizing tasks."
                : "You haven't been added to any projects yet."
            }
            action={
              isAdmin
                ? { label: "Create Project", onClick: () => setFormOpen(true) }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              isAdmin={isAdmin}
              onEdit={() => {
                setEditTarget(project);
                setFormOpen(true);
              }}
              onDelete={() => setDeleteTarget(project)}
            />
          ))}
        </div>
      )}

      {/* Project form dialog */}
      <ProjectForm
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditTarget(null);
        }}
        project={editTarget}
        onSubmit={editTarget ? handleEdit : handleCreate}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete Project?"
        description={`"${deleteTarget?.title}" and all its tasks will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
