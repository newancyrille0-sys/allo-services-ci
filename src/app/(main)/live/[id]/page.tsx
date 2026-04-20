"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Radio,
  MessageCircle,
  Heart,
  Share2,
  Gift,
  Users,
  Eye,
  Send,
  ChevronDown,
} from "lucide-react";
import { LiveIndicator } from "@/components/publications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface LiveData {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  streamUrl?: string;
  viewerCount: number;
  startedAt?: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
    subscribers?: number;
  };
}

interface LiveMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

// Mock messages for demo
const MOCK_MESSAGES: LiveMessage[] = [
  { id: "1", content: "Super live ! 🔥", createdAt: new Date().toISOString(), user: { name: "Amadou K." } },
  { id: "2", content: "C'est exactement ce que je cherchais", createdAt: new Date().toISOString(), user: { name: "Fatou D." } },
  { id: "3", content: "Vous intervenez à Cocody ?", createdAt: new Date().toISOString(), user: { name: "Yao M." } },
  { id: "4", content: "👍👍👍", createdAt: new Date().toISOString(), user: { name: "Marie K." } },
];

export default function LivePage() {
  const params = useParams();
  const router = useRouter();
  const liveId = params.id as string;

  const [live, setLive] = React.useState<LiveData | null>(null);
  const [messages, setMessages] = React.useState<LiveMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [showDescription, setShowDescription] = React.useState(false);

  // Fetch live data
  React.useEffect(() => {
    const fetchLive = async () => {
      try {
        const response = await fetch(`/api/lives/${liveId}`);
        if (response.ok) {
          const data = await response.json();
          setLive(data);
        } else {
          // Use mock data if API fails
          setLive({
            id: liveId,
            title: "Démonstration de plomberie en direct",
            description: "Je vous montre comment réparer une fuite d'eau et installer un robinet. N'hésitez pas à poser vos questions !",
            viewerCount: 127,
            startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            provider: {
              id: "provider-1",
              name: "Plomberie Express",
              avatar: undefined,
              isVerified: true,
              subscribers: 1250,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching live:", error);
        // Mock data on error
        setLive({
          id: liveId,
          title: "Démonstration de plomberie en direct",
          description: "Je vous montre comment réparer une fuite d'eau et installer un robinet. N'hésitez pas à poser vos questions !",
          viewerCount: 127,
          startedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          provider: {
            id: "provider-1",
            name: "Plomberie Express",
            avatar: undefined,
            isVerified: true,
            subscribers: 1250,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLive();
  }, [liveId]);

  // Simulate incoming messages
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newMsg: LiveMessage = {
          id: Date.now().toString(),
          content: ["Super ! 🎉", "Merci pour les conseils", "Très utile !", "J'ai appris quelque chose aujourd'hui", "👏👏"][Math.floor(Math.random() * 5)],
          createdAt: new Date().toISOString(),
          user: { name: ["Amadou", "Fatou", "Kofi", "Marie", "Yao"][Math.floor(Math.random() * 5)] + " " },
        };
        setMessages((prev) => [...prev, newMsg].slice(-50));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update viewer count periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLive((prev) =>
        prev
          ? {
              ...prev,
              viewerCount: prev.viewerCount + Math.floor(Math.random() * 3) - 1,
            }
          : null
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: LiveMessage = {
      id: Date.now().toString(),
      content: newMessage,
      createdAt: new Date().toISOString(),
      user: { name: "Vous" },
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: live?.title || "Live Allo Services CI",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="aspect-video bg-gray-900 animate-pulse" />
        <div className="p-4 bg-gray-900">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!live) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Radio className="h-16 w-16 mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-bold mb-2">Live non trouvé</h2>
          <p className="text-gray-400 mb-4">Ce live n'existe pas ou a pris fin.</p>
          <Button asChild>
            <Link href="/publications">Retour aux publications</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {/* Placeholder for video stream */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <Radio className="h-20 w-20 mx-auto text-red-500 animate-pulse" />
            <p className="text-white mt-4 text-lg">Flux vidéo en direct</p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              {/* Live Badge */}
              <Badge className="bg-red-600 text-white flex items-center gap-1.5 px-3">
                <LiveIndicator pulsing={false} className="h-2 w-2" />
                EN DIRECT
              </Badge>

              {/* Viewer Count */}
              <div className="flex items-center gap-1.5 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                <Eye className="h-4 w-4" />
                {live.viewerCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Info */}
      <div className="bg-gray-900 text-white">
        {/* Provider Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 border-2 border-red-500">
                <AvatarImage src={live.provider.avatar} alt={live.provider.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {live.provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold truncate">{live.provider.name}</h1>
                  {live.provider.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-blue-600">
                      Vérifié
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  <Users className="h-3 w-3 inline mr-1" />
                  {live.provider.subscribers?.toLocaleString('fr-FR') || 0} abonnés
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                className={isFollowing ? "border-gray-600 text-white" : ""}
              >
                {isFollowing ? "Abonné" : "S'abonner"}
              </Button>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-bold text-lg mb-2">{live.title}</h2>

          {live.description && (
            <>
              <p
                className={`text-sm text-gray-300 ${
                  showDescription ? "" : "line-clamp-2"
                }`}
              >
                {live.description}
              </p>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="text-sm text-gray-400 mt-1 flex items-center gap-1"
              >
                {showDescription ? "Moins" : "Plus"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showDescription ? "rotate-180" : ""
                  }`}
                />
              </button>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around py-3 border-b border-gray-800">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Heart className="h-6 w-6" />
            <span className="text-xs">J'aime</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="h-6 w-6" />
            <span className="text-xs">Partager</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Gift className="h-6 w-6" />
            <span className="text-xs">Cadeau</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs">Question</span>
          </button>
        </div>

        {/* Chat Section */}
        <div className="h-80 flex flex-col">
          <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-medium">Chat en direct</span>
            <span className="text-xs text-gray-400">{messages.length} messages</span>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-gray-700">
                      {msg.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium text-gray-300">
                      {msg.user.name}
                    </span>
                    <p className="text-sm text-white">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Envoyer un message..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Provider CTA */}
        <div className="p-4 bg-gray-800">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href={`/providers/${live.provider.id}`}>
              Voir le profil du prestataire
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
