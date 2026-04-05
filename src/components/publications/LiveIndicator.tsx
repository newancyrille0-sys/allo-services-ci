"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Animated colors for the live indicator
const LIVE_COLORS = [
  "hsl(var(--secondary))", // Orange
  "#FFFFFF",               // White
  "hsl(var(--success))",   // Green
];

interface LiveIndicatorProps {
  className?: string;
  pulsing?: boolean;
  animated?: boolean;
}

export function LiveIndicator({ className, pulsing = true, animated = true }: LiveIndicatorProps) {
  const [colorIndex, setColorIndex] = React.useState(0);

  // Animate colors
  React.useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % LIVE_COLORS.length);
    }, 500);
    
    return () => clearInterval(interval);
  }, [animated]);

  if (animated) {
    return (
      <span
        className={cn(
          "inline-block h-3 w-3 rounded-full transition-colors duration-300",
          className
        )}
        style={{ 
          backgroundColor: LIVE_COLORS[colorIndex], 
          boxShadow: `0 0 8px ${LIVE_COLORS[colorIndex]}` 
        }}
      />
    );
  }

  // Standard pulsing indicator
  return (
    <span
      className={cn(
        "relative flex h-2.5 w-2.5",
        className
      )}
    >
      {pulsing && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      )}
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
    </span>
  );
}

export default LiveIndicator;
