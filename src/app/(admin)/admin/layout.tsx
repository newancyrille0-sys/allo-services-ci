"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Wallet,
  CalendarDays,
  MessageSquareWarning,
  ShieldAlert,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: UserCheck, label: "Prestataires", href: "/admin/providers", badge: 5 },
  { icon: CreditCard, label: "Abonnements", href: "/admin/subscriptions" },
  { icon: Wallet, label: "Paiements", href: "/admin/payments" },
  { icon: CalendarDays, label: "Réservations", href: "/admin/reservations" },
  { icon: MessageSquareWarning, label: "Avis", href: "/admin/reviews", badge: 3 },
  { icon: ShieldAlert, label: "Fraude", href: "/admin/fraud", badge: 12 },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("adminSession");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-white">Allo Services</h1>
                <p className="text-xs text-gray-400">Administration</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {!isSidebarOpen && item.badge && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Toggle Button (Desktop) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white"
        >
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              isSidebarOpen ? "-rotate-90" : "rotate-90"
            )}
          />
        </Button>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <Avatar className="w-10 h-10 border-2 border-primary/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary">AD</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">admin@alloservices.ci</p>
              </div>
            )}
            {isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        {/* Header */}
        <header className="h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-30">
          <div className="h-full px-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-gray-400"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search */}
            <div className={cn("flex-1 max-w-xl", isSearchOpen ? "block" : "hidden md:block")}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden text-gray-400"
              >
                <Search className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-400">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-gray-800 border-gray-700">
                  <div className="p-3 border-b border-gray-700">
                    <h3 className="font-semibold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-gray-700">
                      <p className="text-sm text-white">Nouveau prestataire en attente</p>
                      <p className="text-xs text-gray-400">Il y a 5 minutes</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 focus:bg-gray-700">
                      <p className="text-sm text-white">Alerte fraude détectée</p>
                      <p className="text-xs text-gray-400">Il y a 15 minutes</p>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-gray-300">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-700">
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
