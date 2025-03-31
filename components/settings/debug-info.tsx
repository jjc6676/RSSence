"use client"

import { useState } from "react"
import { Bug, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useFeed } from "@/context/feed-context"
import { useTheme } from "next-themes"

interface DebugInfoProps {
  isRefreshing: boolean
  handleRefresh: () => void
}

export default function DebugInfo({ isRefreshing, handleRefresh }: DebugInfoProps) {
  const [isDebugOpen, setIsDebugOpen] = useState(false)
  const { feeds, feedItems } = useFeed()
  const { theme } = useTheme()

  return (
    <Collapsible open={isDebugOpen} onOpenChange={setIsDebugOpen} className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Bug size={18} />
          Debug Information
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isDebugOpen ? "Hide" : "Show"}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4">
        <div className="rounded-md bg-muted p-4 text-xs font-mono">
          <div>Environment: {typeof window !== "undefined" ? "Client" : "Server"}</div>
          <div>Feed Count: {feeds.length}</div>
          <div>Feed Items: {feedItems.length}</div>
          <div>Theme: {theme}</div>
          <div>User Agent: {typeof navigator !== "undefined" ? navigator.userAgent : "Unknown"}</div>
          <div>
            Viewport: {typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown"}
          </div>
          <div>localStorage Available: {typeof localStorage !== "undefined" ? "Yes" : "No"}</div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw size={14} className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Force Refresh Feeds
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

