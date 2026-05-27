import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { apiResponse, apiError } from "@/lib/api-response";
import { checkProjectAccess, formatTaskWithOverdue } from "@/lib/helpers/auth-checks";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectToDatabase();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // Discover which projects the user can access
    let projectIds = [];
    if (userRole === "admin") {
      const allProjects = await Project.find().select("_id");
      projectIds = allProjects.map(p => p._id);
    } else {
      const userProjects = await Project.find({
        $or: [{ createdBy: userId }, { members: userId }]
      }).select("_id");
      projectIds = userProjects.map(p => p._id);
    }

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    
    // Allow filtering by a specific project
    let filter = { project: { $in: projectIds } };
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return apiResponse(false, null, "Invalid project ID parameter", 400);
      }
      
      const accessCheck = await checkProjectAccess(projectId, userId, userRole, false);
      if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);
      
      filter = { project: projectId };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("project", "title")
      .sort({ dueDate: 1, createdAt: -1 });

    const formattedTasks = tasks.map(formatTaskWithOverdue);

    return apiResponse(true, { tasks: formattedTasks }, "Tasks fetched successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    const body = await request.json();
    const { title, description, projectId, assignedTo, dueDate } = body;

    if (!title || !projectId) {
      return apiResponse(false, null, "Title and projectId are required", 400);
    }

    // Verify project membership/admin status to create task in it
    const accessCheck = await checkProjectAccess(projectId, userId, userRole, true);
    if (accessCheck.error) return apiResponse(false, null, accessCheck.error, accessCheck.status);

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      status: "todo"
    });

    await task.populate("assignedTo", "name email");
    await task.populate("project", "title");

    return apiResponse(true, { task: formatTaskWithOverdue(task) }, "Task created successfully", 201);
  } catch (error) {
    return apiError(error, 500);
  }
}
