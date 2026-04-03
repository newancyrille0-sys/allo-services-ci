import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Allowed document types for KYC
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

// Upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir(subdir: string) {
  const dir = path.join(UPLOAD_DIR, subdir);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

// Generate unique filename
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // cni, registre_commerce, other
    const userId = formData.get('userId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Fichier requis' },
        { status: 400 }
      );
    }

    if (!type || !['cni', 'registre_commerce', 'other'].includes(type)) {
      return NextResponse.json(
        { error: 'Type invalide (cni, registre_commerce, other)' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_DOC_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Formats acceptés: PDF, JPEG, PNG, WebP' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_DOC_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximum: 10MB' },
        { status: 400 }
      );
    }

    // Determine subdirectory
    const subdir = 'documents';

    // Ensure directory exists
    const uploadDir = await ensureUploadDir(subdir);

    // Generate filename with user prefix if available
    const filename = userId
      ? `${userId.slice(0, 8)}-${type}-${generateFilename(file.name)}`
      : generateFilename(file.name);
    const filepath = path.join(uploadDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${subdir}/${filename}`;

    return NextResponse.json({
      success: true,
      file: {
        url: publicUrl,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        documentType: type,
      },
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du document' },
      { status: 500 }
    );
  }
}
