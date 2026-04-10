import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value;

    if (sessionToken) {
      // Supprimer la session de la base de données
      await prisma.adminSession.deleteMany({
        where: { sessionToken },
      });
    }

    // Créer la réponse et supprimer le cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
