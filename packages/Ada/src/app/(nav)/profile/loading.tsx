import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <main className="p-6 space-y-6 star-bg">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="h-8 w-40 bg-purple-800/30 rounded-md animate-pulse" />
          <div className="h-5 w-64 bg-purple-800/20 rounded-md animate-pulse mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-purple-800/30 rounded-md animate-pulse" />
          <div className="h-9 w-20 bg-purple-800/30 rounded-md animate-pulse" />
          <div className="h-9 w-24 bg-purple-600/30 rounded-md animate-pulse" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card Skeleton */}
        <Card className="md:col-span-1 bg-card/50 backdrop-blur-sm border-purple-800/30">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-purple-800/40 animate-pulse mb-4" />
              <div className="h-6 w-32 bg-purple-800/30 rounded-md animate-pulse" />
              <div className="h-4 w-48 bg-purple-800/20 rounded-md animate-pulse mt-2" />
              <div className="h-4 w-32 bg-purple-800/20 rounded-md animate-pulse mt-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="pt-4 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-purple-800/40 animate-pulse" />
                  <div className="h-4 w-full bg-purple-800/20 rounded-md animate-pulse" />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <div className="h-4 w-16 bg-purple-800/30 rounded-md animate-pulse mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-purple-800/20 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-purple-800/20 rounded-md animate-pulse" />
                <div className="h-4 w-3/4 bg-purple-800/20 rounded-md animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Skeleton */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="bg-card/50 backdrop-blur-sm border-purple-800/30"
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-9 w-9 rounded-full bg-purple-800/40 animate-pulse mb-2" />
                  <div className="h-6 w-12 bg-purple-800/30 rounded-md animate-pulse" />
                  <div className="h-4 w-16 bg-purple-800/20 rounded-md animate-pulse mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skills Skeleton */}
          <Card className="bg-card/50 backdrop-blur-sm border-purple-800/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-purple-800/30 rounded-md animate-pulse" />
                <div className="h-8 w-8 rounded-md bg-purple-800/20 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-purple-800/20 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Skeleton */}
          <Card className="bg-card/50 backdrop-blur-sm border-purple-800/30">
            <CardHeader>
              <div className="h-6 w-32 bg-purple-800/30 rounded-md animate-pulse" />
              <div className="h-4 w-48 bg-purple-800/20 rounded-md animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-4 border-b border-purple-800/20 last:border-0 last:pb-0"
                >
                  <div className="h-5 w-5 rounded-md bg-purple-800/40 animate-pulse mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <div className="h-4 w-full bg-purple-800/20 rounded-md animate-pulse" />
                    <div className="h-3 w-20 bg-purple-800/20 rounded-md animate-pulse" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
