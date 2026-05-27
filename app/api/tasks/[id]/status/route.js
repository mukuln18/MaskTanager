import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
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
    const { status } = body;

    const validStatuses = ["todo", "in-progress", "done"];
    if (!status || !validStatuses.includes(status)) {
      return apiResponse(false, null, `Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400);
    }

    const task = await Task.findById(id);
    if (!task) return apiResponse(false, null, "Task not found", 404);

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const accessCheck = await checkProjectAccess(task.project, userId, userRole, false);
    if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);

    task.status = status;
    await task.save();

    await task.populate("assignedTo", "name email");
    await task.populate("project", "title");

    return apiResponse(true, { task: formatTaskWithOverdue(task) }, "Task status updated successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
