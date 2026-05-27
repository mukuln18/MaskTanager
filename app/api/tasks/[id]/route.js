import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import { apiResponse, apiError } from "@/lib/api-response";
import { checkProjectAccess, formatTaskWithOverdue } from "@/lib/helpers/auth-checks";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid task ID", 400);
    }

    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    if (!task) return apiResponse(false, null, "Task not found", 404);

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const accessCheck = await checkProjectAccess(task.project._id, userId, userRole, false);
    if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);

    return apiResponse(true, { task: formatTaskWithOverdue(task) }, "Task fetched successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid task ID", 400);
    }

    const task = await Task.findById(id);
    if (!task) return apiResponse(false, null, "Task not found", 404);

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const accessCheck = await checkProjectAccess(task.project, userId, userRole, true);
    if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);

    const body = await request.json();
    const { title, description, dueDate, assignedTo } = body;

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    if (assignedTo !== undefined) {
      task.assignedTo = assignedTo || null;
    }

    await task.save();

    await task.populate("assignedTo", "name email");
    await task.populate("project", "title");

    return apiResponse(true, { task: formatTaskWithOverdue(task) }, "Task updated successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid task ID", 400);
    }

    const task = await Task.findById(id);
    if (!task) return apiResponse(false, null, "Task not found", 404);

    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // Only Admin OR Project Creator can delete tasks
    const accessCheck = await checkProjectAccess(task.project, userId, userRole, true);
    if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);

    await Task.findByIdAndDelete(id);

    return apiResponse(true, null, "Task deleted successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
