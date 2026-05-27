"use client";

import { useState, useEffect } from "react";
import { usersApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/shared/Badges";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableRowSkeleton } from "@/components/shared/LoadingStates";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Users, Search, Plus, Edit, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserForm } from "@/components/team/UserForm";

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-fuchsia-500",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function colorForId(id) {
  if (!id) return AVATAR_COLORS[0];
  const code = id.charCodeAt(id.length - 1) + id.charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export default function TeamPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await usersApi.list();
        setMembers(res.data.users || []);
      } catch {
        toast.error("Failed to load team members");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreateUser(data) {
    try {
      const res = await usersApi.create(data);
      setMembers((prev) => [res.data.user, ...prev]);
      toast.success("User created successfully");
    } catch (err) {
      toast.error(err.message || "Failed to create user");
      throw err;
    }
  }

  async function handleEditUser(data) {
    try {
      const res = await usersApi.update(editUser._id, data);
      setMembers((prev) =>
        prev.map((m) => (m._id === editUser._id ? res.data.user : m))
      );
      toast.success("User updated successfully");
      setEditUser(null);
    } catch (err) {
      toast.error(err.message || "Failed to update user");
      throw err;
    }
  }

  async function handleDeleteUser() {
    setActionLoading(true);
    try {
      await usersApi.delete(deleteUser._id);
      setMembers((prev) => prev.filter((m) => m._id !== deleteUser._id));
      toast.success("User deleted");
      setDeleteUser(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading…" : `${members.length} user${members.length !== 1 ? "s" : ""} in the system`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="team-search"
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          {isAdmin && (
            <Button
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => {
                setEditUser(null);
                setFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {loading ? (
          <TableRowSkeleton rows={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="w-full h-full" />}
            title={search ? "No members found" : "No users yet"}
            description="Users will appear here."
          />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((m) => (
              <div
                key={m._id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors",
                  m._id === currentUser?._id && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback
                      className={cn(
                        "text-sm font-semibold text-white",
                        colorForId(m._id)
                      )}
                    >
                      {getInitials(m.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {m.name}
                      </p>
                      {m._id === currentUser?._id && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <RoleBadge role={m.role || "member"} />
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditUser(m);
                          setFormOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        disabled={m._id === currentUser?._id}
                        onClick={() => setDeleteUser(m)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <UserForm
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditUser(null);
        }}
        user={editUser}
        onSubmit={editUser ? handleEditUser : handleCreateUser}
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(v) => !v && setDeleteUser(null)}
        title="Delete User?"
        description={`"${deleteUser?.name}" will be permanently deleted and removed from all projects.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteUser}
        loading={actionLoading}
      />
    </div>
  );
}
