import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { SERVICE_CATEGORIES } from '@/lib/constants/services';

const suggestionsSchema = z.object({
  q: z.string().min(1, 'Terme de recherche requis'),
  limit: z.coerce.number().int().positive().max(10).default(5),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validationResult = suggestionsSchema.safeParse({
      q: searchParams.get('q'),
      limit: searchParams.get('limit') || 5,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { q, limit } = validationResult.data;
    const suggestions: Array<{ text: string; type: 'service' | 'category' | 'provider' }> = [];

    // Get matching services from database
    const services = await db.service.findMany({
      where: {
        isActive: true,
        name: { contains: q, mode: 'insensitive' },
      },
      take: limit,
    });

    services.forEach((s) => {
      suggestions.push({
        text: s.name,
        type: 'service',
      });
    });

    // Get matching categories from constants
    const matchingCategories = SERVICE_CATEGORIES.filter((cat) =>
      cat.name.toLowerCase().includes(q.toLowerCase())
    ).slice(0, limit);

    matchingCategories.forEach((cat) => {
      suggestions.push({
        text: cat.name,
        type: 'category',
      });
    });

    // Get matching providers
    if (suggestions.length < limit) {
      const providers = await db.provider.findMany({
        where: {
          isActive: true,
          businessName: { contains: q, mode: 'insensitive' },
        },
        take: limit - suggestions.length,
      });

      providers.forEach((p) => {
        suggestions.push({
          text: p.businessName || '',
          type: 'provider',
        });
      });
    }

    // Remove duplicates and limit results
    const uniqueSuggestions = Array.from(
      new Map(suggestions.map((s) => [s.text.toLowerCase(), s])).values()
    ).slice(0, limit);

    return NextResponse.json({
      query: q,
      suggestions: uniqueSuggestions,
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des suggestions' },
      { status: 500 }
    );
  }
}
