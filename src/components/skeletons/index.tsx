import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Provider Card Skeleton
 * Used when loading provider cards on homepage, search results, etc.
 */
export function ProviderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />

          <div className="flex-1 min-w-0">
            {/* Business name */}
            <Skeleton className="h-5 w-3/4 mb-2" />

            {/* Service category */}
            <Skeleton className="h-4 w-1/2 mb-3" />

            {/* Rating stars */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
              <Skeleton className="h-4 w-8 ml-1" />
            </div>

            {/* Trust score */}
            <Skeleton className="h-2 w-full mb-3" />

            {/* Location and price */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

/**
 * Service Card Skeleton
 * Used when loading service category cards
 */
export function ServiceCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <Skeleton className="h-12 w-12 rounded-lg mb-3" />

          {/* Service name */}
          <Skeleton className="h-5 w-24 mb-2" />

          {/* Provider count */}
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Reservation Card Skeleton
 * Used in client and provider dashboards
 */
export function ReservationCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Status badge */}
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Service name */}
        <Skeleton className="h-5 w-3/4 mb-3" />

        {/* Date and time */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Provider info */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Dashboard Stats Card Skeleton
 * Used for loading dashboard statistics
 */
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Chat Message Skeleton
 * Used in messaging interfaces
 */
export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />

      {/* Message bubble */}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn ? "bg-primary/10" : "bg-muted"
          }`}
        >
          <Skeleton className="h-4 w-48 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-3 w-16 mt-1 ml-auto" />
      </div>
    </div>
  );
}

/**
 * Conversation List Item Skeleton
 * Used in messaging sidebar
 */
export function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  );
}

/**
 * Review Card Skeleton
 * Used in provider profiles and review sections
 */
export function ReviewCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

/**
 * Table Row Skeleton
 * Used in admin dashboard tables
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Profile Header Skeleton
 * Used in provider and user profile pages
 */
export function ProfileHeaderSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Cover image */}
      <Skeleton className="h-32 w-full" />

      <CardContent className="relative pt-0">
        <div className="flex items-end gap-4 -mt-12">
          {/* Avatar */}
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />

          <div className="flex-1 pb-2">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Notification Item Skeleton
 * Used in notification dropdown and page
 */
export function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-3 w-3/4 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

/**
 * Dashboard Header Skeleton
 * Used at the top of dashboard pages
 */
export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

/**
 * Form Field Skeleton
 * Used in loading form states
 */
export function FormFieldSkeleton({ label = true }: { label?: boolean }) {
  return (
    <div className="space-y-2">
      {label && <Skeleton className="h-4 w-24" />}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

/**
 * Chart Skeleton
 * Used in analytics dashboards
 */
export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className={`${height} w-full rounded-lg`} />
      </CardContent>
    </Card>
  );
}

/**
 * Grid of Provider Card Skeletons
 */
export function ProviderCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <ProviderCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Grid of Service Card Skeletons
 */
export function ServiceCardSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(count)].map((_, i) => (
        <ServiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Dashboard Stats Grid Skeleton
 */
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Full Page Loading Skeleton
 * Used as initial page loading state
 */
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-8 w-full mb-4" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full mb-2" />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            <StatsGridSkeleton />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
