"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usersApi, projectsApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ManageMembersDialog({ open, onOpenChange, project, onProjectUpdated }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [addingUser, setAddingUser] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingUsers(true);
      usersApi.list()
        .then(res => setAllUsers(res.data.users || []))
        .catch(() => toast.error("Failed to load users"))
        .finally(() => setLoadingUsers(false));
    } else {
      setAddingUser("");
    }
  }, [open]);

  const members = project?.members || [];
  const memberIds = new Set(members.map(m => m._id));
  
  // Available users to add (not creator, not already member)
  const availableUsers = allUsers.filter(u => 
    u._id !== project?.createdBy?._id && !memberIds.has(u._id)
  );

  async function handleAddMember() {
    if (!addingUser) return;
    setIsUpdating(true);
    try {
      await projectsApi.addMember(project._id, addingUser);
      toast.success("Member added");
      setAddingUser("");
      onProjectUpdated();
    } catch (err) {
      toast.error(err.message || "Failed to add member");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemoveMember(userId) {
    setIsUpdating(true);
    try {
      await projectsApi.removeMember(project._id, userId);
      toast.success("Member removed");
      onProjectUpdated();
    } catch (err) {
      toast.error(err.message || "Failed to remove member");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Project Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Add member section */}
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-sm font-medium">Add new member</label>
              <Select value={addingUser} onValueChange={setAddingUser} disabled={loadingUsers || isUpdating}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? "Loading..." : "Select user"} />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map(u => (
                    <SelectItem key={u._id} value={u._id}>{u.name} ({u.email})</SelectItem>
                  ))}
                  {availableUsers.length === 0 && (
                    <SelectItem value="none" disabled>No users available to add</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button disabled={!addingUser || isUpdating || addingUser === "none"} onClick={handleAddMember}>
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
              Add
            </Button>
          </div>

          {/* Current members list */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current members ({members.length})</label>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 border border-dashed rounded-lg text-center bg-muted/10">No members added yet.</p>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {members.map(m => (
                  <div key={m._id} className="flex items-center justify-between p-2.5 rounded-md border bg-muted/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-semibold">
                          {m.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                         <p className="text-sm font-medium truncate leading-none mb-1">{m.name}</p>
                         <p className="text-[10px] text-muted-foreground truncate leading-none">{m.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10"
                      disabled={isUpdating}
                      onClick={() => handleRemoveMember(m._id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
