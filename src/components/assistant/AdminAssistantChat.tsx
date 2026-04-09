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
  Users,
  Shield,
  BarChart3,
  Settings,
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

// Suggestions de questions pour les admins
const QUICK_QUESTIONS = [
  { icon: Users, text: "Gérer un utilisateur", query: "Comment puis-je gérer un compte utilisateur problématique ?" },
  { icon: Shield, text: "Valider un KYC", query: "Comment valider ou rejeter un dossier KYC ?" },
  { icon: BarChart3, text: "Voir les statistiques", query: "Comment accéder aux statistiques de la plateforme ?" },
  { icon: Settings, text: "Créer un admin", query: "Comment créer un nouveau compte administrateur ?" },
];

// System prompt pour l'assistant admin
const ADMIN_SYSTEM_PROMPT = `Tu es l'assistant administrateur d'Allo Services CI. Tu aides les administrateurs dans leurs tâches quotidiennes.

## Types d'administrateurs
1. **Super Admin** - Accès total, peut créer d'autres admins
2. **Admin Senior** - Gestion complète utilisateurs & prestataires
3. **Modérateur** - Modération des contenus
4. **Support** - Réponse aux tickets clients

## Fonctionnalités admin
- Dashboard avec statistiques
- Gestion des utilisateurs (suspendre, supprimer)
- Gestion des prestataires (vérifier KYC, suspendre)
- Modération des contenus (photos, vidéos, commentaires)
- Gestion des paiements et remboursements
- Support client (tickets)
- Logs d'audit

## Règles importantes
- Toujours vérifier les permissions avant une action
- Logger toutes les actions sensibles
- Ne jamais partager les données sensibles
- En cas de doute, escalader au Super Admin

Sois professionnel et aide les admins dans leurs tâches.`;

export function AdminAssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Bonjour ! 👋 Je suis l'assistant administrateur.\n\nJe peux vous aider avec la gestion des utilisateurs, prestataires, contenus et plus encore.\n\nQue puis-je faire pour vous ?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || "Je n'ai pas pu traiter votre demande.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Une erreur est survenue. Veuillez réessayer.",
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

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-gray-700 hover:bg-gray-600"
            : "bg-orange-500 hover:bg-orange-600"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl sm:h-[550px]">
          {/* Header */}
          <div className="flex items-center gap-3 rounded-t-2xl bg-orange-500 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Assistant Admin</h3>
              <p className="text-xs text-white/70">Aide pour l'administration</p>
            </div>
            <Sparkles className="h-5 w-5 text-white/50" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                    <Bot className="h-4 w-4 text-orange-400" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                    message.role === 'user'
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-200 rounded-bl-sm"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-700">
                    <User className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
                  <Bot className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-gray-800 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">Réflexion...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Questions fréquentes :</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q.query)}
                    className="flex items-center gap-2 rounded-lg bg-gray-800/50 px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 transition-colors text-left"
                  >
                    <q.icon className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                    <span className="truncate">{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="bg-orange-500 hover:bg-orange-600 shrink-0"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
