"use client";

import Link from "next/link";

/**
 * Skip to main content link for keyboard users
 * Improves accessibility by allowing users to skip navigation
 */
export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="skip-to-content"
      // Only visible on focus
    >
      Aller au contenu principal
    </Link>
  );
}

/**
 * Visually hidden component for screen readers
 * Use this to provide context for screen reader users
 */
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export function VisuallyHidden({ children, as: Component = "span" }: VisuallyHiddenProps) {
  const Tag = Component as React.ElementType;
  return (
    <Tag className="sr-only">
      {children}
    </Tag>
  );
}

/**
 * Live region for announcements to screen readers
 */
interface LiveRegionProps {
  children: React.ReactNode;
  /** Whether to interrupt current announcements */
  assertive?: boolean;
  /** Whether to announce changes */
  atomic?: boolean;
  /** ID for the region */
  id?: string;
}

export function LiveRegion({ 
  children, 
  assertive = false, 
  atomic = true,
  id 
}: LiveRegionProps) {
  return (
    <div
      id={id}
      role="status"
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}

/**
 * Focus trap wrapper for modals and dialogs
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export function FocusTrap({ children, active = true }: FocusTrapProps) {
  if (!active) return <>{children}</>;

  return (
    <div data-focus-trap className="outline-none">
      {children}
    </div>
  );
}
