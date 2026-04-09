import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const session = await prisma.adminSession.findUnique({
      where: { sessionToken },
      include: { admin: true },
    });

    if (!session || session.expires < new Date()) {
      // Session expirée
      if (session) {
        await prisma.adminSession.delete({ where: { id: session.id } });
      }
      return NextResponse.json(
        { success: false, error: 'Session expirée' },
        { status: 401 }
      );
    }

    // Vérifier que l'admin est actif
    if (session.admin.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: 'Compte désactivé' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: session.admin.id,
        email: session.admin.email,
        fullName: session.admin.fullName,
        phone: session.admin.phone,
        role: session.admin.role,
        status: session.admin.status,
        avatarUrl: session.admin.avatarUrl,
        permissions: session.admin.permissions ? JSON.parse(session.admin.permissions) : [],
        twoFactorEnabled: session.admin.twoFactorEnabled,
        lastLoginAt: session.admin.lastLoginAt?.toISOString(),
        createdAt: session.admin.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Get admin error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
