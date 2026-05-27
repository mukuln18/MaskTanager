import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import { apiResponse, apiError } from "@/lib/api-response";
import { requireRole } from "@/lib/middleware/roles";

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    return apiResponse(true, { projects }, "Projects fetched successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function POST(request) {
  try {
    // Only admin can create projects
    const roleError = requireRole(request, ["admin"]);
    if (roleError) return roleError;

    await connectToDatabase();

    const body = await request.json();
    const { title, description, members } = body;

    if (!title) {
      return apiResponse(false, null, "Project title is required", 400);
    }

    const userId = request.headers.get("x-user-id");

    const newProject = await Project.create({
      title,
      description,
      members: members || [],
      createdBy: userId,
    });

    return apiResponse(true, { project: newProject }, "Project created successfully", 201);
  } catch (error) {
    return apiError(error, 500);
  }
}
