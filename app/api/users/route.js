import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { apiResponse, apiError } from "@/lib/api-response";
import { hashPassword } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectToDatabase();
    // Allow all authenticated users to fetch basic user list for assignment dropdowns
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return apiResponse(true, { users }, "Users fetched successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const userRole = request.headers.get("x-user-role");
    
    if (userRole !== "admin") {
      return apiResponse(false, null, "Forbidden: Only admins can create users", 403);
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return apiResponse(false, null, "Please provide name, email, and password", 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return apiResponse(false, null, "Email is already registered", 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "member",
    });

    const userObj = user.toObject();
    delete userObj.password;

    return apiResponse(true, { user: userObj }, "User created successfully", 201);
  } catch (error) {
    return apiError(error, 500);
  }
}
