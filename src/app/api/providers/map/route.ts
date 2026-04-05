import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Villes de Côte d'Ivoire avec coordonnées
const CITIES_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Abidjan": { lat: 5.3599, lng: -4.0083 },
  "Abobo": { lat: 5.4292, lng: -4.0167 },
  "Adjamé": { lat: 5.3667, lng: -4.0167 },
  "Attécoubé": { lat: 5.3833, lng: -4.0333 },
  "Cocody": { lat: 5.3333, lng: -3.9833 },
  "Koumassi": { lat: 5.3000, lng: -3.9667 },
  "Marcory": { lat: 5.3167, lng: -4.0000 },
  "Plateau": { lat: 5.3333, lng: -4.0333 },
  "Treichville": { lat: 5.3000, lng: -4.0167 },
  "Yopougon": { lat: 5.2667, lng: -4.0833 },
  "Bingerville": { lat: 5.3500, lng: -3.8833 },
  "Songon": { lat: 5.2167, lng: -4.1500 },
  "Riviera": { lat: 5.3667, lng: -3.9333 },
  "Bouaké": { lat: 7.6892, lng: -5.0308 },
  "Yamoussoukro": { lat: 6.8167, lng: -5.2833 },
  "Daloa": { lat: 6.8778, lng: -6.4494 },
  "San-Pédro": { lat: 4.7500, lng: -6.6333 },
  "Korhogo": { lat: 9.4583, lng: -5.6333 },
  "Man": { lat: 7.4064, lng: -7.5558 },
  "Gagnoa": { lat: 6.1333, lng: -5.9500 },
  "Divo": { lat: 5.8333, lng: -5.3667 },
  "Abengourou": { lat: 6.7333, lng: -3.5000 },
  "Agboville": { lat: 5.9333, lng: -4.2167 },
  "Grand-Bassam": { lat: 5.2167, lng: -3.7333 },
  "Assinie": { lat: 5.1000, lng: -3.4833 },
};

// Coordonnées par défaut pour les prestataires sans GPS
function getCoordinatesForCity(city: string | null): { lat: number; lng: number } {
  if (city && CITIES_COORDINATES[city]) {
    return CITIES_COORDINATES[city];
  }
  // Abidjan par défaut
  return CITIES_COORDINATES["Abidjan"];
}

