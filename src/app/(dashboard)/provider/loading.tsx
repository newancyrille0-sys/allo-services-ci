import { StatsGridSkeleton, ReservationCardSkeleton, ChartSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderDashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 border-r min-h-screen p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Stats */}
          <StatsGridSkeleton count={6} />

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <ChartSkeleton height="h-48" />
            <ChartSkeleton height="h-48" />
          </div>

          {/* Recent reservations */}
          <div className="mt-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <ReservationCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
