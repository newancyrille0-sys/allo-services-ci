import { ProviderCardSkeletonGrid } from "@/components/skeletons";

export default function ProvidersLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Title skeleton */}
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>

        {/* Search and filters skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="h-10 w-full md:w-64 bg-muted rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Grid skeleton */}
        <ProviderCardSkeletonGrid count={9} />
      </div>
    </div>
  );
}
