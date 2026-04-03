"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    client: {
      fullName: string;
      avatarUrl?: string;
    };
  };
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function renderStars(rating: number): React.ReactNode {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 fill-amber-400 text-amber-400"
        />
      );
    } else {
      stars.push(
        <Star key={i} className="h-4 w-4 text-gray-300" />
      );
    }
  }
  return stars;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { rating, comment, createdAt, client } = review;

  return (
    <Card className="border border-gray-200/50 hover:border-primary/20 transition-colors">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={client.avatarUrl} alt={client.fullName} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(client.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{client.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">{renderStars(rating)}</div>
          </div>

          {/* Comment */}
          {comment && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {comment}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
