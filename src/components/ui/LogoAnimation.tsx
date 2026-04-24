"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LogoAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  loop?: boolean;
  variant?: "default" | "light";
}

/**
 * Allôservice.ci - Clean Animated Logo
 * 
 * Minimal, modern, elegant 2D animation
 * Duration: 3-4 seconds, smooth loop every 3 seconds
 * 
 * Animation Phases:
 * 0s-1s: Fade-in + line drawing
 * 1s-2s: Phone + location icon formation  
 * 2s-3s: Text fade + upward motion
 * 3s-4s: Light sweep glow
 * Repeats every 3 seconds
 */
export function LogoAnimation({ 
  className, 
  size = "md",
  loop = true,
  variant = "default"
}: LogoAnimationProps) {
  // Key to re-trigger animation every 3 seconds
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    if (loop) {
      const interval = setInterval(() => {
        setAnimationKey(prev => prev + 1);
      }, 3000); // Repeat every 3 seconds
      
      return () => clearInterval(interval);
    }
  }, [loop]);
  const dimensions = {
    sm: { icon: 28, text: "text-sm", gap: "gap-1.5" },
    md: { icon: 36, text: "text-base", gap: "gap-2" },
    lg: { icon: 44, text: "text-lg", gap: "gap-2.5" },
    xl: { icon: 52, text: "text-xl", gap: "gap-3" }
  };

  const { icon: iconSize, text: textSize, gap } = dimensions[size];
  const isLight = variant === "light";
  const primaryColor = isLight ? "#ffffff" : "#004150";
  const secondaryColor = isLight ? "rgba(255,255,255,0.9)" : "#9C4400";
  const accentColor = isLight ? "#ffffff" : "#FD7613";

  return (
    <div 
      key={animationKey}
      className={cn(
        "relative flex items-center",
        gap,
        className
      )}
    >
      {/* Animated Icon Container */}
      <div 
        className="relative flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg 
          viewBox="0 0 50 50" 
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Teal Gradient */}
            <linearGradient id={`tealGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="1" />
              <stop offset="100%" stopColor={isLight ? "rgba(255,255,255,0.8)" : "#005a6a"} />
            </linearGradient>
            
            {/* Orange Accent Gradient */}
            <linearGradient id={`orangeGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={isLight ? "rgba(255,255,255,0.8)" : "#ff9540"} />
            </linearGradient>
            
            {/* Glow Sweep Gradient */}
            <linearGradient id={`glowSweep-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="40%" stopColor={isLight ? "rgba(255,255,255,0.4)" : "rgba(0, 65, 80, 0.3)"} />
              <stop offset="60%" stopColor={isLight ? "rgba(255,255,255,0.4)" : "rgba(0, 65, 80, 0.3)"} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Phone Outline - Line Drawing Animation */}
          <g className="logo-phone-outline">
            <path
              d="M12 14 Q12 8 18 8 L32 8 Q38 8 38 14 L38 36 Q38 42 32 42 L18 42 Q12 42 12 36 Z"
              fill="none"
              stroke={`url(#tealGrad-${variant})`}
              strokeWidth="2"
              strokeLinecap="round"
              className="logo-draw-path"
            />
            {/* Phone speaker */}
            <path
              d="M20 13 L30 13"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              className="logo-draw-line-1"
            />
            {/* Home button */}
            <circle
              cx="25"
              cy="38"
              r="2"
              fill="none"
              stroke={primaryColor}
              strokeWidth="1.5"
              className="logo-draw-circle"
            />
          </g>

          {/* Location Pin Overlay */}
          <g className="logo-location-pin">
            {/* Pin body */}
            <path
              d="M25 17 Q31 17 31 24 Q31 29 25 35 Q19 29 19 24 Q19 17 25 17 Z"
              fill={`url(#orangeGrad-${variant})`}
              className="logo-pin-fill"
            />
            {/* Pin center dot */}
            <circle
              cx="25"
              cy="23"
              r="3"
              fill={isLight ? "rgba(0,0,0,0.3)" : "#ffffff"}
              className="logo-pin-dot"
            />
          </g>

          {/* Light Sweep Effect */}
          <rect
            x="-15"
            y="0"
            width="15"
            height="50"
            fill={`url(#glowSweep-${variant})`}
            className="logo-glow-sweep"
          />

          {/* Subtle shadow */}
          <ellipse
            cx="25"
            cy="48"
            rx="15"
            ry="1.5"
            fill={isLight ? "rgba(255,255,255,0.2)" : "rgba(0, 65, 80, 0.15)"}
            className="logo-shadow"
          />
        </svg>
      </div>

      {/* Animated Text */}
      <div className="flex items-baseline whitespace-nowrap logo-text-container">
        <span 
          className={cn(
            "font-extrabold tracking-tight logo-text-allo",
            textSize
          )}
          style={{ color: primaryColor }}
        >
          Allô
        </span>
        <span 
          className={cn(
            "font-light tracking-tight logo-text-service",
            textSize
          )}
          style={{ color: secondaryColor }}
        >
          service
        </span>
        <span 
          className={cn(
            "font-light tracking-tight logo-text-ci",
            textSize
          )}
          style={{ color: isLight ? "rgba(255,255,255,0.7)" : "rgba(0, 65, 80, 0.5)" }}
        >
          .ci
        </span>
      </div>
    </div>
  );
}

export default LogoAnimation;
