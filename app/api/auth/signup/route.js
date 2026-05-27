import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return apiResponse(false, null, "Please provide all required fields", 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return apiResponse(false, null, "Email is already registered", 400);
    }

    const hashedPassword = await hashPassword(password);

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "member";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT
    const token = await signToken({ userId: user._id.toString(), role: user.role });

    const userObj = user.toObject();
    delete userObj.password;

    const response = apiResponse(true, { user: userObj }, "Signup successful", 201);
    
    // Set secure cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return apiError(error, 500);
  }
}
