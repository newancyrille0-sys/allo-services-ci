"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Play,
  Volume2,
  VolumeX,
  Verified,
  Clock,
  Eye,
  Loader2,
  Video,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Types
interface FeedPost {
  id: string;
  type: "photo" | "video";
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  servicePrice?: number;
  serviceDescription?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    businessName?: string;
    category?: string;
    isVerified: boolean;
    subscriptionPlan?: string;
    isFollowing?: boolean;
  };
  commentsList?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
}

// Subscription tier colors
const TIER_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  STARTER: {
    bg: "from-slate-600 to-slate-700",
    border: "border-slate-400",
    text: "text-slate-300",
    badge: "bg-slate-500",
  },
  STANDARD: {
    bg: "from-emerald-500 to-teal-600",
    border: "border-emerald-400",
    text: "text-emerald-300",
    badge: "bg-emerald-500",
  },
  PREMIUM: {
    bg: "from-amber-400 to-yellow-500",
    border: "border-amber-300",
    text: "text-amber-200",
    badge: "bg-gradient-to-r from-amber-400 to-yellow-500",
  },
};

// Mock data for development
const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop",
    caption: "Installation plomberie complète réalisée ce matin à Cocody. Travail propre et soigné !",
    servicePrice: 25000,
    serviceDescription: "Installation sanitaire complète",
    likes: 234,
    comments: 45,
    shares: 12,
    views: 1520,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    provider: {
      id: "p1",
      name: "Plomberie Express",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      businessName: "Plomberie Express Abidjan",
      category: "Plomberie",
      isVerified: true,
      subscriptionPlan: "PREMIUM",
      isFollowing: true,
    },
    commentsList: [
      {
        id: "c1",
        content: "Excellent travail ! Très professionnel.",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: { id: "u1", name: "Aminata Diallo", avatar: "https://i.pravatar.cc/100?img=1" },
        likes: 5,
      },
      {
        id: "c2",
        content: "Je recommande, prix honnête et qualité au rendez-vous 👍",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        user: { id: "u2", name: "Moussa Koné", avatar: "https://i.pravatar.cc/100?img=2" },
        likes: 3,
      },
    ],
  },
  {
    id: "2",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=800&fit=crop",
    caption: "Coiffure tresses africaines - Nouveau style disponible ! Réservez votre créneau.",
    servicePrice: 15000,
    serviceDescription: "Tresses africaines",
    likes: 456,
    comments: 89,
    shares: 34,
    views: 2340,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    provider: {
      id: "p2",
      name: "Beauty Home",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      businessName: "Beauty Home Services",
      category: "Coiffure",
      isVerified: true,
      subscriptionPlan: "STANDARD",
      isFollowing: false,
    },
    commentsList: [
      {
        id: "c3",
        content: "Magnifique ! Je veux le même style 💇‍♀️",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: { id: "u3", name: "Fatou Sanogo", avatar: "https://i.pravatar.cc/100?img=3" },
        likes: 8,
      },
    ],
  },
  {
    id: "3",
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=800&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=800&fit=crop",
    caption: "Électricité domestique - Installation d'un nouveau tableau électrique. Sécurité garantie !",
    servicePrice: 35000,
    serviceDescription: "Installation tableau électrique",
    likes: 189,
    comments: 23,
    shares: 8,
    views: 890,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    provider: {
      id: "p3",
      name: "Élec Pro CI",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      businessName: "Élec Pro Côte d'Ivoire",
      category: "Électricité",
      isVerified: true,
      subscriptionPlan: "STARTER",
      isFollowing: false,
    },
    commentsList: [],
  },
  {
    id: "4",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=800&fit=crop",
    caption: "Ménage professionnel - Avant/Après. Votre maison mérite le meilleur !",
    servicePrice: 8000,
    serviceDescription: "Ménage complet",
    likes: 312,
    comments: 56,
    shares: 21,
    views: 1890,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    provider: {
      id: "p4",
      name: "Ménage Premium",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      businessName: "Ménage Premium CI",
      category: "Ménage",
      isVerified: true,
      subscriptionPlan: "PREMIUM",
      isFollowing: true,
    },
    commentsList: [
      {
        id: "c4",
        content: "Waouh ! Quel résultat impeccable !",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        user: { id: "u4", name: "Jean-Baptiste K.", avatar: "https://i.pravatar.cc/100?img=4" },
        likes: 12,
      },
    ],
  },
  {
    id: "5",
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=800&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=800&fit=crop",
    caption: "Jardinage et entretien d'espaces verts. Transformez votre jardin !",
    servicePrice: 20000,
    serviceDescription: "Entretien jardin",
    likes: 167,
    comments: 34,
    shares: 15,
    views: 756,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    provider: {
      id: "p5",
      name: "JardinPro",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      businessName: "JardinPro Abidjan",
      category: "Jardinage",
      isVerified: false,
      subscriptionPlan: "STANDARD",
      isFollowing: false,
    },
    commentsList: [],
  },
];