// Prestataires mock pour la démonstration
const MOCK_PROVIDERS = [
  {
    id: "provider-1",
    name: "Plomberie Express",
    service: "Plomberie",
    city: "Cocody",
    rating: 4.9,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: true,
    latitude: 5.3333,
    longitude: -3.9833,
  },
  {
    id: "provider-2",
    name: "Beauty Home Services",
    service: "Coiffure & Esthétique",
    city: "Riviera",
    rating: 5.0,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: true,
    latitude: 5.3667,
    longitude: -3.9333,
  },
  {
    id: "provider-3",
    name: "Élec Pro CI",
    service: "Électricité",
    city: "Marcory",
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: false,
    latitude: 5.3167,
    longitude: -4.0000,
  },
  {
    id: "provider-4",
    name: "Ménage Premium",
    service: "Ménage",
    city: "Plateau",
    rating: 4.9,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: true,
    latitude: 5.3333,
    longitude: -4.0333,
  },
  {
    id: "provider-5",
    name: "Jardin Pro",
    service: "Jardinage",
    city: "Bingerville",
    rating: 4.7,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: false,
    latitude: 5.3500,
    longitude: -3.8833,
  },
  {
    id: "provider-6",
    name: "Clim Services",
    service: "Climatisation",
    city: "Yopougon",
    rating: 4.8,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: false,
    latitude: 5.2667,
    longitude: -4.0833,
  },
  {
    id: "provider-7",
    name: "Livraison Express",
    service: "Livraison",
    city: "Treichville",
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: false,
    latitude: 5.3000,
    longitude: -4.0167,
  },
  {
    id: "provider-8",
    name: "Peinture Pro",
    service: "Peinture",
    city: "Abobo",
    rating: 4.9,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: true,
    latitude: 5.4292,
    longitude: -4.0167,
  },
  {
    id: "provider-9",
    name: "Serrurerie 225",
    service: "Serrurerie",
    city: "Adjamé",
    rating: 4.7,
    reviewCount: 45,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: false,
    latitude: 5.3667,
    longitude: -4.0167,
  },
  {
    id: "provider-10",
    name: "Bricolage Plus",
    service: "Bricolage",
    city: "Koumassi",
    rating: 4.6,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    isVerified: true,
    isPremium: false,
    latitude: 5.3000,
    longitude: -3.9667,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const service = searchParams.get("service");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius") || "10"; // km

  try {
    // Récupérer les prestataires depuis la base de données avec leurs coordonnées GPS
    let dbProviders: any[] = [];
    
    try {
      dbProviders = await db.provider.findMany({
        where: {
          isActive: true,
        },
        include: {
          user: {
            select: {
              fullName: true,
              avatarUrl: true,
              city: true,
            },
          },
          reviews: {
            select: { rating: true },
          },
        },
        take: 50,
      });
    } catch (dbError) {
      console.log("Using mock providers data - DB not available");
    }

    // Transformer les données de la base de données
    let providers = dbProviders.length > 0 
      ? dbProviders.map((p) => {
          const avgRating = p.reviews.length > 0
            ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length
            : 4.5;
          
          // Utiliser les vraies coordonnées GPS ou les coordonnées de la ville
          const coordinates = p.latitude && p.longitude
            ? { lat: p.latitude, lng: p.longitude }
            : getCoordinatesForCity(p.user?.city || null);
          
          return {
            id: p.id,
            name: p.businessName || p.user?.fullName || "Prestataire",
            service: "Services", // Peut être enrichi avec les catégories
            city: p.user?.city || "Abidjan",
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: p.reviews.length,
            image: p.user?.avatarUrl || "https://via.placeholder.com/100",
            isVerified: p.isVerified,
            isPremium: p.subscriptionStatus !== "FREE",
            coordinates,
            hasGpsLocation: !!(p.latitude && p.longitude),
          };
        })
      : MOCK_PROVIDERS.map((p) => ({
          ...p,
          coordinates: p.latitude && p.longitude
            ? { lat: p.latitude, lng: p.longitude }
            : getCoordinatesForCity(p.city),
          hasGpsLocation: !!(p.latitude && p.longitude),
        }));

    // Filtrer par ville si spécifiée
    if (city) {
      providers = providers.filter((p: any) => 
        p.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filtrer par service si spécifié
    if (service) {
      providers = providers.filter((p: any) => 
        p.service.toLowerCase().includes(service.toLowerCase())
      );
    }

    // Filtrer par rayon si coordonnées spécifiées
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxRadius = parseFloat(radius);

      providers = providers.filter((p: any) => {
        if (!p.coordinates) return false;
        const distance = calculateDistance(
          userLat,
          userLng,
          p.coordinates.lat,
          p.coordinates.lng
        );
        (p as any).distance = Math.round(distance * 10) / 10;
        return distance <= maxRadius;
      });

      // Trier par distance
      providers.sort((a: any, b: any) => a.distance - b.distance);
    }

    return NextResponse.json({
      providers,
      total: providers.length,
      center: {
        lat: lat ? parseFloat(lat) : 5.3599, // Abidjan par défaut
        lng: lng ? parseFloat(lng) : -4.0083,
      },
      cities: Object.keys(CITIES_COORDINATES),
      bounds: {
        minLat: 4.0,
        maxLat: 10.5,
        minLng: -8.5,
        maxLng: -2.0,
      },
      country: "Côte d'Ivoire",
    });
  } catch (error) {
    console.error("Error fetching providers map:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des prestataires" },
      { status: 500 }
    );
  }
}

// Calculer la distance entre deux points (formule de Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
