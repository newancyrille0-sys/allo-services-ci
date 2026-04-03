"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollRevealOptions {
  /** Threshold for intersection observer (0-1) */
  threshold?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Trigger only once or every time element enters viewport */
  triggerOnce?: boolean;
  /** Animation delay in milliseconds */
  delay?: number;
}

/**
 * Custom hook for scroll reveal animations
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimatedRef = useRef(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        if (delay > 0) {
          setTimeout(() => {
            setIsVisible(true);
            hasAnimatedRef.current = true;
          }, delay);
        } else {
          setIsVisible(true);
          hasAnimatedRef.current = true;
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [delay, triggerOnce]
  );

  useEffect(() => {
    const element = ref.current;

    // Skip if already animated and triggerOnce is true
    if (triggerOnce && hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleIntersection, threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Hook for staggered reveal animations on multiple elements
 */
export function useStaggeredReveal(
  itemCount: number,
  options: UseScrollRevealOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;

    // Skip if already animated
    if (hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Stagger the reveal of each item
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const updated = [...prev];
                updated[i] = true;
                return updated;
              });
            }, i * staggerDelay);
          }
          hasAnimatedRef.current = true;
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: scrollOptions.threshold ?? 0.1,
        rootMargin: scrollOptions.rootMargin ?? "0px",
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [itemCount, staggerDelay, scrollOptions.threshold, scrollOptions.rootMargin]);

  return { containerRef, visibleItems };
}

/**
 * Utility component for scroll reveal wrapper
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "slide-up" | "slide-down" | "scale-in";
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-in",
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({
    threshold,
    delay,
    triggerOnce,
  });

  const animationClasses: Record<string, string> = {
    "fade-in": "opacity-0 data-[visible=true]:animate-fade-in",
    "slide-up": "opacity-0 data-[visible=true]:animate-slide-up",
    "slide-down": "opacity-0 data-[visible=true]:animate-slide-down",
    "scale-in": "opacity-0 data-[visible=true]:animate-scale-in",
  };

  return (
    <div
      ref={ref}
      data-visible={isVisible}
      className={`${animationClasses[animation]} ${className}`}
    >
      {children}
    </div>
  );
}
