import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // In a real app with sessions, you would destroy the session here
    // With JWT, the client just needs to delete the token
    
    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
