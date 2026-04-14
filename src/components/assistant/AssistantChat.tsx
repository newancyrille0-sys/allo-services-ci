"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  HelpCircle,
  Search,
  UserPlus,
  CreditCard,
  Wrench,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Suggestions de questions courantes - adaptées pour clients et prestataires
const QUICK_QUESTIONS = [
  { icon: Search, text: "Trouver un prestataire", query: "Comment trouver un prestataire pour un service ?" },
  { icon: UserPlus, text: "Devenir prestataire", query: "Comment devenir prestataire sur la plateforme ?" },
  { icon: CreditCard, text: "Tarifs & Abonnements", query: "Quels sont les tarifs et abonnements pour les prestataires ?" },
  { icon: Wrench, text: "Réserver un service", query: "Comment réserver un service sur la plateforme ?" },
  { icon: MapPin, text: "Zones couvertes", query: "Dans quelles zones Allo Services CI est disponible ?" },
  { icon: Phone, text: "Contacter le support", query: "Comment contacter le support client ?" },
];

export function AssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! 👋 Je suis l'assistant virtuel d'**Allo Services CI**.\n\nJe suis là pour vous aider à :\n• 🏠 Trouver un prestataire\n• 🛠️ Devenir prestataire\n• 💳 Comprendre les tarifs\n• 📞 Contacter le support\n\nComment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      // Convertir le markdown basique en HTML pour l'affichage
      let formattedContent = data.message || "Désolé, je n'ai pas pu répondre. Veuillez réessayer.";
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formattedContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Une erreur est survenue. 😅 Veuillez réessayer ou contactez notre support :\n\n📞 +225 01 41 10 57 07\n📧 support@alloserviceci.com",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (query: string) => {
    sendMessage(query);
  };

  // Formater le texte avec markdown basique - version sécurisée
  const formatMessage = (content: string): React.ReactNode[] => {
    // Séparer le texte par les sauts de ligne
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Convertir **text** en gras de manière sécurisée
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      
      return (
        <span key={index}>
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
          {index < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 group",
          isOpen
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-primary hover:bg-primary/90"
        )}
        size="icon"
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir l'assistant"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
          </>
        )}
      </Button>

      {/* Notification badge when closed and has new message */}
      {!isOpen && hasNewMessage && (
        <span className="fixed bottom-16 right-6 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] text-white animate-bounce">
          1
        </span>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[400px] max-w-[calc(100vw-3rem)] flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">Assistant Allo Services</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                En ligne • Prêt à vous aider
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-white/60" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === 'user'
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm"
                  )}
                >
                  <p className="whitespace-pre-wrap">
                    {formatMessage(message.content)}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-gray-500">Réflexion en cours...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Show only at start */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-500 mb-2 font-medium">Questions fréquentes :</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q.query)}
                    className="flex items-center gap-2 rounded-lg bg-gray-50 hover:bg-primary/5 px-3 py-2.5 text-xs text-gray-700 hover:text-primary transition-all text-left border border-gray-100 hover:border-primary/20"
                  >
                    <q.icon className="h-4 w-4 shrink-0 text-primary/70" />
                    <span className="font-medium">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 bg-white">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-primary hover:bg-primary/90 shrink-0 rounded-xl"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Allo Services CI • Réponses instantanées 24h/24
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default AssistantChat;
