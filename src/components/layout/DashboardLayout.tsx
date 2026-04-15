"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

type UserRole = "CLIENT" | "PROVIDER" | "ADMIN";

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  subscription?: {
    plan: "FREE" | "MONTHLY" | "PREMIUM";
    expiresAt: Date;
  };
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: DashboardUser;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  notificationCount?: number;
  unreadMessages?: number;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  user,
  title,
  breadcrumbs = [],
  notificationCount = 0,
  unreadMessages = 0,
  actions,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          user={user}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar user={user} collapsed={false} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          {item.label}
                        </span>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Page Title (Mobile) */}
          {title && (
            <h1 className="text-lg font-semibold md:hidden truncate">{title}</h1>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search (Desktop) */}
          <div className="hidden md:block relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Page Actions */}
            {actions && <div className="hidden md:flex">{actions}</div>}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucune nouvelle notification
                  </p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu (Desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.role === "CLIENT" ? "/client/profile" : user.role === "PROVIDER" ? "/provider/profile" : "/admin/settings"} className="cursor-pointer">
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            {/* Page Header */}
            {(title || actions) && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {title && (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {breadcrumbs.length > 0 && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 md:hidden">
                        {breadcrumbs.slice(-2).map((item, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && <ChevronRight className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Actions (Mobile) */}
                {actions && <div className="md:hidden">{actions}</div>}
              </div>
            )}

            {/* Children Content */}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav unreadMessages={unreadMessages} />
    </div>
  );
}

export default DashboardLayout;
