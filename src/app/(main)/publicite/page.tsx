"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  Radio,
  MoreHorizontal,
  Send,
  Verified,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  TrendingUp,
  Flame,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LiveIndicator } from "@/components/publications";

// Types
interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

interface VideoPost {
  id: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
    businessName: string;
    category: string;
  };
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  type: "video" | "live";
  liveViewers?: number;
}

// Mock data pour les vidéos
const MOCK_VIDEOS: VideoPost[] = [
  {
    id: "1",
    provider: {
      id: "p1",
      name: "Plomberie Express",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      isVerified: true,
      businessName: "Plomberie Express",
      category: "Plomberie",
    },
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=700&fit=crop",
    caption: "🔧 Comment réparer une fuite d'eau en 5 minutes ! Suivez nos conseils d'experts #plomberie #bricolage #astuces",
    likes: 1247,
    comments: [
      {
        id: "c1",
        userId: "u1",
        userName: "Aminata K.",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
        content: "Super astuce ! Merci beaucoup 👏",
        likes: 23,
        isLiked: false,
        createdAt: "2024-01-15T10:30:00",
      },
      {
        id: "c2",
        userId: "u2",
        userName: "Yao K.",
        content: "J'ai testé et ça marche parfaitement !",
        likes: 15,
        isLiked: true,
        createdAt: "2024-01-15T11:45:00",
      },
    ],
    shares: 89,
    views: 15420,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2024-01-15T09:00:00",
    type: "video",
  },
  {
    id: "2",
    provider: {
      id: "p2",
      name: "Beauty Home Services",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      isVerified: true,
      businessName: "Beauty Home Services",
      category: "Coiffure & Esthétique",
    },
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=700&fit=crop",
    caption: "💅 Tuto : Comment faire une manucure parfaite à la maison #beauté #manucure #tutoriel",
    likes: 2893,
    comments: [
      {
        id: "c3",
        userId: "u3",
        userName: "Fatou D.",
        userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
        content: "Magnifique ! Je vais essayer ce week-end 💕",
        likes: 45,
        isLiked: false,
        createdAt: "2024-01-15T14:20:00",
      },
    ],
    shares: 156,
    views: 28930,
    isLiked: true,
    isBookmarked: true,
    createdAt: "2024-01-15T12:00:00",
    type: "video",
  },
  {
    id: "3",
    provider: {
      id: "p3",
      name: "Élec Pro CI",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      isVerified: true,
      businessName: "Élec Pro CI",
      category: "Électricité",
    },
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=700&fit=crop",
    caption: "⚡ Installation d'un tableau électrique : les règles de sécurité à respecter #électricité #sécurité #bricolage",
    likes: 892,
    comments: [],
    shares: 67,
    views: 8420,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2024-01-15T08:30:00",
    type: "video",
  },
  {
    id: "live1",
    provider: {
      id: "p4",
      name: "Chef Innocent",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      isVerified: true,
      businessName: "Chef Innocent Cuisine",
      category: "Cuisine",
    },
    videoUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=700&fit=crop",
    caption: "🍳 LIVE : Préparation du Attiéké Poisson - Recette ivoirienne traditionnelle",
    likes: 3421,
    comments: [],
    shares: 234,
    views: 45230,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2024-01-15T15:00:00",
    type: "live",
    liveViewers: 1247,
  },
  {
    id: "4",
    provider: {
      id: "p5",
      name: "Ménage Premium",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      isVerified: true,
      businessName: "Ménage Premium",
      category: "Ménage",
    },
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=700&fit=crop",
    caption: "🧹 5 astuces de pro pour une maison impeccable #ménage #astuces #propre",
    likes: 1567,
    comments: [
      {
        id: "c4",
        userId: "u4",
        userName: "Marie A.",
        content: "Vraiment efficace ! Merci pour les conseils",
        likes: 12,
        isLiked: false,
        createdAt: "2024-01-15T16:30:00",
      },
    ],
    shares: 98,
    views: 12340,
    isLiked: false,
    isBookmarked: false,
    createdAt: "2024-01-15T14:00:00",
    type: "video",
  },
];

// Catégories de filtre
const CATEGORIES = [
  { id: "all", label: "Pour toi", icon: Sparkles },
  { id: "trending", label: "Tendances", icon: Flame },
  { id: "live", label: "En direct", icon: Radio },
  { id: "bricolage", label: "Bricolage", icon: null },
  { id: "beaute", label: "Beauté", icon: null },
  { id: "cuisine", label: "Cuisine", icon: null },
  { id: "menage", label: "Ménage", icon: null },
];

