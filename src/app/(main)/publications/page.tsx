"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, Radio, Image, Film } from "lucide-react";
import { LiveIndicator, PublicationCard } from "@/components/publications";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface Publication {
  id: string;
  type: "photo" | "video";
  mediaUrl: string;
  caption?: string;
  expiresAt?: string;
  viewCount: number;
  createdAt: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ActiveLive {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  viewerCount: number;
  startedAt?: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function PublicationsPage() {
  const [publications, setPublications] = React.useState<Publication[]>([]);
  const [activeLives, setActiveLives] = React.useState<ActiveLive[]>([]);
  const [isLoadingPubs, setIsLoadingPubs] = React.useState(true);
  const [isLoadingLives, setIsLoadingLives] = React.useState(true);

  // Fetch publications
  React.useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch("/api/publications");
        if (response.ok) {
          const data = await response.json();
          setPublications(data);
        }
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setIsLoadingPubs(false);
      }
    };

    fetchPublications();
  }, []);

  // Fetch active lives with polling
  React.useEffect(() => {
    const fetchActiveLives = async () => {
      try {
        const response = await fetch("/api/lives/active");
        if (response.ok) {
          const data = await response.json();
          setActiveLives(data);
        }
      } catch (error) {
        console.error("Error fetching active lives:", error);
      } finally {
        setIsLoadingLives(false);
      }
    };

    fetchActiveLives();
    // Poll every 10 seconds for live updates
    const interval = setInterval(fetchActiveLives, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter publications by type
  const photos = publications.filter((p) => p.type === "photo");
  const videos = publications.filter((p) => p.type === "video");

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Fil d&apos;actualité
          </p>
          <h1 className="text-2xl font-extrabold mt-1 md:text-3xl">
            Publications
          </h1>
        </div>
      </div>

      {/* Active Lives Section */}
      {isLoadingLives ? (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="flex-shrink-0 w-64 h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : activeLives.length > 0 ? (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <LiveIndicator />
            <h2 className="text-lg font-bold">En Direct Maintenant</h2>
            <span className="text-xs text-muted-foreground">
              ({activeLives.length})
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {activeLives.map((live) => (
              <Link
                key={live.id}
                href={`/live/${live.id}`}
                className="flex-shrink-0 w-64 rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-36 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <Radio className="h-10 w-10 text-primary-foreground animate-pulse" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-destructive px-2 py-0.5 text-xs text-white font-semibold">
                    <LiveIndicator pulsing={false} className="h-2 w-2" />
                    LIVE
                  </div>
                  {live.viewerCount > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                      <span>{live.viewerCount} spectateurs</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold truncate">{live.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {live.provider.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Tabs: Photos & Videos */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
          <Image className="h-4 w-4" />
          Photos ({photos.length})
        </div>
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
          <Film className="h-4 w-4" />
          Vidéos ({videos.length})
        </div>
      </div>

      {/* Publications Grid */}
      {isLoadingPubs ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : publications.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-bold">Aucune publication</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Les prestataires n&apos;ont pas encore publié de contenu.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {publications.map((pub) => (
            <PublicationCard
              key={pub.id}
              type={pub.type}
              mediaUrl={pub.mediaUrl}
              caption={pub.caption}
              providerName={pub.provider.name}
              providerAvatar={pub.provider.avatar}
              expiresAt={pub.expiresAt}
              viewCount={pub.viewCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}
