import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import { apiResponse, apiError } from "@/lib/api-response";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid project ID", 400);
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return apiResponse(false, null, "Invalid user ID", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
      return apiResponse(false, null, "User not found", 404);
    }

    const project = await Project.findById(id);
    if (!project) {
      return apiResponse(false, null, "Project not found", 404);
    }

    if (project.members.includes(userId)) {
      return apiResponse(false, null, "User is already a member", 400);
    }

    project.members.push(userId);
    await project.save();

    // Synchronize user document
    if (!user.projects.includes(id)) {
      user.projects.push(id);
      await user.save();
    }

    return apiResponse(true, { project }, "Member added successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid project ID", 400);
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return apiResponse(false, null, "Invalid user ID", 400);
    }

    const project = await Project.findById(id);
    if (!project) {
      return apiResponse(false, null, "Project not found", 404);
    }

    project.members = project.members.filter((memberId) => memberId.toString() !== userId);
    await project.save();

    const user = await User.findById(userId);
    if (user) {
      user.projects = user.projects.filter((projId) => projId.toString() !== id);
      await user.save();
    }

    return apiResponse(true, { project }, "Member removed successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
