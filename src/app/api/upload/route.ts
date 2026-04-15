import { NextRequest, NextResponse } from "next/server";
import { handleUpload } from "@/lib/upload";
import { getServerSession } from "next-auth";

// POST /api/upload - Upload a file
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";
    const type = formData.get("type") as string || "general";

    if (!file) {
      return NextResponse.json(
        { error: "Fichier requis" },
        { status: 400 }
      );
    }

    // Set allowed types based on upload type
    let allowedTypes: string[] = [];
    let maxSize = 10 * 1024 * 1024; // 10MB default

    switch (type) {
      case "profile":
        allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        maxSize = 5 * 1024 * 1024; // 5MB
        break;
      case "kyc":
        allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        maxSize = 10 * 1024 * 1024; // 10MB
        break;
      case "publication":
        allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
        maxSize = 50 * 1024 * 1024; // 50MB
        break;
      case "portfolio":
        allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        maxSize = 10 * 1024 * 1024; // 10MB
        break;
      default:
        allowedTypes = ["image/*", "application/pdf"];
    }

    // Upload file
    const result = await handleUpload(file, {
      folder,
      maxSize,
      allowedTypes,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}
