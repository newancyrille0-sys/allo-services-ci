"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: MobileNavItem[] = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Search },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Profil", href: "/profil", icon: User },
];

interface MobileNavProps {
  unreadMessages?: number;
}

export function MobileNav({ unreadMessages = 0 }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.name === "Messages" && unreadMessages > 0;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative",
                "transition-colors duration-200",
                isActive ? "text-primary" : "text-gray-500"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-6 w-6 transition-all duration-200",
                    isActive && "stroke-[2.5px]"
                  )}
                />
                {showBadge && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 min-w-4 h-4 px-1",
                      "flex items-center justify-center",
                      "text-xs font-medium text-white",
                      "bg-primary rounded-full"
                    )}
                  >
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 font-medium",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                {item.name}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
