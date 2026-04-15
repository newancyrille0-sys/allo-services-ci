import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import path from "path";

// DELETE - Supprimer une image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const image = await prisma.adminImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer le fichier du disque
    try {
      const filepath = path.join(process.cwd(), "public", image.url);
      await unlink(filepath);
    } catch (e) {
      // Ignorer si le fichier n'existe pas
      console.log("File not found on disk, continuing with DB delete");
    }

    // Supprimer de la base de données
    await prisma.adminImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Image supprimée" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
}
