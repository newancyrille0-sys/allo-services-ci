"use client";

import * as React from "react";
import Link from "next/link";
import { Radio, Image, Film, Play, Eye, ArrowRight, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface Publication {
  id: string;
  type: "photo" | "video";
  mediaUrl: string;
  caption?: string;
  thumbnailUrl?: string;
  viewCount: number;
  createdAt: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    businessName?: string;
  };
}

interface ActiveLive {
  id: string;
  title: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    businessName?: string;
  };
  viewerCount: number;
}

// Mock data
const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: "1",
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    caption: "Installation électrique professionnelle",
    viewCount: 1234,
    createdAt: new Date().toISOString(),
    provider: {
      id: "p1",
      name: "Électro Services",
      businessName: "Électro Services Plus",
    },
  },
  {
    id: "2",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400",
    caption: "Travail de plomberie terminé",
    viewCount: 856,
    createdAt: new Date().toISOString(),
    provider: {
      id: "p2",
      name: "Plomberie Express",
      businessName: "Plomberie Express Abidjan",
    },
  },
  {
    id: "3",
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400",
    caption: "Démonstration de ménage professionnel",
    viewCount: 2100,
    createdAt: new Date().toISOString(),
    provider: {
      id: "p3",
      name: "Ménage Pro",
    },
  },
  {
    id: "4",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    caption: "Jardinage paysager",
    viewCount: 543,
    createdAt: new Date().toISOString(),
    provider: {
      id: "p4",
      name: "Jardinage Vert",
    },
  },
];

const MOCK_LIVES: ActiveLive[] = [
  {
    id: "live1",
    title: "Démonstration en direct",
    provider: {
      id: "p1",
      name: "Électro Services",
    },
    viewerCount: 45,
  },
];

// Live Indicator Component
function LiveIndicator({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
    </span>
  );
}

// Publication Card Component
function PublicationCard({ publication }: { publication: Publication }) {
  const isVideo = publication.type === "video";

  return (
    <Link href={`/publications`} className="group block">
      <Card className="overflow-hidden border-0 shadow-none bg-transparent">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={publication.mediaUrl}
            alt={publication.caption || "Publication"}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Video overlay */}
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="h-5 w-5 text-gray-900 fill-gray-900 ml-1" />
              </div>
            </div>
          )}
          
          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-0 text-[10px]">
              {isVideo ? <Film className="h-3 w-3 mr-1" /> : <Image className="h-3 w-3 mr-1" />}
              {isVideo ? "Vidéo" : "Photo"}
            </Badge>
          </div>
          
          {/* View count */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-0 text-[10px]">
              <Eye className="h-3 w-3 mr-1" />
              {publication.viewCount.toLocaleString('fr-FR')}
            </Badge>
          </div>
        </div>
        
        {/* Provider info */}
        <div className="mt-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">
              {publication.provider.name.charAt(0)}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-700 truncate">
            {publication.provider.businessName || publication.provider.name}
          </span>
        </div>
      </Card>
    </Link>
  );
}

// Live Card Component
function LiveCard({ live }: { live: ActiveLive }) {
  return (
    <Link href={`/live/${live.id}`} className="block">
      <Card className="overflow-hidden border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Radio className="h-8 w-8 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 border-0">
                  LIVE
                </Badge>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{live.title}</p>
              <p className="text-xs text-gray-600 truncate">{live.provider.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <LiveIndicator />
                <span className="text-xs text-red-600 font-medium">
                  {live.viewerCount} spectateurs
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PublicationsFeed() {
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [activeLives, setActiveLives] = React.useState<ActiveLive[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPublications(MOCK_PUBLICATIONS);
      setActiveLives(MOCK_LIVES);
      setIsLoading(false);
    }, 500);
  }, []);

  // Get only first 4 publications for homepage
  const displayPublications = publications.slice(0, 4);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#fd7613] font-bold tracking-widest text-sm uppercase">
              Découvrez
            </span>
            <h2 className="font-headline text-4xl font-extrabold text-editorial text-[#181c1d] mt-2">
              Publications
            </h2>
            <p className="text-[#70787c] mt-2 max-w-xl">
              Photos et vidéos partagées par nos prestataires. Découvrez leur travail en images.
            </p>
          </div>
          <Link href="/publications">
            <Button variant="outline" className="rounded-full">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Active Lives */}
        {activeLives.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <LiveIndicator />
              <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
                En Direct ({activeLives.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeLives.map((live) => (
                <LiveCard key={live.id} live={live} />
              ))}
            </div>
          </div>
        )}

        {/* Publications Grid */}
        {isLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[3/4] rounded-2xl" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : publications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Aucune publication disponible</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {displayPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-[#004150]">
                {publications.filter(p => p.type === "photo").length}
              </p>
              <p className="text-sm text-[#70787c]">Photos</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-[#004150]">
                {publications.filter(p => p.type === "video").length}
              </p>
              <p className="text-sm text-[#70787c]">Vidéos</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-bold text-red-500">
                {activeLives.length}
              </p>
              <p className="text-sm text-[#70787c]">En direct</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationsFeed;
