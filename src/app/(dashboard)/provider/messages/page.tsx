"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Send,
  Phone,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Image,
  Smile,
  Clock,
  CheckCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime, getRelativeTime, formatDate } from "@/lib/utils/formatters";

// Types
interface Message {
  id: string;
  content: string;
  sender: "provider" | "client";
  createdAt: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
    phone: string;
  };
  lastMessage: Message;
  unreadCount: number;
  reservationId?: string;
  serviceName?: string;
  messages: Message[];
}

// Mock data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    client: {
      id: "client-1",
      name: "Amadou Koné",
      phone: "+225 07 08 09 10 11",
    },
    lastMessage: {
      id: "msg-5",
      content: "Parfait, je vous attends donc demain à 9h. L'adresse est Cocody, Rue des Jardins, Villa 45.",
      sender: "client",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: true,
    },
    unreadCount: 0,
    reservationId: "res-1",
    serviceName: "Plomberie",
    messages: [
      {
        id: "msg-1",
        content: "Bonjour, j'ai une fuite d'eau urgente dans ma cuisine. Pouvez-vous intervenir demain matin ?",
        sender: "client",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        isRead: true,
      },
      {
        id: "msg-2",
        content: "Bonjour Monsieur Koné, oui je suis disponible demain à 9h. Je viendrai avec tout le matériel nécessaire pour réparer la fuite.",
        sender: "provider",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
        isRead: true,
      },
      {
        id: "msg-3",
        content: "Parfait, je vous attends donc demain à 9h. L'adresse est Cocody, Rue des Jardins, Villa 45.",
        sender: "client",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: true,
      },
    ],
  },
  {
    id: "conv-2",
    client: {
      id: "client-2",
      name: "Fatou Diallo",
      phone: "+225 05 06 07 08 09",
    },
    lastMessage: {
      id: "msg-6",
      content: "Merci beaucoup pour votre rapidité ! Je vais vous laisser un avis 5 étoiles.",
      sender: "client",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
    unreadCount: 2,
    reservationId: "res-2",
    serviceName: "Électricité",
    messages: [
      {
        id: "msg-4",
        content: "Le travail est terminé. Tout fonctionne normalement maintenant.",
        sender: "provider",
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true,
      },
      {
        id: "msg-5",
        content: "Merci beaucoup pour votre rapidité ! Je vais vous laisser un avis 5 étoiles.",
        sender: "client",
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        isRead: false,
      },
    ],
  },
  {
    id: "conv-3",
    client: {
      id: "client-3",
      name: "Jean Kouassi",
      phone: "+225 01 02 03 04 05",
    },
    lastMessage: {
      id: "msg-7",
      content: "À quelle heure pouvez-vous passer demain ?",
      sender: "client",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: true,
    },
    unreadCount: 0,
    reservationId: "res-3",
    serviceName: "Climatisation",
    messages: [
      {
        id: "msg-6",
        content: "Bonjour, pour l'installation des climatiseurs, je peux passer demain.",
        sender: "provider",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5.5),
        isRead: true,
      },
      {
        id: "msg-7",
        content: "À quelle heure pouvez-vous passer demain ?",
        sender: "client",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isRead: true,
      },
    ],
  },
  {
    id: "conv-4",
    client: {
      id: "client-4",
      name: "Awa Sanogo",
      phone: "+225 03 04 05 06 07",
    },
    lastMessage: {
      id: "msg-9",
      content: "Super ! À demain alors.",
      sender: "client",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
    },
    unreadCount: 0,
    serviceName: "Plomberie",
    messages: [
      {
        id: "msg-8",
        content: "Je viendrai demain matin vers 10h pour la réparation.",
        sender: "provider",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24.5),
        isRead: true,
      },
      {
        id: "msg-9",
        content: "Super ! À demain alors.",
        sender: "client",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: true,
      },
    ],
  },
];

