import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedApiPrefix = "/api/";
const authApiPrefix = "/api/auth/";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Intercept all API routes except auth routes (but protect /api/auth/me)
  const isAuthRoute = pathname.startsWith(authApiPrefix) && pathname !== "/api/auth/me";
  
  if (pathname.startsWith(protectedApiPrefix) && !isAuthRoute) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("JWT_SECRET is missing in environment variables");
        throw new Error("Missing secret");
      }
      
      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(token, secretKey);
      
      // Safely convert userId: old tokens have it as a BSON ObjectId object {buffer:{...}},
      // new tokens (after the signToken fix) have it as a plain hex string.
      let userId = payload.userId;
      if (typeof userId === "object" && userId !== null && userId.buffer) {
        userId = Buffer.from(Object.values(userId.buffer)).toString("hex");
      } else {
        userId = String(userId ?? "");
      }

      // Pass the user context to the API route via headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", userId);
      requestHeaders.set("x-user-role", payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
