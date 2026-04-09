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
  UserCog,
  FileText,
  AlertTriangle,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminAssistantChat } from "@/components/assistant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN_SENIOR' | 'ADMIN_MODERATOR' | 'SUPPORT';
  status: string;
  avatarUrl?: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  permission?: string;
  adminOnly?: boolean; // Only for SUPER_ADMIN
}

// Navigation items with permissions
const allNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users", permission: "users.read" },
  { icon: UserCheck, label: "Prestataires", href: "/admin/providers", badge: 5, permission: "providers.read" },
  { icon: CreditCard, label: "Abonnements", href: "/admin/subscriptions", permission: "finance.read" },
  { icon: Wallet, label: "Paiements", href: "/admin/payments", permission: "payments.read" },
  { icon: CalendarDays, label: "Réservations", href: "/admin/reservations", permission: "reservations.read" },
  { icon: MessageSquareWarning, label: "Avis", href: "/admin/reviews", badge: 3, permission: "content.read" },
  { icon: AlertTriangle, label: "Fraude", href: "/admin/fraud", badge: 12, permission: "system.logs" },
  { icon: FileText, label: "Contenus", href: "/admin/content", permission: "content.read" },
  { icon: HeadphonesIcon, label: "Support", href: "/admin/support", permission: "support.read" },
  { icon: UserCog, label: "Admins", href: "/admin/admins", adminOnly: true },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings", permission: "system.settings" },
];

// Role colors
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-500',
  ADMIN_SENIOR: 'bg-orange-500',
  ADMIN_MODERATOR: 'bg-yellow-500',
  SUPPORT: 'bg-blue-500',
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_SENIOR: 'Admin Senior',
  ADMIN_MODERATOR: 'Modérateur',
  SUPPORT: 'Support',
};

// Permissions par rôle
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    'users.read', 'providers.read', 'finance.read', 'payments.read',
    'reservations.read', 'content.read', 'system.logs', 'system.settings', 'support.read',
  ],
  ADMIN_SENIOR: [
    'users.read', 'providers.read', 'finance.read', 'payments.read',
    'reservations.read', 'content.read', 'system.logs', 'support.read',
  ],
  ADMIN_MODERATOR: [
    'users.read', 'providers.read', 'content.read', 'support.read',
  ],
  SUPPORT: [
    'users.read', 'providers.read', 'reservations.read', 'support.read',
  ],
};

function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

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
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch admin info
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch('/api/admin/me');
        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
        } else {
          // Not authenticated, redirect to login
          if (pathname !== '/admin/login') {
            router.push('/admin/login');
          }
        }
      } catch {
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (pathname !== '/admin/login') {
      fetchAdmin();
    } else {
      setIsLoading(false);
    }
  }, [pathname, router]);

  // Filter navigation based on role
  const navItems = allNavItems.filter(item => {
    if (item.adminOnly) {
      return admin?.role === 'SUPER_ADMIN';
    }
    if (item.permission) {
      return admin && hasPermission(admin.role, item.permission);
    }
    return true;
  });

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, don't render (will redirect)
  if (!admin) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // Ignore errors
    }
    router.push('/admin/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
              <AvatarImage src={admin.avatarUrl} />
              <AvatarFallback className={cn("text-white", ROLE_COLORS[admin.role])}>
                {getInitials(admin.fullName)}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin.fullName}</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", ROLE_COLORS[admin.role])} />
                  <p className="text-xs text-gray-400 truncate">{ROLE_LABELS[admin.role]}</p>
                </div>
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
                      <AvatarImage src={admin.avatarUrl} />
                      <AvatarFallback className={cn("text-white text-sm", ROLE_COLORS[admin.role])}>
                        {getInitials(admin.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{admin.fullName}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">{admin.fullName}</p>
                    <p className="text-xs text-gray-400">{admin.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={cn("w-2 h-2 rounded-full", ROLE_COLORS[admin.role])} />
                      <span className="text-xs text-gray-300">{ROLE_LABELS[admin.role]}</span>
                    </div>
                  </div>
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

      {/* Admin Assistant Chat */}
      <AdminAssistantChat />
    </div>
  );
}