const QUICK_REPLIES = [
  "Je suis en route",
  "Je serai là dans 15 minutes",
  "Pouvez-vous me confirmer l'adresse ?",
  "Le travail est terminé",
  "Merci pour votre confiance !",
];

export default function ProviderMessagesPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client");

  const [conversations, setConversations] = React.useState(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(() => {
    if (clientId) {
      return MOCK_CONVERSATIONS.find((c) => c.client.id === clientId) || null;
    }
    return null;
  });
  const [searchQuery, setSearchQuery] = React.useState("");
  const [newMessage, setNewMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Filter conversations
  const filteredConversations = conversations.filter((conversation) =>
    conversation.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Mark messages as read when selecting conversation
  React.useEffect(() => {
    if (selectedConversation) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? {
                ...c,
                unreadCount: 0,
                messages: c.messages.map((m) => ({ ...m, isRead: true })),
              }
            : c
        )
      );
    }
  }, [selectedConversation?.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender: "provider",
      createdAt: new Date(),
      isRead: false,
    };

    // Update conversation with new message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id
          ? {
              ...c,
              messages: [...c.messages, message],
              lastMessage: message,
            }
          : c
      )
    );

    // Update selected conversation
    setSelectedConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
            lastMessage: message,
          }
        : null
    );

    setNewMessage("");

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
  };

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-12rem)]">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            {totalUnread > 0 ? `${totalUnread} message(s) non lu(s)` : "Tous les messages sont lus"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
        {/* Conversation List */}
        <Card className={`border-gray-200/50 ${selectedConversation ? "hidden lg:block" : ""}`}>
          <CardContent className="p-0">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="divide-y">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">Aucune conversation trouvée</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        selectedConversation?.id === conversation.id ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {conversation.client.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{conversation.client.name}</p>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {getRelativeTime(conversation.lastMessage.createdAt)}
                            </span>
                          </div>
                          {conversation.serviceName && (
                            <Badge variant="outline" className="text-xs mb-1">
                              {conversation.serviceName}
                            </Badge>
                          )}
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.sender === "provider" ? "Vous: " : ""}
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        {selectedConversation ? (
          <Card className={`border-gray-200/50 lg:col-span-2 flex flex-col ${!selectedConversation ? "hidden lg:flex" : ""}`}>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedConversation.client.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedConversation.client.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedConversation.serviceName || "Conversation"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <a href={`tel:${selectedConversation.client.phone.replace(/\s/g, "")}`}>
                    <Phone className="h-5 w-5" />
                  </a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                    <DropdownMenuItem>Voir la réservation</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Bloquer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Date Separator */}
                <div className="flex items-center gap-4">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(selectedConversation.messages[0]?.createdAt || new Date())}
                  </span>
                  <Separator className="flex-1" />
                </div>

                {selectedConversation.messages.map((message, index) => {
                  const showDateSeparator =
                    index > 0 &&
                    formatDate(message.createdAt) !==
                      formatDate(selectedConversation.messages[index - 1].createdAt);

                  return (
                    <React.Fragment key={message.id}>
                      {showDateSeparator && (
                        <div className="flex items-center gap-4">
                          <Separator className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.createdAt)}
                          </span>
                          <Separator className="flex-1" />
                        </div>
                      )}
                      <div
                        className={`flex ${
                          message.sender === "provider" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            message.sender === "provider"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              message.sender === "provider"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span className="text-xs">
                              {formatTime(message.createdAt)}
                            </span>
                            {message.sender === "provider" && (
                              <CheckCheck
                                className={`h-3 w-3 ${
                                  message.isRead ? "text-primary-foreground" : "text-primary-foreground/50"
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t overflow-x-auto">
              <div className="flex gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <Button
                    key={reply}
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Input
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="border-gray-200/50 lg:col-span-2 hidden lg:flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">Sélectionnez une conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choisissez une conversation dans la liste pour commencer à discuter
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
