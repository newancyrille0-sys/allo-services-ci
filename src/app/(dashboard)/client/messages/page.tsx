"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare, Search, Phone, MoreVertical } from "lucide-react";
import { ChatWindow, type ChatMessage, type ChatRecipient } from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock conversations data
const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    providerId: "provider-1",
    providerName: "Koffi Yao",
    businessName: "Plomberie Express Abidjan",
    providerAvatar: undefined,
    lastMessage: "D'accord, je serai chez vous demain à 10h. N'oubliez pas de préparer l'accès à la salle de bain.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "conv-2",
    providerId: "provider-2",
    providerName: "Aminata Diallo",
    businessName: "Ménage Pro CI",
    providerAvatar: undefined,
    lastMessage: "Merci pour votre confiance ! À la prochaine réservation.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "conv-3",
    providerId: "provider-3",
    providerName: "Jean Kouassi",
    businessName: "Prof Maths Academy",
    providerAvatar: undefined,
    lastMessage: "Le cours s'est très bien passé. Votre enfant a fait des progrès remarquables !",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 1,
    isOnline: false,
  },
];

// Mock messages for a conversation
const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      content: "Bonjour, j'ai bien reçu votre demande de réservation pour une intervention en plomberie.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      senderId: "provider-1",
      isRead: true,
    },
    {
      id: "msg-2",
      content: "Bonjour ! Oui, j'ai une fuite d'eau dans ma salle de bain. Est-ce que vous pouvez intervenir demain ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      senderId: "client-1",
      isRead: true,
    },
    {
      id: "msg-3",
      content: "Oui, je suis disponible demain matin. Vers quelle heure vous arrange ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      senderId: "provider-1",
      isRead: true,
    },
    {
      id: "msg-4",
      content: "10h serait parfait. Je suis à Cocody, Rue des Jardins.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      senderId: "client-1",
      isRead: true,
    },
    {
      id: "msg-5",
      content: "D'accord, je serai chez vous demain à 10h. N'oubliez pas de préparer l'accès à la salle de bain.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      senderId: "provider-1",
      isRead: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-6",
      content: "Le ménage est terminé. Tout est propre maintenant !",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      senderId: "provider-2",
      isRead: true,
    },
    {
      id: "msg-7",
      content: "Merci beaucoup ! Je suis très satisfait du travail.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      senderId: "client-1",
      isRead: true,
    },
    {
      id: "msg-8",
      content: "Merci pour votre confiance ! À la prochaine réservation.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      senderId: "provider-2",
      isRead: true,
    },
  ],
  "conv-3": [
    {
      id: "msg-9",
      content: "Bonjour, le cours de mathématiques d'aujourd'hui s'est bien passé.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25),
      senderId: "provider-3",
      isRead: true,
    },
    {
      id: "msg-10",
      content: "Bonjour ! C'est rassurant d'entendre cela. Mon enfant a-t-il bien suivi ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
      senderId: "client-1",
      isRead: true,
    },
    {
      id: "msg-11",
      content: "Le cours s'est très bien passé. Votre enfant a fait des progrès remarquables !",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      senderId: "provider-3",
      isRead: false,
    },
  ],
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 24) {
    return new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }
  if (days < 7) {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
    }).format(new Date(date));
  }
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialProvider = searchParams.get("provider");

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedConversation, setSelectedConversation] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Check if mobile on mount
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Select initial conversation from URL param
  React.useEffect(() => {
    if (initialProvider) {
      const conv = MOCK_CONVERSATIONS.find((c) => c.providerId === initialProvider);
      if (conv) {
        setSelectedConversation(conv.id);
      }
    } else if (MOCK_CONVERSATIONS.length > 0 && !selectedConversation) {
      // Auto-select first conversation on desktop
      if (!isMobile) {
        setSelectedConversation(MOCK_CONVERSATIONS[0].id);
      }
    }
  }, [initialProvider, isMobile, selectedConversation]);

  // Filter conversations by search query
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CONVERSATIONS;
    const query = searchQuery.toLowerCase();
    return MOCK_CONVERSATIONS.filter(
      (c) =>
        c.businessName.toLowerCase().includes(query) ||
        c.providerName.toLowerCase().includes(query) ||
        c.lastMessage.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedConv = MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: "client-1",
      isRead: false,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }));

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        content: "Merci pour votre message. Je vous répondrai dans les plus brefs délais.",
        timestamp: new Date(),
        senderId: selectedConv?.providerId || "provider-1",
        isRead: false,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), responseMessage],
      }));
    }, 2000);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Mobile: Show only chat or conversation list
  if (isMobile) {
    if (selectedConversation && selectedConv) {
      return (
        <div className="h-[calc(100vh-10rem)] -mx-4 -my-6 lg:mx-0 lg:my-0">
          <ChatWindow
            messages={currentMessages}
            recipient={{
              id: selectedConv.providerId,
              name: selectedConv.providerName,
              businessName: selectedConv.businessName,
              avatar: selectedConv.providerAvatar,
              isOnline: selectedConv.isOnline,
            }}
            currentUserId="client-1"
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            isTyping={isTyping}
            showBackButton
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Conversations avec vos prestataires</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className="w-full p-3 rounded-lg border border-gray-200/50 hover:border-primary/30 hover:bg-muted/50 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conv.businessName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{conv.businessName}</p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="shrink-0">{conv.unreadCount}</Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Split view
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Conversations avec vos prestataires</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 border rounded-lg overflow-hidden flex flex-col bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    "w-full p-3 rounded-lg transition-all text-left",
                    selectedConversation === conv.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conv.businessName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm truncate">{conv.businessName}</p>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge className="h-5 min-w-5 text-xs shrink-0">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune conversation trouvée</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 border rounded-lg overflow-hidden bg-white">
          {selectedConversation && selectedConv ? (
            <ChatWindow
              messages={currentMessages}
              recipient={{
                id: selectedConv.providerId,
                name: selectedConv.providerName,
                businessName: selectedConv.businessName,
                avatar: selectedConv.providerAvatar,
                isOnline: selectedConv.isOnline,
              }}
              currentUserId="client-1"
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-lg">Sélectionnez une conversation</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Choisissez une conversation dans la liste pour commencer à discuter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
