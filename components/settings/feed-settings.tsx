"use client"

import { useState } from "react"
import { Plus, Trash2, Info, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFeed } from "@/context/feed-context"

interface FeedSettingsProps {
  isRefreshing: boolean
  handleRefresh: () => void
}

export default function FeedSettings({ isRefreshing, handleRefresh }: FeedSettingsProps) {
  const [newFeedUrl, setNewFeedUrl] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)

  const { feeds, addFeed, removeFeed, validateFeedUrl, error: feedError } = useFeed()

  const handleAddFeed = () => {
    if (newFeedUrl.trim()) {
      const validation = validateFeedUrl(newFeedUrl.trim())
      if (validation.valid) {
        addFeed(newFeedUrl.trim())
        setNewFeedUrl("")
        setUrlError(null)
      } else {
        setUrlError(validation.message || "Invalid URL")
      }
    }
  }

  // Example feeds for quick addition
  const exampleFeeds = [
    { name: "NASA News", url: "https://www.nasa.gov/feed/" },
    { name: "BBC World News", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml" },
    { name: "New York Times World", url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml" },
    { name: "Hacker News", url: "https://news.ycombinator.com/rss" },
    { name: "Reddit r/worldnews", url: "https://www.reddit.com/r/worldnews/.rss" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">RSS Feeds</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          <span className="sr-only">Refresh Feeds</span>
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter RSS feed URL"
          value={newFeedUrl}
          onChange={(e) => setNewFeedUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddFeed()}
          className={urlError ? "border-destructive" : ""}
        />
        <Button onClick={handleAddFeed} variant="default">
          <Plus size={16} className="mr-2" />
          Add
        </Button>
      </div>

      {urlError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{urlError}</AlertDescription>
        </Alert>
      )}

      {feedError && !urlError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{feedError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        {feeds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No feeds added yet.</p>
        ) : (
          feeds.map((feed, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-2">
              <span className="line-clamp-1 flex-1">{feed}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFeed(feed)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium">Example Feeds</h4>
        <div className="grid grid-cols-2 gap-2">
          {exampleFeeds.map((feed, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => addFeed(feed.url)}
            >
              <Plus size={12} className="mr-1" />
              {feed.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Aligned and centered RSS directory links */}
      <div className="mt-2 flex justify-center gap-4">
        <a
          href="https://github.com/AboutRSS/ALL-about-RSS"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline inline-flex items-center"
        >
          <Info size={10} className="mr-1" />
          All about RSS
        </a>
        <a
          href="https://ooh.directory/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline inline-flex items-center"
        >
          <Info size={10} className="mr-1" />
          RSS Directory
        </a>
      </div>
    </div>
  )
}

