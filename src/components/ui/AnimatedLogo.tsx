"use client";

import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export function AnimatedLogo({ 
  className, 
  variant = "default",
  size = "md",
  showSubtitle = false 
}: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo Icon with Animation */}
      <div className="relative">
        {/* Outer ring animation */}
        <div className={cn(
          "absolute inset-0 rounded-full",
          "animate-logo-ring",
          variant === "light" ? "bg-white/20" : "bg-primary/20"
        )} />
        
        {/* Main icon container */}
        <div className={cn(
          "relative flex items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-primary-container",
          "animate-logo-icon",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12"
        )}>
          {/* Phone icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={cn(
              "text-white animate-logo-pulse",
              size === "sm" && "w-4 h-4",
              size === "md" && "w-5 h-5",
              size === "lg" && "w-6 h-6"
            )}
          >
            <path
              d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
              fill="currentColor"
            />
          </svg>
          
          {/* Signal waves animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={cn(
              "absolute rounded-full border-2 border-white/30",
              "animate-signal-wave",
              size === "sm" && "w-10 h-10",
              size === "md" && "w-12 h-12",
              size === "lg" && "w-14 h-14"
            )} />
            <div className={cn(
              "absolute rounded-full border-2 border-white/20",
              "animate-signal-wave-delayed",
              size === "sm" && "w-14 h-14",
              size === "md" && "w-16 h-16",
              size === "lg" && "w-20 h-20"
            )} />
          </div>
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          {/* "ALLÔ" with gradient animation */}
          <span className={cn(
            "font-extrabold tracking-tight",
            "bg-gradient-to-r from-primary via-primary-container to-primary",
            "bg-clip-text text-transparent",
            "animate-gradient-x",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}>
            ALLÔ
          </span>
          
          {/* "SERVICES" with slide-in animation */}
          <span className={cn(
            "font-bold tracking-tight animate-text-slide",
            variant === "light" ? "text-white" : "text-secondary",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}>
            SERVICES
          </span>
        </div>
        
        {/* Optional subtitle */}
        {showSubtitle && (
          <span className={cn(
            "text-[10px] font-medium tracking-widest uppercase",
            "animate-fade-in",
            variant === "light" ? "text-white/60" : "text-muted-foreground"
          )}>
            Côte d&apos;Ivoire
          </span>
        )}
      </div>
    </div>
  );
}

export default AnimatedLogo;