// Format number helper
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

// Feed Post Card Component
function FeedPostCard({
  post,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onFollow,
  currentUserId,
  userType,
}: {
  post: FeedPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onComment: (id: string, content: string) => void;
  onShare: (id: string) => void;
  onFollow: (providerId: string) => void;
  currentUserId?: string;
  userType?: "CLIENT" | "PROVIDER";
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [imageError, setImageError] = useState(false);
  const tierStyle = TIER_COLORS[post.provider.subscriptionPlan || "STARTER"];

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden">
      {/* Provider Header */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/providers/${post.provider.id}`} className="flex items-center gap-3 group">
          <div className="relative">
            <Avatar className={cn("h-12 w-12 border-2", tierStyle.border)}>
              <AvatarImage src={post.provider.avatar} alt={post.provider.name} />
              <AvatarFallback className={cn("text-white font-bold bg-gradient-to-br", tierStyle.bg)}>
                {post.provider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {post.provider.subscriptionPlan === "PREMIUM" && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 group-hover:text-[#00693E] transition-colors">
                {post.provider.businessName || post.provider.name}
              </span>
              {post.provider.isVerified && (
                <Verified className="h-4 w-4 text-blue-500 fill-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{post.provider.category}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}</span>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {!post.provider.isFollowing && userType === "CLIENT" && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => onFollow(post.provider.id)}
            >
              Suivre
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Signaler</DropdownMenuItem>
              <DropdownMenuItem>Ne plus voir</DropdownMenuItem>
              <DropdownMenuItem>Copier le lien</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Media Content */}
      <div className="relative aspect-[4/5] bg-gray-100">
        {!imageError ? (
          <Image
            src={post.thumbnailUrl || post.mediaUrl}
            alt={post.caption || "Publication"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <ImageIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Video Play Button */}
        {post.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors">
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </button>
          </div>
        )}

        {/* Sound Toggle for Video */}
        {post.type === "video" && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>
        )}

        {/* Views Counter */}
        {post.views > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-white bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <Eye className="h-3 w-3" />
            {formatNumber(post.views)}
          </div>
        )}

        {/* Service Price Badge */}
        {post.servicePrice && (
          <div className="absolute top-4 left-4">
            <Badge className={cn("text-white font-semibold", tierStyle.badge)}>
              {post.servicePrice.toLocaleString()} FCFA
            </Badge>
          </div>
        )}
      </div>

      {/* Interaction Buttons */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5 group"
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-colors",
                  post.isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 group-hover:text-red-500"
                )}
              />
              <span className="text-sm font-medium text-gray-700">
                {formatNumber(post.likes)}
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 group"
            >
              <MessageCircle className="h-6 w-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700">
                {formatNumber(post.comments)}
              </span>
            </button>
            <button
              onClick={() => onShare(post.id)}
              className="flex items-center gap-1.5 group"
            >
              <Share2 className="h-6 w-6 text-gray-600 group-hover:text-green-500 transition-colors" />
              <span className="text-sm font-medium text-gray-700">
                {formatNumber(post.shares)}
              </span>
            </button>
          </div>
          <button onClick={() => onBookmark(post.id)}>
            <Bookmark
              className={cn(
                "h-6 w-6 transition-colors",
                post.isBookmarked
                  ? "fill-amber-500 text-amber-500"
                  : "text-gray-600 hover:text-amber-500"
              )}
            />
          </button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-gray-800 mb-3">
            <Link href={`/providers/${post.provider.id}`} className="font-semibold hover:underline">
              {post.provider.businessName || post.provider.name}
            </Link>{" "}
            {post.caption}
          </p>
        )}

        {/* Service Description */}
        {post.serviceDescription && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-gray-700">{post.serviceDescription}</p>
            <Link href={`/providers/${post.provider.id}`}>
              <Button size="sm" className="mt-2 bg-[#00693E] hover:bg-[#008C53]">
                Réserver ce service
              </Button>
            </Link>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="border-t pt-3 mt-3 space-y-3">
            {/* Existing Comments */}
            {post.commentsList && post.commentsList.length > 0 && (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {post.commentsList.map((comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-gray-900">{comment.user.name}</p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}</span>
                        <button className="font-medium hover:text-gray-700">J&apos;aime ({comment.likes})</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <div className="flex gap-2 items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-[#00693E] text-white">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  placeholder="Ajouter un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="pr-10 h-9"
                  onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                >
                  <Send className={cn("h-4 w-4", commentText.trim() ? "text-[#fd7613]" : "text-gray-300")} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Comments Link */}
        {!showComments && post.comments > 0 && (
          <button
            onClick={() => setShowComments(true)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Voir les {post.comments} commentaire{post.comments > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </Card>
  );
}

// Create Post Component (for Providers)
function CreatePostSection({ onPost }: { onPost: (data: { caption: string; type: string }) => void }) {
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="border-0 shadow-lg bg-white mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#fd7613] text-white">P</AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex-1 text-left bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-gray-500 transition-colors"
          >
            Quoi de neuf ? Partagez votre travail...
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-2", mediaType === "video" && "text-red-500")}
              onClick={() => setMediaType("video")}
            >
              <Video className="h-5 w-5" />
              Vidéo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("gap-2", mediaType === "photo" && "text-green-500")}
              onClick={() => setMediaType("photo")}
            >
              <ImageIcon className="h-5 w-5" />
              Photo
            </Button>
          </div>
          <Button className="bg-[#fd7613] hover:bg-[#e5650f]">
            Publier
          </Button>
        </div>
      </CardContent>

      {/* Create Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer une publication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Décrivez votre travail, partagez vos réalisations..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-32"
            />
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 gap-2">
                <ImageIcon className="h-5 w-5" />
                Ajouter photo
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Video className="h-5 w-5" />
                Ajouter vidéo
              </Button>
            </div>
            <Button
              className="w-full bg-[#fd7613] hover:bg-[#e5650f]"
              onClick={() => {
                onPost({ caption, type: mediaType });
                setIsDialogOpen(false);
                setCaption("");
              }}
            >
              Publier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Stories Bar Component
function StoriesBar() {
  const stories = [
    { id: "1", name: "Plomberie Express", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", isLive: true },
    { id: "2", name: "Beauty Home", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", hasStory: true },
    { id: "3", name: "Élec Pro", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", hasStory: true },
    { id: "4", name: "Ménage Pro", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", hasStory: true },
    { id: "5", name: "JardinPro", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop", hasStory: false },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {stories.map((story) => (
            <button key={story.id} className="flex flex-col items-center gap-1 group">
              <div className="relative">
                <div className={cn(
                  "p-0.5 rounded-full",
                  story.isLive
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : story.hasStory
                    ? "bg-gradient-to-r from-[#fd7613] to-[#f59542]"
                    : "bg-gray-200"
                )}>
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={story.avatar} />
                    <AvatarFallback className="bg-gray-100">{story.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                {story.isLive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    LIVE
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-900 max-w-16 truncate">
                {story.name}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Main Feed Page Component
export function FeedPage({
  userType,
  userId,
  userName,
  userAvatar,
}: {
  userType: "CLIENT" | "PROVIDER";
  userId?: string;
  userName?: string;
  userAvatar?: string;
}) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "following" | "trending">("all");

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      setLoading(true);
      // In production, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPosts(MOCK_POSTS);
      setLoading(false);
    };
    fetchPosts();
  }, [filter]);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const handleBookmark = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  }, []);

  const handleComment = useCallback((postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [
                {
                  id: `c${Date.now()}`,
                  content,
                  createdAt: new Date().toISOString(),
                  user: {
                    id: userId || "unknown",
                    name: userName || "Utilisateur",
                    avatar: userAvatar,
                  },
                  likes: 0,
                },
                ...(post.commentsList || []),
              ],
            }
          : post
      )
    );
  }, [userId, userName, userAvatar]);

  const handleShare = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, shares: post.shares + 1 } : post
      )
    );
    // In production, open share dialog
    alert("Partage copié dans le presse-papier !");
  }, []);

  const handleFollow = useCallback((providerId: string) => {
    // In production, this would be an API call
    alert(`Vous suivez maintenant ce prestataire !`);
  }, []);

  const handleCreatePost = useCallback((data: { caption: string; type: string }) => {
    // In production, this would upload media and create post via API
    const newPost: FeedPost = {
      id: `new-${Date.now()}`,
      type: data.type as "photo" | "video",
      mediaUrl: "/placeholder.jpg",
      caption: data.caption,
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      provider: {
        id: userId || "unknown",
        name: userName || "Prestataire",
        avatar: userAvatar,
        isVerified: false,
        subscriptionPlan: "STARTER",
      },
    };
    setPosts((prev) => [newPost, ...prev]);
  }, [userId, userName, userAvatar]);

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00693E] via-[#008C53] to-[#00693E] py-6 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {userType === "CLIENT" ? "Fil d'actualités" : "Publications"}
            </h1>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className={cn("text-xs", filter === "all" && "bg-white text-[#00693E]")}}
              >
                Pour vous
              </Button>
              <Button
                variant={filter === "following" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("following")}
                className={cn("text-xs", filter === "following" && "bg-white text-[#00693E]")}}
              >
                Abonnements
              </Button>
              <Button
                variant={filter === "trending" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilter("trending")}
                className={cn("text-xs", filter === "trending" && "bg-white text-[#00693E]")}
              >
                Tendances
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Stories Bar */}
        <StoriesBar />

        {/* Create Post (Providers Only) */}
        {userType === "PROVIDER" && <CreatePostSection onPost={handleCreatePost} />}

        {/* Feed */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#00693E]" />
            </div>
          ) : posts.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">Aucune publication pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onComment={handleComment}
                onShare={handleShare}
                onFollow={handleFollow}
                currentUserId={userId}
                userType={userType}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedPage;
