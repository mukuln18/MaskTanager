import { apiResponse } from "@/lib/api-response";

export async function POST() {
  const response = apiResponse(true, null, "Logout successful", 200);
  
  // Clear the cookie by setting maxAge to 0
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
