"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PublicationCardProps {
  type: "photo" | "video";
  mediaUrl: string;
  caption?: string;
  providerName: string;
  providerAvatar?: string;
  expiresAt?: Date | string;
  viewCount?: number;
  className?: string;
  onClick?: () => void;
}

export function PublicationCard({
  type,
  mediaUrl,
  caption,
  providerName,
  providerAvatar,
  expiresAt,
  viewCount = 0,
  className,
  onClick,
}: PublicationCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState("");

  // Calculate time remaining with live countdown
  React.useEffect(() => {
    if (!expiresAt) {
      setTimeLeft("");
      return;
    }

    const updateTimeLeft = () => {
      const expiry = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
      const diff = expiry.getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Expiré");
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted cursor-pointer transition-all duration-300 hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media */}
      {!imageError ? (
        <Image
          src={mediaUrl}
          alt={caption || `Publication de ${providerName}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image non disponible</span>
        </div>
      )}

      {/* Video Play Icon */}
      {type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Provider Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 border-2 border-white/50">
            <AvatarImage src={providerAvatar} alt={providerName} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {providerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {providerName}
            </p>
            {caption && (
              <p className="text-[10px] text-white/80 truncate">
                {caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Top Badges */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
        {/* Time Remaining Badge (for stories) */}
        {timeLeft && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-white bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Clock className="h-3 w-3" />
            {timeLeft}
          </span>
        )}

        {/* View Count */}
        {viewCount > 0 && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-white bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Eye className="h-3 w-3" />
            {viewCount > 999 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount}
          </span>
        )}
      </div>

      {/* Hover Caption */}
      {caption && isHovered && (
        <div className="absolute inset-x-0 bottom-14 p-3 bg-black/70 backdrop-blur-sm">
          <p className="text-xs text-white line-clamp-2">{caption}</p>
        </div>
      )}
    </div>
  );
}

export default PublicationCard;
