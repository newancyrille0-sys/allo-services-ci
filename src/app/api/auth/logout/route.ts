import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get("session_token")?.value;

    if (sessionToken) {
      // Delete session from database
      try {
        await db.session.deleteMany({
          where: { sessionToken },
        });
      } catch {
        // Ignore errors if session doesn't exist
      }
    }

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });

    response.cookies.delete("session_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    
    // Still try to clear the cookie
    const response = NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });
    response.cookies.delete("session_token");
    
    return response;
  }
}
