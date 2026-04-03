"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  className?: string;
  pulsing?: boolean;
}

export function LiveIndicator({ className, pulsing = true }: LiveIndicatorProps) {
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
