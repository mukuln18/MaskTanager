import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { apiResponse, apiError } from "@/lib/api-response";
import { checkProjectAccess, formatTaskWithOverdue } from "@/lib/helpers/auth-checks";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid task ID", 400);
    }

    const body = await request.json();
    const { assignedTo } = body;

    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return apiResponse(false, null, "Invalid user ID", 400);
    }

    const task = await Task.findById(id);
    if (!task) return apiResponse(false, null, "Task not found", 404);

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const accessCheck = await checkProjectAccess(task.project, userId, userRole, false);
    if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);

    // If assigning to a user, ensure they exist and are a valid member of the project
    if (assignedTo) {
      const user = await User.findById(assignedTo);
      if (!user) return apiResponse(false, null, "Assigned user not found", 404);
      
      const project = accessCheck.project;
      const isMember = project.members.some(memberId => memberId.toString() === assignedTo) || project.createdBy.toString() === assignedTo;
      
      if (!isMember && user.role !== "admin") {
         return apiResponse(false, null, "Cannot assign task: user is not a member of the project", 400);
      }
    }

    task.assignedTo = assignedTo || null;
    await task.save();

    await task.populate("assignedTo", "name email");
    await task.populate("project", "title");

    return apiResponse(true, { task: formatTaskWithOverdue(task) }, "Task assignment updated successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
