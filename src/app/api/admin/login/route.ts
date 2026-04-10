import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAdminSession, logAdminAction } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(email, password);

    if (!result.success || !result.admin) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    // Créer la session
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const session = await createAdminSession(result.admin.id, ipAddress, userAgent);

    // Logger la connexion
    await logAdminAction({
      adminId: result.admin.id,
      action: 'ADMIN_LOGIN',
      targetType: 'ADMIN',
      targetId: result.admin.id,
      ipAddress,
      userAgent,
    });

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: result.admin.id,
        email: result.admin.email,
        fullName: result.admin.fullName,
        phone: result.admin.phone,
        role: result.admin.role,
        status: result.admin.status,
        avatarUrl: result.admin.avatarUrl,
        permissions: result.admin.permissions ? JSON.parse(result.admin.permissions) : [],
        twoFactorEnabled: result.admin.twoFactorEnabled,
        lastLoginAt: result.admin.lastLoginAt?.toISOString(),
        createdAt: result.admin.createdAt.toISOString(),
      },
    });

    // Définir le cookie de session (httpOnly pour la sécurité)
    response.cookies.set('admin_session', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 heures
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
