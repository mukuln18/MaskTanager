import Project from "@/models/Project";
import mongoose from "mongoose";

/**
 * Checks if a user has access to a project based on their role and membership.
 * 
 * @param {string} projectId 
 * @param {string} userId 
 * @param {string} userRole 
 * @param {boolean} requireAdminOrCreator - If true, only admin or the user who created the project passes.
 * @returns {object} { error, status } if unauthorized, else { project }
 */
export async function checkProjectAccess(projectId, userId, userRole, requireAdminOrCreator = false) {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return { error: "Invalid project ID", status: 400 };
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return { error: "Project not found", status: 404 };
  }

  const isCreator = project.createdBy.toString() === userId;
  const isAdmin = userRole === "admin";
  const isMember = project.members.some((memberId) => memberId.toString() === userId);

  if (requireAdminOrCreator) {
    if (!isAdmin && !isCreator) {
      return { error: "Forbidden: Only admins or the project creator can perform this action", status: 403 };
    }
  } else {
    if (!isAdmin && !isCreator && !isMember) {
      return { error: "Forbidden: You do not have access to this project", status: 403 };
    }
  }

  return { project };
}

/**
 * Appends `isOverdue` flag to a task document before sending response.
 */
export function formatTaskWithOverdue(task) {
  const taskObj = typeof task.toObject === "function" ? task.toObject() : task;
  const isOverdue = taskObj.dueDate && new Date() > new Date(taskObj.dueDate) && taskObj.status !== "done";
  return { ...taskObj, isOverdue };
}
