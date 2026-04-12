"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Icons as inline SVGs for Material Symbols style
const Icons = {
  dashboard: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  requests: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  technicians: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  finance: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  analytics: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  notifications: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  help: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  add: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  menu: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

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
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  permission?: string;
  adminOnly?: boolean;
}

// Navigation items with permissions
const allNavItems: NavItem[] = [
  { icon: Icons.dashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Icons.requests, label: "Requêtes", href: "/admin/reservations", permission: "reservations.read" },
  { icon: Icons.technicians, label: "Techniciens", href: "/admin/providers", badge: 5, permission: "providers.read" },
  { 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "Modération", 
    href: "/admin/moderation", 
    badge: 3,
    permission: "content.read" 
  },
  { icon: Icons.finance, label: "Finances", href: "/admin/payments", permission: "finance.read" },
  { icon: Icons.analytics, label: "Analytics", href: "/admin/analytics", permission: "finance.read" },
  { icon: Icons.settings, label: "Paramètres", href: "/admin/settings", permission: "system.settings" },
];

// Role colors
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-500',
  ADMIN_SENIOR: 'bg-orange-500',
  ADMIN_MODERATOR: 'bg-yellow-500',
  SUPPORT: 'bg-[#001e40]',
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#001e40]"></div>
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
    <div className="min-h-screen bg-[#f7f9fb] font-['Inter',sans-serif] antialiased">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Sovereign Ledger Style */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-slate-50 flex flex-col py-6 z-50 transition-all duration-300",
          "shadow-[0px_12px_32px_rgba(25,28,30,0.04)]",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="px-6 mb-8">
          <h1 className="text-lg font-black text-blue-950 font-['Manrope',sans-serif] tracking-tight uppercase">
            ALLO SERVICES
          </h1>
          <p className="text-[10px] tracking-[0.2em] font-bold text-[#505f76]/50 uppercase">
            Sovereign Ledger
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-[#001e40] text-white shadow-lg shadow-[#001e40]/20"
                    : "text-slate-600 hover:text-blue-900 hover:bg-slate-200"
                )}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full",
                    isActive ? "bg-white/20 text-white" : "bg-[#001e40]/10 text-[#001e40]"
                  )}>
                    {item.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-2 mt-auto space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            {Icons.logout}
            <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Header - Glass Effect */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white/80 backdrop-blur-xl z-30 shadow-[0px_12px_32px_rgba(25,28,30,0.04)]">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {Icons.menu}
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-[#f2f4f6] px-4 py-2 rounded-full w-96">
              <span className="text-[#737780] mr-2">{Icons.search}</span>
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-transparent border-none focus:ring-0 text-sm w-full text-[#191c1e] placeholder:text-[#737780]"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                {Icons.notifications}
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#00b27b] rounded-full status-glow"></span>
              </button>

              {/* Help */}
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                {Icons.help}
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-[#e0e3e5] mx-2 hidden md:block"></div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-[#001e40] font-['Manrope',sans-serif]">
                    {admin.fullName}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">
                    {ROLE_LABELS[admin.role]}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#d0e1fb] flex items-center justify-center text-sm font-bold text-[#001e40]">
                  {getInitials(admin.fullName)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
