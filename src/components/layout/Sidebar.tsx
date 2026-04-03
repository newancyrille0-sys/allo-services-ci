"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Heart,
  User,
  LogOut,
  Settings,
  Wrench,
  Star,
  CreditCard,
  BarChart3,
  Users,
  Shield,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type UserRole = "CLIENT" | "PROVIDER" | "ADMIN";
type SubscriptionPlan = "FREE" | "MONTHLY" | "PREMIUM";

interface SidebarUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  subscription?: {
    plan: SubscriptionPlan;
    expiresAt: Date;
  };
}

interface SidebarProps {
  user: SidebarUser;
  collapsed?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const clientNavItems: NavItem[] = [
  { name: "Tableau de bord", href: "/client/dashboard", icon: LayoutDashboard },
  { name: "Mes réservations", href: "/client/reservations", icon: CalendarDays },
  { name: "Messages", href: "/client/messages", icon: MessageSquare, badge: 3 },
  { name: "Favoris", href: "/client/favoris", icon: Heart },
  { name: "Mon profil", href: "/client/profil", icon: User },
];

const providerNavItems: NavItem[] = [
  { name: "Tableau de bord", href: "/provider/dashboard", icon: LayoutDashboard },
  { name: "Mon profil", href: "/provider/profil", icon: User },
  { name: "Mes services", href: "/provider/services", icon: Wrench },
  { name: "Réservations", href: "/provider/reservations", icon: CalendarDays, badge: 5 },
  { name: "Messages", href: "/provider/messages", icon: MessageSquare, badge: 2 },
  { name: "Avis", href: "/provider/avis", icon: Star },
  { name: "Abonnement", href: "/provider/abonnement", icon: CreditCard },
  { name: "Analytics", href: "/provider/analytics", icon: BarChart3 },
];

const adminNavItems: NavItem[] = [
  { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Prestataires", href: "/admin/prestataires", icon: Users },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Abonnements", href: "/admin/abonnements", icon: CreditCard },
  { name: "Paiements", href: "/admin/paiements", icon: DollarSign },
  { name: "Fraude", href: "/admin/fraude", icon: AlertTriangle, badge: 12 },
  { name: "Paramètres", href: "/admin/parametres", icon: Settings },
];

const subscriptionStyles: Record<SubscriptionPlan, { color: string; icon: React.ElementType }> = {
  FREE: { color: "text-gray-500", icon: Zap },
  MONTHLY: { color: "text-green-500", icon: CreditCard },
  PREMIUM: { color: "text-accent", icon: Crown },
};

export function Sidebar({ user, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = React.useMemo(() => {
    switch (user.role) {
      case "ADMIN":
        return adminNavItems;
      case "PROVIDER":
        return providerNavItems;
      default:
        return clientNavItems;
    }
  }, [user.role]);

  const subscriptionStyle = user.subscription
    ? subscriptionStyles[user.subscription.plan]
    : null;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      <TooltipProvider delayDuration={0}>
        {/* User Profile Section */}
        <div className={cn("p-4 border-b", collapsed && "p-2")}>
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center"
            )}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                {subscriptionStyle && user.subscription && (
                  <div className="flex items-center gap-1 mt-1">
                    <subscriptionStyle.icon
                      className={cn("h-3 w-3", subscriptionStyle.color)}
                    />
                    <span className={cn("text-xs font-medium", subscriptionStyle.color)}>
                      {user.subscription.plan === "PREMIUM"
                        ? "Premium"
                        : user.subscription.plan === "MONTHLY"
                        ? "Mensuel"
                        : "Gratuit"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const content = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-primary-foreground" : "text-gray-500"
                    )}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "default"}
                          className={cn(
                            "h-5 min-w-5 px-1.5 text-xs",
                            !isActive && "bg-primary text-primary-foreground"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              );

              return (
                <li key={item.name} className="relative">
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{content}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                        {item.badge && (
                          <Badge className="ml-2" variant="destructive">
                            {item.badge}
                          </Badge>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Subscription Status (Provider only) */}
        {user.role === "PROVIDER" && !collapsed && user.subscription && (
          <div className="p-4 border-t">
            <div
              className={cn(
                "p-3 rounded-lg",
                user.subscription.plan === "PREMIUM"
                  ? "bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20"
                  : "bg-gray-50 border border-gray-200"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {subscriptionStyle && (
                  <subscriptionStyle.icon
                    className={cn("h-4 w-4", subscriptionStyle.color)}
                  />
                )}
                <span className="text-sm font-medium">
                  {user.subscription.plan === "PREMIUM"
                    ? "Plan Premium"
                    : user.subscription.plan === "MONTHLY"
                    ? "Plan Mensuel"
                    : "Plan Gratuit"}
                </span>
              </div>
              {user.subscription.plan !== "PREMIUM" && (
                <Button
                  size="sm"
                  className="w-full bg-accent hover:bg-accent-600 text-accent-foreground"
                  asChild
                >
                  <Link href="/provider/abonnement">
                    <Crown className="h-4 w-4 mr-1" />
                    Passer à Premium
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className={cn("p-4 border-t", collapsed && "p-2")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-gray-600 hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Déconnexion</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </Button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute top-20 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors",
            "hidden lg:flex"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </TooltipProvider>
    </aside>
  );
}

export default Sidebar;
