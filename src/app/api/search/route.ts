import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const searchSchema = z.object({
  q: z.string().min(1, 'Terme de recherche requis'),
  type: z.enum(['all', 'services', 'providers']).default('all'),
  city: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate input
    const validationResult = searchSchema.safeParse({
      q: searchParams.get('q'),
      type: searchParams.get('type') || 'all',
      city: searchParams.get('city') || undefined,
      category: searchParams.get('category') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 10,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { q, type, city, category, page, limit } = validationResult.data;
    const skip = (page - 1) * limit;
    const searchTerm = `%${q.toLowerCase()}%`;

    const results: {
      services: unknown[];
      providers: unknown[];
    } = {
      services: [],
      providers: [],
    };

    // Search services
    if (type === 'all' || type === 'services') {
      const services = await db.service.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: type === 'services' ? limit : 5,
        skip: type === 'services' ? skip : 0,
      });

      results.services = services.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        iconUrl: s.iconUrl,
        type: 'service',
      }));
    }

    // Search providers
    if (type === 'all' || type === 'providers') {
      // Build provider where clause
      const providerWhere: Record<string, unknown> = {
        isActive: true,
        isVerified: true,
        OR: [
          { businessName: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { categories: { contains: q, mode: 'insensitive' } },
        ],
      };

      // Filter by city
      if (city) {
        providerWhere.user = { city: { contains: city, mode: 'insensitive' } };
      }

      // Filter by category
      if (category) {
        providerWhere.categories = { contains: category };
      }

      const providers = await db.provider.findMany({
        where: providerWhere,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              city: true,
            },
          },
        },
        orderBy: [
          { subscriptionStatus: 'desc' }, // PREMIUM first
          { averageRating: 'desc' },
        ],
        take: type === 'providers' ? limit : 5,
        skip: type === 'providers' ? skip : 0,
      });

      results.providers = providers.map((p) => ({
        id: p.id,
        businessName: p.businessName,
        description: p.description?.substring(0, 150),
        rating: p.averageRating,
        totalReviews: p.totalReviews,
        subscriptionStatus: p.subscriptionStatus,
        isVerified: p.isVerified,
        city: p.user.city,
        type: 'provider',
        user: p.user,
      }));
    }

    // Get total counts
    const servicesTotal = type === 'all' || type === 'services'
      ? await db.service.count({
          where: {
            isActive: true,
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          },
        })
      : 0;

    const providersTotal = type === 'all' || type === 'providers'
      ? await db.provider.count({
          where: {
            isActive: true,
            OR: [
              { businessName: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { categories: { contains: q, mode: 'insensitive' } },
            ],
          },
        })
      : 0;

    return NextResponse.json({
      query: q,
      results,
      pagination: type === 'services'
        ? { page, limit, total: servicesTotal, totalPages: Math.ceil(servicesTotal / limit) }
        : type === 'providers'
        ? { page, limit, total: providersTotal, totalPages: Math.ceil(providersTotal / limit) }
        : undefined,
      totals: {
        services: servicesTotal,
        providers: providersTotal,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' },
      { status: 500 }
    );
  }
}
