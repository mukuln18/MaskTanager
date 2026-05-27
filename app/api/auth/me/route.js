import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { apiResponse, apiError } from "@/lib/api-response";

/**
 * GET /api/auth/me
 * Returns the current authenticated user.
 * The proxy middleware (proxy.js) injects x-user-id because /api/auth/me
 * is explicitly excluded from the auth-passthrough skip list.
 */
export async function GET(request) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return apiResponse(false, null, "Authentication required", 401);
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return apiResponse(false, null, "User not found", 404);
    }

    return apiResponse(true, { user }, "User fetched successfully", 200);
  } catch (error) {
    return apiError(error, 500);
  }
}
