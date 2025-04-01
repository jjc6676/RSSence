"use client"

import { useCallback } from "react"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import type { FeedItem } from "@/types/feed"
import { useTheme } from "next-themes"

// Define sort order options
export type SortOrder = "latest" | "oldest" | "shuffle"

// Define particle effect options
export type ParticleEffect = "none" | "bubbles" | "confetti" | "stars" | "springLeaves" | "autumnLeaves"

// Define vibe mode options
export type VibeMode = "off" | "light" | "dark"

interface FeedContextType {
  feeds: string[]
  feedItems: FeedItem[]
  loading: boolean
  error: string | null
  addFeed: (url: string) => void
  removeFeed: (url: string) => void
  transitionSpeed: number
  setTransitionSpeed: (speed: number) => void
  showImages: boolean
  setShowImages: (show: boolean) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  validateFeedUrl: (url: string) => { valid: boolean; message?: string }
  customBackground: string
  setCustomBackground: (url: string) => void
  showCustomBackground: boolean
  setShowCustomBackground: (show: boolean) => void
  particleEffect: ParticleEffect
  setParticleEffect: (effect: ParticleEffect) => void
  vibeMode: VibeMode
  setVibeMode: (mode: VibeMode) => void
  showClock: boolean
  setShowClock: (show: boolean) => void
  timezone: string
  setTimezone: (tz: string) => void
  contentSize: number
  setContentSize: (size: number) => void
  clockSize: number
  setClockSize: (size: number) => void
  hideExtraUI: boolean
  setHideExtraUI: (hide: boolean) => void
  setFeeds: (feeds: string[]) => void
  refreshFeeds: () => void
}

const FeedContext = createContext<FeedContextType | undefined>(undefined)

// Default background image from Unsplash
const DEFAULT_BACKGROUND =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=4096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

// Helper function to safely get items from localStorage
const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    if (!item) return defaultValue
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

