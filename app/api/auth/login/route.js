import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { comparePasswords, signToken } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-response";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiResponse(false, null, "Please provide email and password", 400);
    }

    // Include password in selection to compare
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return apiResponse(false, null, "Invalid credentials", 401);
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return apiResponse(false, null, "Invalid credentials", 401);
    }

    // Generate JWT
    const token = await signToken({ userId: user._id.toString(), role: user.role });

    const userObj = user.toObject();
    delete userObj.password;

    const response = apiResponse(true, { user: userObj }, "Login successful", 200);
    
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
