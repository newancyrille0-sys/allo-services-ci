"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  likeCount: number;
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
  type: "video" | "photo" | "live";
  provider: Provider;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  commentCount: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  liveViewerCount?: number;
  status?: string;
}

// Categories
const CATEGORIES = [
  { id: "all", label: "Pour toi", icon: Sparkles },
  { id: "trending", label: "Tendances", icon: Flame },
  { id: "live", label: "En direct", icon: Radio },
  { id: "following", label: "Abonnements", icon: null },
];

export default function PublicitePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [videos, setVideos] = React.useState<VideoPost[]>([]);
  const [lives, setLives] = React.useState<VideoPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showComments, setShowComments] = React.useState<string | null>(null);
  const [commentInput, setCommentInput] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"feed" | "fullscreen">("feed");
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = React.useState<string | null>(null);
  const [showStartLiveDialog, setShowStartLiveDialog] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<Record<string, boolean>>({});
  
  const videoRefs = React.useRef<Record<string, HTMLVideoElement>>({});

  // Fetch data
  const fetchData = React.useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // Fetch publications
      const pubsResponse = await fetch("/api/publications/feed?type=video");
      const pubsData = await pubsResponse.json();
      
      // Fetch lives
      const livesResponse = await fetch("/api/lives?status=live");
      const livesData = await livesResponse.json();

      if (pubsData.success) {
        setVideos(pubsData.data);
      }
      
      if (livesData.success) {
        setLives(livesData.data.map((live: any) => ({
          ...live,
          type: "live",
          videoUrl: live.streamUrl || "",
          thumbnailUrl: live.thumbnailUrl || "",
          caption: live.title,
          likes: live.likeCount,
          commentCount: live.commentCount,
          comments: [],
          shares: 0,
          liveViewerCount: live.viewerCount,
        })));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les vidéos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  // Initial fetch
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh on category change
  React.useEffect(() => {
    if (!isLoading) {
      fetchData(true);
    }
  }, [activeCategory]);

  // Filter videos
  const filteredVideos = React.useMemo(() => {
    let result = [...videos];
    
    if (activeCategory === "trending") {
      result = result.sort((a, b) => b.views - a.views);
    } else if (activeCategory === "following") {
      result = result.filter((v) => v.provider.isFollowing);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.caption.toLowerCase().includes(query) ||
        v.provider.businessName.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [videos, activeCategory, searchQuery]);

  // Toggle like
  const toggleLike = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    setActionLoading(prev => ({ ...prev, [`like-${videoId}`]: true }));

    try {
      if (video.isLiked) {
        await fetch(`/api/publications/like?publicationId=${videoId}`, { method: "DELETE" });
      } else {
        await fetch("/api/publications/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicationId: videoId }),
        });
      }

      setVideos(prev => prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            isLiked: !v.isLiked,
            likes: v.isLiked ? v.likes - 1 : v.likes + 1,
          };
        }
        return v;
      }));

      toast({
        title: video.isLiked ? "Like retiré" : "Vidéo aimée ❤️",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le like",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`like-${videoId}`]: false }));
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    setActionLoading(prev => ({ ...prev, [`bookmark-${videoId}`]: true }));

    try {
      if (video.isBookmarked) {
        await fetch(`/api/publications/bookmark?publicationId=${videoId}`, { method: "DELETE" });
      } else {
        await fetch("/api/publications/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicationId: videoId }),
        });
      }

      setVideos(prev => prev.map(v => {
        if (v.id === videoId) {
          return { ...v, isBookmarked: !v.isBookmarked };
        }
        return v;
      }));

      toast({
        title: video.isBookmarked ? "Retiré des enregistrements" : "Vidéo enregistrée 📌",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`bookmark-${videoId}`]: false }));
    }
  };

  // Toggle follow
  const toggleFollow = async (providerId: string) => {
    setActionLoading(prev => ({ ...prev, [`follow-${providerId}`]: true }));

    const video = videos.find(v => v.provider.id === providerId);
    const isFollowing = video?.provider.isFollowing;

    try {
      if (isFollowing) {
        await fetch(`/api/follow?providerId=${providerId}`, { method: "DELETE" });
      } else {
        await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId }),
        });
      }

      // Update both videos and lives
      const updateProvider = (items: VideoPost[]) => items.map(v => {
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
      });

      setVideos(updateProvider);
      setLives(updateProvider);

      toast({
        title: isFollowing ? "Ne plus suivre" : "Abonné ✅",
        description: isFollowing 
          ? `Vous ne suivez plus ce prestataire` 
          : `Vous suivez maintenant ce prestataire`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'abonnement",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`follow-${providerId}`]: false }));
    }
  };

  // Load comments
  const loadComments = async (videoId: string) => {
    try {
      const response = await fetch(`/api/publications/comment?publicationId=${videoId}`);
      const data = await response.json();
      
      if (data.success) {
        setVideos(prev => prev.map(v => {
          if (v.id === videoId) {
            return { ...v, comments: data.data };
          }
          return v;
        }));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  // Add comment
  const addComment = async (videoId: string) => {
    if (!commentInput.trim()) return;

    setActionLoading(prev => ({ ...prev, [`comment-${videoId}`]: true }));

    try {
      const response = await fetch("/api/publications/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicationId: videoId,
          content: commentInput.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVideos(prev => prev.map(v => {
          if (v.id === videoId) {
            return {
              ...v,
              comments: [data.data, ...v.comments],
              commentCount: v.commentCount + 1,
            };
          }
          return v;
        }));
        setCommentInput("");
        toast({
          title: "Commentaire ajouté 💬",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive",
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [`comment-${videoId}`]: false }));
    }
  };

  // Share
  const handleShare = async (videoId: string, platform?: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const shareUrl = `${window.location.origin}/publicite/${videoId}`;
    const shareText = `${video.caption} - ${video.provider.businessName}`;

    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Lien copié 📋", duration: 2000 });
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
      } catch {}
    }

    // Increment share count locally
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return { ...v, shares: v.shares + 1 };
      }
      return v;
    }));

    setShowShareDialog(null);
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

  // Format number
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format time
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
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
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

          {/* Categories */}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {/* Search Modal */}
      {activeTab === "search" && (
        <div className="fixed inset-0 z-50 bg-black pt-20">
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
                      <div
                        key={video.id}
                        className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => {
                          setActiveTab("home");
                          setSearchQuery("");
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
                          <p className="text-xs text-white/70 flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(video.likes)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <main className="pt-28 pb-20">
          {activeTab === "saved" ? (
            // Saved Videos
            <div className="max-w-lg mx-auto px-4">
              <h2 className="text-white font-semibold mb-4">Vidéos enregistrées</h2>
              {savedVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">Aucune vidéo enregistrée</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {savedVideos.map((video) => (
                    <div
                      key={video.id}
                      className="relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer"
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
          ) : (
            // Feed
            <div className="max-w-lg mx-auto px-4 space-y-4">
              {/* Live Section */}
              {activeCategory === "all" && lives.length > 0 && (
                <section className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <LiveIndicator />
                    <span className="text-white font-semibold">En direct maintenant</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {lives.map((live) => (
                      <Link
                        key={live.id}
                        href={`/live/${live.id}`}
                        className="shrink-0 relative w-28 h-44 rounded-xl overflow-hidden"
                      >
                        <Image
                          src={live.thumbnailUrl || "/placeholder.jpg"}
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
                            {formatNumber(live.liveViewerCount || 0)} spectateurs
                          </p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={() => setShowStartLiveDialog(true)}
                      className="shrink-0 w-28 h-44 rounded-xl bg-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/20 transition-colors"
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
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Play className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">Aucune vidéo trouvée</p>
                </div>
              ) : (
                filteredVideos.map((video) => (
                  <Card key={video.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-3">
                      <Link href={`/providers/${video.provider.id}`}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={video.provider.avatar} />
                          <AvatarFallback>{video.provider.name?.[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
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
                        disabled={actionLoading[`follow-${video.provider.id}`]}
                        className={`rounded-full ${
                          video.provider.isFollowing
                            ? "bg-transparent border border-gray-600 text-gray-400 hover:bg-white/5"
                            : "bg-primary hover:bg-primary/80"
                        }`}
                      >
                        {actionLoading[`follow-${video.provider.id}`] ? (
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
                          <DropdownMenuItem 
                            className="text-white hover:bg-white/10" 
                            onClick={() => toggleBookmark(video.id)}
                          >
                            <Bookmark className="h-4 w-4 mr-2" />
                            {video.isBookmarked ? "Retirer" : "Enregistrer"}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-white hover:bg-white/10" 
                            onClick={() => setShowShareDialog(video.id)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Partager
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
                      {video.videoUrl ? (
                        <>
                          <video
                            ref={(el) => { if (el) videoRefs.current[video.id] = el; }}
                            src={video.videoUrl}
                            poster={video.thumbnailUrl}
                            className="w-full h-full object-cover"
                            loop
                            muted={isMuted}
                            playsInline
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
                          <button
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
                            onClick={() => setIsMuted(!isMuted)}
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
                            disabled={actionLoading[`like-${video.id}`]}
                            className={`flex items-center gap-1 transition-colors ${video.isLiked ? "text-red-500" : "text-gray-400 hover:text-white"}`}
                          >
                            {actionLoading[`like-${video.id}`] ? (
                              <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                              <Heart className={`h-6 w-6 ${video.isLiked ? "fill-current" : ""}`} />
                            )}
                            <span className="text-sm">{formatNumber(video.likes)}</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowComments(showComments === video.id ? null : video.id);
                              if (showComments !== video.id) {
                                loadComments(video.id);
                              }
                            }}
                            className="flex items-center gap-1 text-gray-400 hover:text-white"
                          >
                            <MessageCircle className="h-6 w-6" />
                            <span className="text-sm">{video.commentCount}</span>
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
                          disabled={actionLoading[`bookmark-${video.id}`]}
                          className={`${video.isBookmarked ? "text-yellow-500" : "text-gray-400 hover:text-white"} transition-colors`}
                        >
                          {actionLoading[`bookmark-${video.id}`] ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <Bookmark className={`h-6 w-6 ${video.isBookmarked ? "fill-current" : ""}`} />
                          )}
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
                                    <AvatarFallback>{comment.userName?.[0]}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-800 rounded-lg px-3 py-2">
                                      <p className="text-sm font-semibold text-white">{comment.userName}</p>
                                      <p className="text-sm text-gray-300">{comment.content}</p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                      <span>{formatTime(comment.createdAt)}</span>
                                      <button className="hover:text-white">
                                        J'aime ({comment.likeCount})
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
                            disabled={!commentInput.trim() || actionLoading[`comment-${video.id}`]}
                            className="bg-primary hover:bg-primary/80"
                          >
                            {actionLoading[`comment-${video.id}`] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </main>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("home")}
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
            onClick={() => setShowStartLiveDialog(true)}
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
