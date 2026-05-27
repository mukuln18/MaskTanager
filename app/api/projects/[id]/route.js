import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import { apiResponse, apiError } from "@/lib/api-response";
import { requireRole } from "@/lib/middleware/roles";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid project ID", 400);
    }

    const project = await Project.findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return apiResponse(false, null, "Project not found", 404);
    }

    return apiResponse(true, { project }, "Project fetched successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid project ID", 400);
    }

    const body = await request.json();
    const { title, description } = body;

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: { title, description } },
      { new: true, runValidators: true }
    );

    if (!project) {
      return apiResponse(false, null, "Project not found", 404);
    }

    return apiResponse(true, { project }, "Project updated successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    // Only admin can delete projects
    const roleError = requireRole(request, ["admin"]);
    if (roleError) return roleError;

    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid project ID", 400);
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return apiResponse(false, null, "Project not found", 404);
    }

    return apiResponse(true, null, "Project deleted successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