// Helper function to safely set items in localStorage
const setInLocalStorage = (key: string, value: any): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export function FeedProvider({ children }: { children: ReactNode }) {
  // Updated default feeds with NPR, BBC, and NYT first
  const defaultFeeds = [
    "https://feeds.bbci.co.uk/news/world/rss.xml", // BBC
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", // NYT
    "https://feeds.npr.org/1001/rss.xml", // NPR
    "https://www.nasa.gov/feed/", // NASA News
  ]

  const [feeds, setFeeds] = useState<string[]>([])
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)
  const [transitionSpeed, setTransitionSpeed] = useState(5) // Default to 5 seconds
  const [showImages, setShowImages] = useState(true) // State for showing/hiding images
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest") // Default sort order
  const [rawFeedItems, setRawFeedItems] = useState<FeedItem[]>([]) // Store unsorted items
  const [customBackground, setCustomBackground] = useState(DEFAULT_BACKGROUND) // State for custom background URL with default
  const [showCustomBackground, setShowCustomBackground] = useState(true) // State for showing/hiding custom background
  const [particleEffect, setParticleEffect] = useState<ParticleEffect>("bubbles") // State for particle effect
  const [vibeMode, setVibeMode] = useState<VibeMode>("off") // State for vibe mode
  const [showClock, setShowClock] = useState(true) // State for showing/hiding clock - now true by default
  const [timezone, setTimezone] = useState("local") // State for timezone, default to local
  const [contentSize, setContentSize] = useState(100) // State for content size, default to 100%
  const [clockSize, setClockSize] = useState(100) // State for clock size, default to 100%
  const [hideExtraUI, setHideExtraUI] = useState(false) // State for hiding extra UI elements, default to false (off)
  const { theme, setTheme } = useTheme()
  const [lastFetchTime, setLastFetchTime] = useState(0) // Track last fetch time to prevent too frequent refreshes

  // Load saved feeds and preferences from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    // Load all settings from localStorage
    setFeeds(getFromLocalStorage<string[]>("rss-visualizer-feeds", defaultFeeds))
    setTransitionSpeed(getFromLocalStorage<number>("rss-visualizer-transition-speed", 5))
    setShowImages(getFromLocalStorage<boolean>("rss-visualizer-show-images", true))
    setSortOrder(getFromLocalStorage<SortOrder>("rss-visualizer-sort-order", "latest"))
    setCustomBackground(getFromLocalStorage<string>("rss-visualizer-custom-background", DEFAULT_BACKGROUND))
    setShowCustomBackground(getFromLocalStorage<boolean>("rss-visualizer-show-custom-background", true))
    setParticleEffect(getFromLocalStorage<ParticleEffect>("rss-visualizer-particle-effect", "bubbles"))
    setVibeMode(getFromLocalStorage<VibeMode>("rss-visualizer-vibe-mode", "off"))
    setShowClock(getFromLocalStorage<boolean>("rss-visualizer-show-clock", true))
    setTimezone(getFromLocalStorage<string>("rss-visualizer-timezone", "local"))
    setContentSize(getFromLocalStorage<number>("rss-visualizer-content-size", 100))
    setClockSize(getFromLocalStorage<number>("rss-visualizer-clock-size", 100))
    setHideExtraUI(getFromLocalStorage<boolean>("rss-visualizer-hide-extra-ui", false)) // Default to false (off)
  }, [])

  // Save feeds to localStorage when they change
  useEffect(() => {
    setInLocalStorage("rss-visualizer-feeds", feeds)
  }, [feeds])

  // Save transition speed to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-transition-speed", transitionSpeed)
  }, [transitionSpeed])

  // Save image display preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-show-images", showImages)
  }, [showImages])

  // Save sort order preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-sort-order", sortOrder)
  }, [sortOrder])

  // Save custom background URL to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-custom-background", customBackground)
  }, [customBackground])

  // Save custom background enabled state to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-show-custom-background", showCustomBackground)
  }, [showCustomBackground])

  // Save particle effect preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-particle-effect", particleEffect)
  }, [particleEffect])

  // Save vibe mode preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-vibe-mode", vibeMode)
  }, [vibeMode])

  // Save clock preferences to localStorage when they change
  useEffect(() => {
    setInLocalStorage("rss-visualizer-show-clock", showClock)
  }, [showClock])

  useEffect(() => {
    setInLocalStorage("rss-visualizer-timezone", timezone)
  }, [timezone])

  // Save content size preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-content-size", contentSize)
  }, [contentSize])

  // Save clock size preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-clock-size", clockSize)
  }, [clockSize])

  // Save hide extra UI preference to localStorage when it changes
  useEffect(() => {
    setInLocalStorage("rss-visualizer-hide-extra-ui", hideExtraUI)
  }, [hideExtraUI])

  // Apply sorting to feed items when sort order or raw items change
  useEffect(() => {
    if (rawFeedItems.length === 0) return

    const sortedItems = [...rawFeedItems]

    switch (sortOrder) {
      case "latest":
        sortedItems.sort((a, b) => {
          if (!a.pubDate) return 1
          if (!b.pubDate) return -1
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        })
        break
      case "oldest":
        sortedItems.sort((a, b) => {
          if (!a.pubDate) return 1
          if (!b.pubDate) return -1
          return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
        })
        break
      case "shuffle":
        // Fisher-Yates shuffle algorithm
        for (let i = sortedItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[sortedItems[i], sortedItems[j]] = [sortedItems[j], sortedItems[i]]
        }
        break
    }

    setFeedItems(sortedItems)
  }, [sortOrder, rawFeedItems])

  // Function to fetch feeds
  const fetchFeeds = async () => {
    if (feeds.length === 0) {
      setRawFeedItems([])
      setFeedItems([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feeds }),
        cache: "no-store",
      })

      if (!response.ok) {
        let errorMessage = "Failed to fetch feeds"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If we can't parse the error JSON, use the status text
          errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setRawFeedItems(data) // Store the raw items
      setLastFetchTime(Date.now())
      // Sorting will be applied by the useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Feed fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch feed items when feeds change
  useEffect(() => {
    fetchFeeds()
  }, [feeds])

  // Function to manually refresh feeds
  const refreshFeeds = () => {
    // Prevent refreshing too frequently (at least 10 seconds between refreshes)
    const now = Date.now()
    if (now - lastFetchTime < 10000) {
      return
    }

    fetchFeeds()
  }

  // Validate feed URL
  const validateFeedUrl = (url: string) => {
    // Check if URL is empty
    if (!url.trim()) {
      return { valid: false, message: "URL cannot be empty" }
    }

    // Check if URL has valid format
    try {
      const parsedUrl = new URL(url)

      // Check if protocol is http or https
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return { valid: false, message: "URL must use http or https protocol" }
      }

      return { valid: true }
    } catch (error) {
      return { valid: false, message: "Invalid URL format" }
    }
  }

  // Add a useEffect to enforce dark mode when stars effect is selected
  useEffect(() => {
    if (particleEffect === "stars") {
      setTheme("dark")
      // Only disable custom background for stars effect if not in vibe mode
      if (showCustomBackground && vibeMode === "off") {
        setShowCustomBackground(false)
      }
    }
  }, [particleEffect, theme, setTheme, showCustomBackground, setShowCustomBackground, vibeMode])

  // Add a useEffect to sync vibe mode with theme changes
  useEffect(() => {
    // When vibe mode is active, sync it with theme changes
    if (vibeMode !== "off") {
      if (theme === "dark") {
        setVibeMode("dark")
      } else if (theme === "light") {
        setVibeMode("light")
      }
      // We don't handle system theme here as we can't detect the system preference
    }
  }, [theme, vibeMode, setVibeMode])

  const validateFeedUrlMemoized = useCallback(validateFeedUrl, [])

  const addFeed = useCallback(
    (url: string) => {
      const validation = validateFeedUrlMemoized(url)
      if (!validation.valid) {
        setError(validation.message || "Invalid URL")
        return
      }

      if (!feeds.includes(url)) {
        setFeeds([...feeds, url])
        setError(null) // Clear any previous errors
      }
    },
    [feeds, validateFeedUrlMemoized],
  )

  const removeFeed = useCallback(
    (url: string) => {
      setFeeds(feeds.filter((feed) => feed !== url))
    },
    [feeds],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      feeds,
      feedItems,
      loading,
      error,
      addFeed,
      removeFeed,
      transitionSpeed,
      setTransitionSpeed,
      showImages,
      setShowImages,
      sortOrder,
      setSortOrder,
      validateFeedUrl,
      customBackground,
      setCustomBackground,
      showCustomBackground,
      setShowCustomBackground,
      particleEffect,
      setParticleEffect,
      vibeMode,
      setVibeMode,
      showClock,
      setShowClock,
      timezone,
      setTimezone,
      contentSize,
      setContentSize,
      clockSize,
      setClockSize,
      hideExtraUI,
      setHideExtraUI,
      setFeeds,
      refreshFeeds,
    }),
    [
      feeds,
      feedItems,
      loading,
      error,
      transitionSpeed,
      showImages,
      sortOrder,
      customBackground,
      showCustomBackground,
      particleEffect,
      vibeMode,
      showClock,
      timezone,
      contentSize,
      clockSize,
      hideExtraUI,
      addFeed,
      removeFeed,
    ],
  )

  return <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
}

export function useFeed() {
  const context = useContext(FeedContext)
  if (context === undefined) {
    throw new Error("useFeed must be used within a FeedProvider")
  }
  return context
}

