import { NextResponse } from "next/server";

/**
 * Standardized API response format
 * @param {boolean} success - Indicates if the request was successful
 * @param {any} data - The payload to return
 * @param {string} message - A human-readable message
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function apiResponse(success, data = null, message = "", status = 200) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
}

/**
 * Standardized error handling utility for API routes
 * @param {Error|string} error - The error object or message
 * @param {number} status - HTTP status code (defaults to 500)
 * @returns {NextResponse}
 */
export function apiError(error, status = 500) {
  console.error("API Error:", error);
  
  const message = error instanceof Error ? error.message : error || "Internal Server Error";
  
  return apiResponse(false, null, message, status);
}
