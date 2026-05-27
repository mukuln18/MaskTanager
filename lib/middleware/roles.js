import { apiResponse } from "@/lib/api-response";

/**
 * Validates if the user's role extracted from the request headers matches allowed roles.
 * Must be called inside the API Route Handler AFTER the global middleware has attached the headers.
 * 
 * @param {Request} request - The incoming Next.js API Request
 * @param {string[]} allowedRoles - Array of allowed roles (e.g., ['admin'])
 * @returns {NextResponse|null} - Returns an error response if unauthorized, or null if allowed.
 */
export function requireRole(request, allowedRoles) {
  const userRole = request.headers.get("x-user-role");

  if (!userRole || !allowedRoles.includes(userRole)) {
    return apiResponse(false, null, "Forbidden: Insufficient permissions", 403);
  }

  return null;
}
