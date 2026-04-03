"use client";

import * as React from "react";
import { Send, Phone, MoreVertical, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageBubble } from "./MessageBubble";

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  isRead: boolean;
}

export interface ChatRecipient {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  businessName?: string;
}

export interface ChatWindowProps {
  messages: ChatMessage[];
  recipient: ChatRecipient;
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
  isTyping?: boolean;
  showBackButton?: boolean;
}

export function ChatWindow({
  messages,
  recipient,
  currentUserId,
  onSendMessage,
  onBack,
  isLoading = false,
  isTyping = false,
  showBackButton = false,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (newMessage.trim() && !isLoading) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    const groups: { date: string; messages: ChatMessage[] }[] = [];
    let currentDate = "";

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white sticky top-0 z-10">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <Avatar className="h-10 w-10">
          <AvatarImage src={recipient.avatar} alt={recipient.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {recipient.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">
              {recipient.businessName || recipient.name}
            </h3>
            {recipient.isOnline && (
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </div>
          {recipient.businessName && (
            <p className="text-xs text-muted-foreground truncate">
              {recipient.name}
            </p>
          )}
          {isTyping && (
            <p className="text-xs text-primary">En train d'écrire...</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Phone className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Voir le profil</DropdownMenuItem>
              <DropdownMenuItem>Bloquer</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Signaler
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Démarrez la conversation</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Envoyez un message à {recipient.name}
            </p>
          </div>
        ) : (
          groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              {/* Date Separator */}
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="text-xs capitalize">
                  {group.date}
                </Badge>
              </div>

              {/* Messages */}
              {group.messages.map((message, messageIndex) => {
                const isOwn = message.senderId === currentUserId;
                const showAvatar =
                  !isOwn &&
                  (messageIndex === 0 ||
                    group.messages[messageIndex - 1].senderId !== message.senderId);

                return (
                  <MessageBubble
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    isOwn={isOwn}
                    senderName={recipient.name}
                    senderAvatar={recipient.avatar}
                    isRead={message.isRead}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipient.avatar} alt={recipient.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {recipient.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 px-4 py-2 bg-muted rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-white">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez votre message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
