"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// WebSocket configuration
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3003";

interface UseWebSocketOptions {
  url?: string;
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp?: string;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = WS_URL,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectCountRef.current = 0;
        onConnect?.();
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        onDisconnect?.();

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(
            `Attempting reconnection ${reconnectCountRef.current}/${reconnectAttempts}`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          onMessage?.(data);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      socketRef.current = socket;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    socketRef.current?.close();
    socketRef.current = null;
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.send(JSON.stringify(message));
      return true;
    }
    console.warn("WebSocket is not connected");
    return false;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  };
}

// Hook for chat messaging
export function useChat(options: { userId: string; reservationId?: string }) {
  const { userId, reservationId } = options;
  const [messages, setMessages] = useState<any[]>([]);
  const [typing, setTyping] = useState<string[]>([]);

  const { isConnected, sendMessage: wsSend } = useWebSocket({
    onMessage: (data) => {
      switch (data.type) {
        case "message":
          setMessages((prev) => [...prev, data.payload]);
          break;
        case "typing":
          if (data.payload.isTyping) {
            setTyping((prev) =>
              prev.includes(data.payload.userId)
                ? prev
                : [...prev, data.payload.userId]
            );
          } else {
            setTyping((prev) =>
              prev.filter((id) => id !== data.payload.userId)
            );
          }
          break;
        case "history":
          setMessages(data.payload.messages);
          break;
      }
    },
  });

  const sendMessage = useCallback(
    (content: string, receiverId: string) => {
      const message = {
        id: Date.now().toString(),
        senderId: userId,
        receiverId,
        reservationId,
        content,
        timestamp: new Date().toISOString(),
      };
      wsSend("message", message);
      // Also add to local state immediately
      setMessages((prev) => [...prev, message]);
    },
    [userId, reservationId, wsSend]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      wsSend("typing", { userId, isTyping });
    },
    [userId, wsSend]
  );

  return {
    messages,
    typing,
    isConnected,
    sendMessage,
    sendTyping,
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications(options: { userId: string }) {
  const { userId } = options;
  const [notifications, setNotifications] = useState<any[]>([]);

  const { isConnected } = useWebSocket({
    onMessage: (data) => {
      if (data.type === "notification" && data.payload.userId === userId) {
        setNotifications((prev) => [data.payload, ...prev]);
      }
    },
  });

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  return {
    notifications,
    isConnected,
    markAsRead,
  };
}

// Hook for live streaming
export function useLiveStream(options: { liveId: string }) {
  const { liveId } = options;
  const [viewerCount, setViewerCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);

  const { isConnected, sendMessage: wsSend } = useWebSocket({
    onMessage: (data) => {
      if (data.payload?.liveId !== liveId) return;

      switch (data.type) {
        case "viewer_count":
          setViewerCount(data.payload.count);
          break;
        case "comment":
          setComments((prev) => [...prev, data.payload]);
          break;
        case "like":
          // Handle like animation
          break;
      }
    },
  });

  const joinLive = useCallback(() => {
    wsSend("join_live", { liveId, userId: Date.now().toString() });
  }, [liveId, wsSend]);

  const leaveLive = useCallback(() => {
    wsSend("leave_live", { liveId, userId: Date.now().toString() });
  }, [liveId, wsSend]);

  const sendComment = useCallback(
    (content: string, userId: string, userName: string) => {
      wsSend("live_comment", { liveId, userId, userName, content });
    },
    [liveId, wsSend]
  );

  const sendLike = useCallback(() => {
    wsSend("live_like", { liveId });
  }, [liveId, wsSend]);

  return {
    viewerCount,
    comments,
    isConnected,
    joinLive,
    leaveLive,
    sendComment,
    sendLike,
  };
}
