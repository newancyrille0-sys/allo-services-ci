"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Bell, MessageCircle, Search, Calendar, Heart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { FeedPage } from "@/components/feed";

export default function ClientHomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Bonjour");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const userName = user?.fullName?.split(" ")[0] || "Cher client";

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Top Header Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004150] to-[#005a6e] flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-[#004150] hidden sm:block">Allo Services</span>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un service, un prestataire..."
                  className="pl-10 bg-gray-100 border-0"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#fd7613] rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5 text-gray-600" />
              </Button>
              <Avatar className="h-9 w-9 border-2 border-[#fd7613]">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-[#004150] text-white text-sm font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Feed */}
      <div className="pt-20 pb-4">
        <FeedPage
          userType="CLIENT"
          userId={user?.id}
          userName={user?.fullName}
          userAvatar={user?.avatarUrl}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-[#004150]">
            <Heart className="h-5 w-5" />
            <span className="text-[10px]">Accueil</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
            <Search className="h-5 w-5" />
            <span className="text-[10px]">Rechercher</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
            <Calendar className="h-5 w-5" />
            <span className="text-[10px]">Réservations</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px]">Messages</span>
          </Button>
          <Button variant="ghost" className="flex flex-col gap-1 h-auto py-2 text-gray-500">
            <Wallet className="h-5 w-5" />
            <span className="text-[10px]">Profil</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
