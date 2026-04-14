"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AssistantChat } from "@/components/assistant/AssistantChat";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      
      {/* Assistant IA - Disponible sur toutes les pages publiques */}
      <AssistantChat />
    </div>
  );
}
