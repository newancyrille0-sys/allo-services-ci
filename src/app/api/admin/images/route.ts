import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET - Récupérer toutes les images admin
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: any = {};
    if (category) {
      where.category = category;
    }

    const images = await prisma.adminImage.findMany({
      where,
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des images" },
      { status: 500 }
    );
  }
}

// POST - Upload une nouvelle image
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const altText = formData.get("altText") as string;
    const category = formData.get("category") as string || "general";

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPEG, PNG, GIF ou WebP" },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Le fichier est trop volumineux. Maximum 5MB" },
        { status: 400 }
      );
    }

    // Créer le dossier d'upload si nécessaire
    const uploadDir = path.join(process.cwd(), "public", "uploads", "admin");
    await mkdir(uploadDir, { recursive: true });

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${randomStr}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Écrire le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // URL publique
    const url = `/uploads/admin/${filename}`;

    // Sauvegarder en base de données
    const image = await prisma.adminImage.create({
      data: {
        url,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        title,
        altText,
        category,
        uploadedById: admin.id,
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'image" },
      { status: 500 }
    );
  }
}
