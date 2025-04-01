import { Suspense } from "react"
import FeedVisualizer from "@/components/feed-visualizer"
import SettingsPanel from "@/components/settings-panel"
import AnalyticsTest from "@/components/analytics-test"
import { FeedProvider } from "@/context/feed-context"

export default function Home() {
  return (
    <FeedProvider>
      <main className="relative min-h-screen bg-background">
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
              <div className="text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <div className="text-2xl font-medium">Loading application...</div>
              </div>
            </div>
          }
        >
          <FeedVisualizer />
          <SettingsPanel />
        </Suspense>
      </main>
    </FeedProvider>
  )
}

