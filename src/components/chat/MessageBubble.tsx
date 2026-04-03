"use client";

import * as React from "react";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
  showAvatar?: boolean;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function MessageBubble({
  content,
  timestamp,
  isOwn,
  senderName,
  senderAvatar,
  isRead = false,
  showAvatar = false,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-2 max-w-[85%]",
        isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {senderName?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-1",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {/* Sender Name (for group chats) */}
        {!isOwn && showAvatar && senderName && (
          <span className="text-xs text-muted-foreground ml-1">
            {senderName}
          </span>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-2 rounded-2xl text-sm",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>

        {/* Timestamp and Read Status */}
        <div
          className={cn(
            "flex items-center gap-1 px-1",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-xs text-muted-foreground">
            {formatTime(timestamp)}
          </span>
          {isOwn && (
            <span className="text-muted-foreground">
              {isRead ? (
                <CheckCheck className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
