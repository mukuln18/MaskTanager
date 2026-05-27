import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { apiResponse, apiError } from "@/lib/api-response";
import { hashPassword } from "@/lib/auth";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid user ID", 400);
    }

    const userRole = request.headers.get("x-user-role");
    const currentUserId = request.headers.get("x-user-id");
    
    if (userRole !== "admin" && currentUserId !== id) {
      return apiResponse(false, null, "Forbidden: Only admins can edit users", 403);
    }

    const user = await User.findById(id);
    if (!user) return apiResponse(false, null, "User not found", 404);

    const body = await request.json();
    const { name, email, role, password } = body;

    user.name = name || user.name;
    user.email = email || user.email;
    
    if (role && userRole === "admin") {
      user.role = role;
    }

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return apiResponse(true, { user: userObj }, "User updated successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse(false, null, "Invalid user ID", 400);
    }

    const userRole = request.headers.get("x-user-role");
    const currentUserId = request.headers.get("x-user-id");
    
    if (userRole !== "admin") {
      return apiResponse(false, null, "Forbidden: Only admins can delete users", 403);
    }
    
    if (currentUserId === id) {
       return apiResponse(false, null, "Cannot delete your own account", 400);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return apiResponse(false, null, "User not found", 404);

    return apiResponse(true, null, "User deleted successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
