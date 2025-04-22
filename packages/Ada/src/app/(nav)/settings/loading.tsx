import { Header } from '@/components/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <main className="p-6 space-y-6 star-bg">
      <div className="h-10 w-48 bg-purple-800/30 rounded-md animate-pulse" />
      <div className="h-5 w-96 bg-purple-800/20 rounded-md animate-pulse" />

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-purple-800/30">
          <CardHeader>
            <div className="h-6 w-24 bg-purple-800/30 rounded-md animate-pulse" />
            <div className="h-4 w-48 bg-purple-800/20 rounded-md animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-purple-800/40 animate-pulse" />
              <div className="h-9 w-32 bg-purple-800/30 rounded-md animate-pulse" />
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 bg-purple-800/30 rounded-md animate-pulse" />
                  <div className="h-10 w-full bg-purple-800/20 rounded-md animate-pulse" />
                </div>
              ))}
              <div className="h-10 w-full bg-purple-600/30 rounded-md animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="bg-card/50 backdrop-blur-sm border-purple-800/30"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-purple-800/40 animate-pulse" />
                  <div>
                    <div className="h-5 w-32 bg-purple-800/30 rounded-md animate-pulse" />
                    <div className="h-4 w-48 bg-purple-800/20 rounded-md animate-pulse mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-12 w-full bg-purple-800/20 rounded-md animate-pulse"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
