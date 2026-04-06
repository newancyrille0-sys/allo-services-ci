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
  Pause,
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
  Home,
  User,
  Plus,
  Search,
  X,
  Check,
  Loader2,
  Copy,
  Twitter,
  Facebook,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LiveIndicator } from "@/components/publications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

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

interface Provider {
  id: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  businessName: string;
  category: string;
  isFollowing: boolean;
}

interface VideoPost {
  id: string;
  provider: Provider;
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
const INITIAL_VIDEOS: VideoPost[] = [
  {
    id: "1",
    provider: {
      id: "p1",
      name: "Plomberie Express",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      isVerified: true,
      businessName: "Plomberie Express",
      category: "Plomberie",
      isFollowing: false,
    },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
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
      isFollowing: true,
    },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
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
      isFollowing: false,
    },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
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
      isFollowing: false,
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
      isFollowing: false,
    },
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
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
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [videos, setVideos] = React.useState<VideoPost[]>(INITIAL_VIDEOS);
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showComments, setShowComments] = React.useState<string | null>(null);
  const [commentInput, setCommentInput] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"feed" | "fullscreen">("feed");
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = React.useState<string | null>(null);
  const [showStartLiveDialog, setShowStartLiveDialog] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [followingLoading, setFollowingLoading] = React.useState<string | null>(null);
  
  const videoRefs = React.useRef<Record<string, HTMLVideoElement>>({});

  // Filtrer les vidéos
  const filteredVideos = React.useMemo(() => {
    let result = [...videos];
    
    if (activeCategory === "all") {
      result = videos;
    } else if (activeCategory === "live") {
      result = videos.filter((v) => v.type === "live");
    } else if (activeCategory === "trending") {
      result = [...videos].sort((a, b) => b.views - a.views);
    } else {
      // Filter by category based on provider category
      const categoryMap: Record<string, string[]> = {
        bricolage: ["Plomberie", "Électricité", "Bricolage"],
        beaute: ["Coiffure & Esthétique", "Beauté"],
        cuisine: ["Cuisine"],
        menage: ["Ménage"],
      };
      result = videos.filter((v) => 
        categoryMap[activeCategory]?.some(cat => 
          v.provider.category.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.caption.toLowerCase().includes(query) ||
        v.provider.businessName.toLowerCase().includes(query) ||
        v.provider.category.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [videos, activeCategory, searchQuery]);

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
    
    const video = videos.find(v => v.id === videoId);
    if (video) {
      toast({
        title: video.isLiked ? "Like retiré" : "Video aimée",
        description: video.isLiked 
          ? "Vous n'aimez plus cette vidéo" 
          : `Vous aimez la vidéo de ${video.provider.businessName}`,
        duration: 2000,
      });
    }
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
    
    const video = videos.find(v => v.id === videoId);
    if (video) {
      toast({
        title: video.isBookmarked ? "Retiré des enregistrements" : "Vidéo enregistrée",
        description: video.isBookmarked 
          ? "La vidéo a été retirée de vos enregistrements" 
          : "La vidéo a été ajoutée à vos enregistrements",
        duration: 2000,
      });
    }
  };

  // Toggle follow
  const toggleFollow = async (providerId: string) => {
    setFollowingLoading(providerId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setVideos((prev) =>
      prev.map((v) => {
        if (v.provider.id === providerId) {
          return {
            ...v,
            provider: {
              ...v.provider,
              isFollowing: !v.provider.isFollowing,
            },
          };
        }
        return v;
      })
    );
    
    const video = videos.find(v => v.provider.id === providerId);
    if (video) {
      toast({
        title: video.provider.isFollowing ? "Ne plus suivre" : "Abonné",
        description: video.provider.isFollowing 
          ? `Vous ne suivez plus ${video.provider.businessName}` 
          : `Vous suivez maintenant ${video.provider.businessName}`,
        duration: 2000,
      });
    }
    
    setFollowingLoading(null);
  };

  // Play/Pause video
  const togglePlayPause = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setPlayingVideoId(videoId);
    } else {
      video.pause();
      setPlayingVideoId(null);
    }
  };

  // Toggle mute
  const toggleMute = (videoId: string) => {
    const video = videoRefs.current[videoId];
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
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
    
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été publié",
      duration: 2000,
    });
    
    setCommentInput("");
  };

  // Like comment
  const toggleCommentLike = (videoId: string, commentId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            comments: v.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  isLiked: !c.isLiked,
                  likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                };
              }
              return c;
            }),
          };
        }
        return v;
      })
    );
  };

  // Share video
  const handleShare = async (videoId: string, platform?: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;
    
    const shareUrl = `${window.location.origin}/publicite/${videoId}`;
    const shareText = `${video.caption} - ${video.provider.businessName} sur Allo Services CI`;
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Lien copié",
        description: "Le lien a été copié dans le presse-papier",
        duration: 2000,
      });
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: `${video.provider.businessName} - Allo Services CI`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    }
    
    // Increment share count
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return { ...v, shares: v.shares + 1 };
        }
        return v;
      })
    );
    
    setShowShareDialog(null);
  };

  // Increment views when video is played
  const handleVideoPlay = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return { ...v, views: v.views + 1 };
        }
        return v;
      })
    );
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

  // Get saved videos
  const savedVideos = videos.filter(v => v.isBookmarked);

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
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setActiveTab("search")}
              >
                <Search className="h-5 w-5" />
              </Button>
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

      {/* Search Modal */}
      {activeTab === "search" && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="max-w-lg mx-auto px-4 py-3">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => {
                  setActiveTab("home");
                  setSearchQuery("");
                }}
              >
                <X className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Rechercher des vidéos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/50"
                autoFocus
              />
            </div>
            
            {searchQuery && (
              <div className="text-white">
                <p className="text-sm text-white/70 mb-3">
                  {filteredVideos.length} résultat(s) pour "{searchQuery}"
                </p>
                {filteredVideos.length === 0 ? (
                  <p className="text-center text-white/50 py-8">Aucun résultat</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredVideos.slice(0, 6).map((video) => (
                      <Link
                        key={video.id}
                        href={`/publicite/${video.id}`}
                        className="relative aspect-[9/16] rounded-lg overflow-hidden"
                      >
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.caption}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs text-white font-semibold truncate">
                            {video.provider.businessName}
                          </p>
                          <p className="text-xs text-white/70 flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(video.likes)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-28 pb-20">
        {activeTab === "saved" ? (
          // Saved Videos
          <div className="max-w-lg mx-auto px-4">
            <h2 className="text-white font-semibold mb-4">Vidéos enregistrées</h2>
            {savedVideos.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">Aucune vidéo enregistrée</p>
                <p className="text-gray-500 text-sm">Les vidéos que vous enregistrez apparaîtront ici</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {savedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => {
                      setActiveTab("home");
                      setViewMode("fullscreen");
                      setCurrentVideoIndex(videos.findIndex(v => v.id === video.id));
                    }}
                  >
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.caption}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs text-white font-semibold truncate">
                        {video.provider.businessName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "profile" ? (
          // Profile
          <div className="max-w-lg mx-auto px-4">
            <div className="text-center py-8">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl">U</AvatarFallback>
              </Avatar>
              <h2 className="text-white font-semibold text-lg">Utilisateur</h2>
              <p className="text-gray-400 text-sm mb-4">Connectez-vous pour voir votre profil</p>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/80">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        ) : viewMode === "fullscreen" ? (
          // Mode plein écran (style TikTok)
          <div className="h-[calc(100vh-120px)] snap-y snap-mandatory overflow-y-scroll">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="h-full snap-start relative flex items-center justify-center"
              >
                {/* Video */}
                <div className="absolute inset-0 bg-gray-900">
                  {video.type === "video" ? (
                    <>
                      <video
                        ref={(el) => { if (el) videoRefs.current[video.id] = el; }}
                        src={video.videoUrl}
                        poster={video.thumbnailUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onPlay={() => handleVideoPlay(video.id)}
                        onClick={() => togglePlayPause(video.id)}
                      />
                      <button
                        className="absolute inset-0 flex items-center justify-center z-10"
                        onClick={() => togglePlayPause(video.id)}
                      >
                        {playingVideoId !== video.id && (
                          <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                            <Play className="h-10 w-10 text-white fill-white" />
                          </div>
                        )}
                      </button>
                    </>
                  ) : (
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.caption}
                      fill
                      className="object-cover opacity-80"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                </div>

                {/* Live Badge */}
                {video.type === "live" && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                    <LiveIndicator pulsing={false} className="h-2 w-2 mr-1" />
                    LIVE • {formatNumber(video.liveViewers || 0)}
                  </Badge>
                )}

                {/* Mute Button */}
                {video.type === "video" && (
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"
                    onClick={() => toggleMute(video.id)}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                )}

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
                      onClick={() => toggleFollow(video.provider.id)}
                      disabled={followingLoading === video.provider.id}
                      className={`ml-2 rounded-full ${
                        video.provider.isFollowing
                          ? "bg-transparent border border-white/50 text-white hover:bg-white/10"
                          : "bg-primary hover:bg-primary/80"
                      }`}
                    >
                      {followingLoading === video.provider.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : video.provider.isFollowing ? (
                        "Suivi"
                      ) : (
                        "Suivre"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm mb-2">{video.caption}</p>
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(video.likes)}
                    </span>
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

                  <button
                    onClick={() => setShowShareDialog(video.id)}
                    className="flex flex-col items-center gap-1"
                  >
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

                {/* Comments Drawer for fullscreen */}
                {showComments === video.id && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/95 rounded-t-2xl max-h-[60vh] z-20">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Commentaires ({video.comments.length})</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white"
                          onClick={() => setShowComments(null)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-60 p-4">
                      {video.comments.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Aucun commentaire. Soyez le premier !</p>
                      ) : (
                        <div className="space-y-3">
                          {video.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.userAvatar} />
                                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-white/10 rounded-lg px-3 py-2">
                                  <p className="text-sm font-semibold text-white">{comment.userName}</p>
                                  <p className="text-sm text-gray-300">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span>{formatTime(comment.createdAt)}</span>
                                  <button
                                    onClick={() => toggleCommentLike(video.id, comment.id)}
                                    className={`hover:text-white ${comment.isLiked ? "text-red-500" : ""}`}
                                  >
                                    J'aime ({comment.likes})
                                  </button>
                                  <button className="hover:text-white">Répondre</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex items-center gap-2 p-3 border-t border-white/10">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <Input
                        placeholder="Ajouter un commentaire..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addComment(video.id)}
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50"
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
                  <button
                    onClick={() => setShowStartLiveDialog(true)}
                    className="shrink-0 w-28 h-44 rounded-xl bg-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <Radio className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs text-white text-center px-2">Démarrer un live</span>
                  </button>
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
                    <Button
                      size="sm"
                      onClick={() => toggleFollow(video.provider.id)}
                      disabled={followingLoading === video.provider.id}
                      className={`rounded-full ${
                        video.provider.isFollowing
                          ? "bg-transparent border border-gray-600 text-gray-400 hover:bg-white/5"
                          : "bg-primary hover:bg-primary/80"
                      }`}
                    >
                      {followingLoading === video.provider.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : video.provider.isFollowing ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Suivi
                        </>
                      ) : (
                        "Suivre"
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => toggleBookmark(video.id)}>
                          <Bookmark className="h-4 w-4 mr-2" />
                          {video.isBookmarked ? "Retirer des enregistrements" : "Enregistrer"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => setShowShareDialog(video.id)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          <Eye className="h-4 w-4 mr-2" />
                          Masquer cette vidéo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-red-400 hover:bg-white/10">
                          Signaler
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Video */}
                  <div className="relative aspect-[9/16] bg-gray-800">
                    {video.type === "video" ? (
                      <>
                        <video
                          ref={(el) => { if (el) videoRefs.current[video.id] = el; }}
                          src={video.videoUrl}
                          poster={video.thumbnailUrl}
                          className="w-full h-full object-cover"
                          loop
                          muted={isMuted}
                          playsInline
                          onPlay={() => handleVideoPlay(video.id)}
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center z-10"
                          onClick={() => togglePlayPause(video.id)}
                        >
                          {playingVideoId !== video.id && (
                            <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors">
                              <Play className="h-8 w-8 text-white fill-white ml-1" />
                            </div>
                          )}
                        </button>
                        {/* Mute button */}
                        <button
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute(video.id);
                          }}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                      </>
                    ) : (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.caption}
                        fill
                        className="object-cover"
                      />
                    )}
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
                          className={`flex items-center gap-1 transition-colors ${video.isLiked ? "text-red-500" : "text-gray-400 hover:text-white"}`}
                        >
                          <Heart className={`h-6 w-6 transition-transform ${video.isLiked ? "fill-current scale-110" : ""}`} />
                          <span className="text-sm">{formatNumber(video.likes)}</span>
                        </button>

                        <button
                          onClick={() => setShowComments(showComments === video.id ? null : video.id)}
                          className="flex items-center gap-1 text-gray-400 hover:text-white"
                        >
                          <MessageCircle className="h-6 w-6" />
                          <span className="text-sm">{video.comments.length}</span>
                        </button>

                        <button
                          onClick={() => setShowShareDialog(video.id)}
                          className="flex items-center gap-1 text-gray-400 hover:text-white"
                        >
                          <Share2 className="h-6 w-6" />
                          <span className="text-sm">{formatNumber(video.shares)}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => toggleBookmark(video.id)}
                        className={`${video.isBookmarked ? "text-yellow-500" : "text-gray-400 hover:text-white"} transition-colors`}
                      >
                        <Bookmark className={`h-6 w-6 transition-transform ${video.isBookmarked ? "fill-current scale-110" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {showComments === video.id && (
                    <div className="border-t border-gray-800">
                      <ScrollArea className="h-60 p-3">
                        {video.comments.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">Aucun commentaire. Soyez le premier !</p>
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
                                    <button
                                      onClick={() => toggleCommentLike(video.id, comment.id)}
                                      className={`hover:text-white ${comment.isLiked ? "text-red-500" : ""}`}
                                    >
                                      J'aime ({comment.likes})
                                    </button>
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
              
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <Play className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">Aucune vidéo trouvée</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Button
            variant="ghost"
            onClick={() => {
              setActiveTab("home");
              setViewMode("feed");
            }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "home" ? "text-white" : "text-gray-500"}`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Accueil</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("search")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "search" ? "text-white" : "text-gray-500"}`}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs">Découvrir</span>
          </Button>
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                const isLoggedIn = localStorage.getItem("isLoggedIn");
                if (!isLoggedIn) {
                  toast({
                    title: "Connexion requise",
                    description: "Connectez-vous pour créer du contenu",
                    duration: 3000,
                  });
                  return;
                }
                setShowStartLiveDialog(true);
              }
            }}
            className="flex flex-col items-center gap-0.5 bg-primary hover:bg-primary/80 -mt-4 rounded-full h-14 w-14"
          >
            <Plus className="h-7 w-7" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("saved")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "saved" ? "text-white" : "text-gray-500"}`}
          >
            <Bookmark className="h-6 w-6" />
            <span className="text-xs">Enregistrés</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-0.5 ${activeTab === "profile" ? "text-white" : "text-gray-500"}`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profil</span>
          </Button>
        </div>
      </nav>

      {/* Share Dialog */}
      <Dialog open={!!showShareDialog} onOpenChange={() => setShowShareDialog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Partager la vidéo</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choisissez comment partager cette vidéo
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-4">
            <button
              onClick={() => showShareDialog && handleShare(showShareDialog, 'whatsapp')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-600 hover:bg-green-700 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span className="text-xs">WhatsApp</span>
            </button>
            <button
              onClick={() => showShareDialog && handleShare(showShareDialog, 'facebook')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="text-xs">Facebook</span>
            </button>
            <button
              onClick={() => showShareDialog && handleShare(showShareDialog, 'twitter')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-sky-500 hover:bg-sky-600 transition-colors"
            >
              <Twitter className="h-6 w-6" />
              <span className="text-xs">Twitter</span>
            </button>
            <button
              onClick={() => showShareDialog && handleShare(showShareDialog, 'copy')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Copy className="h-6 w-6" />
              <span className="text-xs">Copier</span>
            </button>
          </div>
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              onClick={() => showShareDialog && handleShare(showShareDialog, 'native')}
              className="w-full bg-primary hover:bg-primary/80"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager via l'appli
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* Start Live Dialog */}
      <Dialog open={showStartLiveDialog} onOpenChange={setShowStartLiveDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500" />
              Démarrer un Live
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Partagez votre expertise en direct avec votre audience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Titre du Live</label>
              <Input
                placeholder="Ex: Tuto coiffure africaine"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Description</label>
              <Input
                placeholder="De quoi allez-vous parler ?"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-sm text-yellow-400">
                💡 Assurez-vous d'être dans un endroit bien éclairé avec une connexion internet stable.
              </p>
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600">
              <Radio className="h-4 w-4 mr-2" />
              Commencer le Live
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
