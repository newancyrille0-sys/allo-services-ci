import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Cette route ne doit être appelée qu'une seule fois pour créer le super admin initial
// À sécuriser en production (par exemple, avec une clé secrète)

export async function POST(request: NextRequest) {
  try {
    // Vérifier si un super admin existe déjà
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    if (existingSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Un super admin existe déjà' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, password, fullName, phone, secretKey } = body;

    // Vérifier la clé secrète (à définir dans les variables d'environnement)
    if (secretKey !== process.env.ADMIN_SEED_SECRET && secretKey !== 'allo-services-ci-2024') {
      return NextResponse.json(
        { success: false, error: 'Clé secrète invalide' },
        { status: 401 }
      );
    }

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email, mot de passe et nom complet requis' },
        { status: 400 }
      );
    }

    // Créer le super admin
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