export default function PublicitePage() {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [videos, setVideos] = React.useState<VideoPost[]>(MOCK_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showComments, setShowComments] = React.useState<string | null>(null);
  const [commentInput, setCommentInput] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"feed" | "fullscreen">("feed");

  // Filtrer les vidéos
  const filteredVideos = React.useMemo(() => {
    if (activeCategory === "all") return videos;
    if (activeCategory === "live") return videos.filter((v) => v.type === "live");
    if (activeCategory === "trending") return [...videos].sort((a, b) => b.views - a.views);
    return videos;
  }, [videos, activeCategory]);

  // Toggle like
  const toggleLike = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            isLiked: !v.isLiked,
            likes: v.isLiked ? v.likes - 1 : v.likes + 1,
          };
        }
        return v;
      })
    );
  };

  // Toggle bookmark
  const toggleBookmark = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return { ...v, isBookmarked: !v.isBookmarked };
        }
        return v;
      })
    );
  };

  // Ajouter un commentaire
  const addComment = (videoId: string) => {
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: "currentUser",
      userName: "Vous",
      content: commentInput,
      likes: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return { ...v, comments: [...v.comments, newComment] };
        }
        return v;
      })
    );
    setCommentInput("");
  };

  // Formater le nombre
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Formater le temps
  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Allo Services</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setViewMode(viewMode === "feed" ? "fullscreen" : "feed")}
              >
                {viewMode === "feed" ? "Plein écran" : "Feed"}
              </Button>
            </div>
          </div>

          {/* Catégories */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 rounded-full ${
                  activeCategory === cat.id
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {cat.icon && <cat.icon className="h-4 w-4 mr-1" />}
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20">
        {viewMode === "fullscreen" ? (
          // Mode plein écran (style TikTok)
          <div className="h-[calc(100vh-120px)] snap-y snap-mandatory overflow-y-scroll">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="h-full snap-start relative flex items-center justify-center"
              >
                {/* Video Background */}
                <div className="absolute inset-0 bg-gray-900">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.caption}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                </div>

                {/* Play Button Overlay */}
                <button className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-10 w-10 text-white fill-white" />
                </button>

                {/* Video Info */}
                <div className="absolute bottom-20 left-4 right-16 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarImage src={video.provider.avatar} />
                      <AvatarFallback>{video.provider.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold flex items-center gap-1">
                        {video.provider.businessName}
                        {video.provider.isVerified && (
                          <Verified className="h-4 w-4 fill-blue-500 text-white" />
                        )}
                      </p>
                      <p className="text-xs text-white/80">{video.provider.category}</p>
                    </div>
                    <Button
                      size="sm"
                      className="ml-2 bg-primary hover:bg-primary/80 rounded-full"
                    >
                      Suivre
                    </Button>
                  </div>
                  <p className="text-sm mb-2">{video.caption}</p>
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(video.views)}
                    </span>
                    {video.type === "live" && (
                      <Badge className="bg-red-500 text-white text-xs">
                        <LiveIndicator pulsing={false} className="h-2 w-2 mr-1" />
                        LIVE • {formatNumber(video.liveViewers || 0)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute right-3 bottom-32 flex flex-col gap-4">
                  <button
                    onClick={() => toggleLike(video.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`h-12 w-12 rounded-full bg-white/10 flex items-center justify-center ${video.isLiked ? "text-red-500" : "text-white"}`}>
                      <Heart className={`h-7 w-7 ${video.isLiked ? "fill-current" : ""}`} />
                    </div>
                    <span className="text-xs text-white">{formatNumber(video.likes)}</span>
                  </button>

                  <button
                    onClick={() => setShowComments(showComments === video.id ? null : video.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <MessageCircle className="h-7 w-7" />
                    </div>
                    <span className="text-xs text-white">{video.comments.length}</span>
                  </button>

                  <button className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Share2 className="h-7 w-7" />
                    </div>
                    <span className="text-xs text-white">{formatNumber(video.shares)}</span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(video.id)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={`h-12 w-12 rounded-full bg-white/10 flex items-center justify-center ${video.isBookmarked ? "text-yellow-500" : "text-white"}`}>
                      <Bookmark className={`h-7 w-7 ${video.isBookmarked ? "fill-current" : ""}`} />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Mode Feed (style Facebook/Instagram)
          <div className="max-w-lg mx-auto px-4 space-y-4">
            {/* Live Section */}
            {activeCategory === "all" && (
              <section className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <LiveIndicator />
                  <span className="text-white font-semibold">En direct maintenant</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {videos
                    .filter((v) => v.type === "live")
                    .map((live) => (
                      <Link
                        key={live.id}
                        href={`/live/${live.id}`}
                        className="shrink-0 relative w-28 h-44 rounded-xl overflow-hidden"
                      >
                        <Image
                          src={live.thumbnailUrl}
                          alt={live.caption}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                          <LiveIndicator pulsing={false} className="h-2 w-2 mr-1" />
                          LIVE
                        </Badge>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs text-white font-semibold truncate">
                            {live.provider.businessName}
                          </p>
                          <p className="text-xs text-white/70">
                            {formatNumber(live.liveViewers || 0)} spectateurs
                          </p>
                        </div>
                      </Link>
                    ))}
                  {/* Add Live Button */}
                  <div className="shrink-0 w-28 h-44 rounded-xl bg-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Radio className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs text-white text-center px-2">Démarrer un live</span>
                  </div>
                </div>
              </section>
            )}

            {/* Video Feed */}
            {filteredVideos
              .filter((v) => activeCategory === "live" || v.type !== "live")
              .map((video) => (
                <Card key={video.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={video.provider.avatar} />
                      <AvatarFallback>{video.provider.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        <Link href={`/providers/${video.provider.id}`} className="font-semibold text-white hover:underline">
                          {video.provider.businessName}
                        </Link>
                        {video.provider.isVerified && (
                          <Verified className="h-4 w-4 fill-blue-500 text-white" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{video.provider.category} • {formatTime(video.createdAt)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Video Thumbnail */}
                  <div className="relative aspect-[9/16] bg-gray-800">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.caption}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                        <Play className="h-8 w-8 text-white fill-white ml-1" />
                      </button>
                    </div>
                    {video.type === "live" && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        <LiveIndicator pulsing={false} className="h-2 w-2 mr-1" />
                        EN DIRECT
                      </Badge>
                    )}
                    {/* Views */}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(video.views)} vues
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-3">
                    <p className="text-sm text-white mb-3">{video.caption}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(video.id)}
                          className={`flex items-center gap-1 ${video.isLiked ? "text-red-500" : "text-gray-400 hover:text-white"}`}
                        >
                          <Heart className={`h-6 w-6 ${video.isLiked ? "fill-current" : ""}`} />
                          <span className="text-sm">{formatNumber(video.likes)}</span>
                        </button>

                        <button
                          onClick={() => setShowComments(showComments === video.id ? null : video.id)}
                          className="flex items-center gap-1 text-gray-400 hover:text-white"
                        >
                          <MessageCircle className="h-6 w-6" />
                          <span className="text-sm">{video.comments.length}</span>
                        </button>

                        <button className="flex items-center gap-1 text-gray-400 hover:text-white">
                          <Share2 className="h-6 w-6" />
                          <span className="text-sm">{formatNumber(video.shares)}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => toggleBookmark(video.id)}
                        className={video.isBookmarked ? "text-yellow-500" : "text-gray-400 hover:text-white"}
                      >
                        <Bookmark className={`h-6 w-6 ${video.isBookmarked ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {showComments === video.id && (
                    <div className="border-t border-gray-800">
                      <ScrollArea className="h-60 p-3">
                        {video.comments.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Aucun commentaire</p>
                        ) : (
                          <div className="space-y-3">
                            {video.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={comment.userAvatar} />
                                  <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-gray-800 rounded-lg px-3 py-2">
                                    <p className="text-sm font-semibold text-white">{comment.userName}</p>
                                    <p className="text-sm text-gray-300">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span>{formatTime(comment.createdAt)}</span>
                                    <button className="hover:text-white">J'aime ({comment.likes})</button>
                                    <button className="hover:text-white">Répondre</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 p-3 border-t border-gray-800">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Input
                          placeholder="Ajouter un commentaire..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addComment(video.id)}
                          className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                        />
                        <Button
                          size="icon"
                          onClick={() => addComment(video.id)}
                          disabled={!commentInput.trim()}
                          className="bg-primary hover:bg-primary/80"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Button variant="ghost" className="flex flex-col items-center gap-0.5 text-white">
            <Sparkles className="h-6 w-6" />
            <span className="text-xs">Accueil</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-0.5 text-gray-500">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs">Découvrir</span>
          </Button>
          <Button className="flex flex-col items-center gap-0.5 bg-primary hover:bg-primary/80 -mt-4 rounded-full h-14 w-14">
            <Play className="h-7 w-7" />
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-0.5 text-gray-500">
            <Bookmark className="h-6 w-6" />
            <span className="text-xs">Enregistrés</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-0.5 text-gray-500">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
