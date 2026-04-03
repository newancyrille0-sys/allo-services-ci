import { StatsGridSkeleton, ChartSkeleton, TableRowSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen bg-secondary text-secondary-foreground">
      <div className="flex">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 border-r border-secondary-foreground/10 min-h-screen p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full bg-secondary-foreground/10" />
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-secondary-foreground/10" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-8 w-48 bg-secondary-foreground/10 mb-2" />
              <Skeleton className="h-4 w-64 bg-secondary-foreground/10" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full bg-secondary-foreground/10" />
              <Skeleton className="h-10 w-10 rounded-full bg-secondary-foreground/10" />
            </div>
          </div>

          {/* Stats */}
          <StatsGridSkeleton count={6} />

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <Card className="bg-secondary-foreground/5 border-secondary-foreground/10">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-32 bg-secondary-foreground/10 mb-4" />
                <Skeleton className="h-48 w-full bg-secondary-foreground/10" />
              </CardContent>
            </Card>
            <Card className="bg-secondary-foreground/5 border-secondary-foreground/10">
              <CardContent className="p-6">
                <Skeleton className="h-5 w-32 bg-secondary-foreground/10 mb-4" />
                <Skeleton className="h-48 w-full bg-secondary-foreground/10" />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6 bg-secondary-foreground/5 border-secondary-foreground/10">
            <CardContent className="p-6">
              <Skeleton className="h-5 w-32 bg-secondary-foreground/10 mb-4" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-secondary-foreground/10">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead className="bg-secondary-foreground/10">
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    <TableHead className="bg-secondary-foreground/10">
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead className="bg-secondary-foreground/10">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} columns={4} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
