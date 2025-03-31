"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Maximize, Minimize, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeedCard from "@/components/feed-card"
import VibeModeCard from "@/components/vibe-mode-card"
import Clock from "@/components/clock"
import { useFeed } from "@/context/feed-context"
import { useFullscreen } from "@/hooks/use-fullscreen"
import ParticleEffects from "@/components/particle-effects"
import { useTheme } from "next-themes"

export default function FeedVisualizer() {
  const {
    feedItems,
    loading,
    error,
    customBackground,
    showCustomBackground,
    particleEffect,
    setShowCustomBackground,
    vibeMode,
    showClock,
    timezone,
    clockSize,
    refreshFeeds,
    transitionSpeed,
    contentSize,
  } = useFeed()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { setTheme } = useTheme()

  // Update useEffect to enforce dark mode and turn off custom background when stars effect is selected
  useEffect(() => {
    if (particleEffect === "stars") {
      setTheme("dark")
    }
  }, [particleEffect, setTheme])

  // Handle automatic transitions
  useEffect(() => {
    if (feedItems.length === 0 || isPaused) return

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % feedItems.length)
      }, transitionSpeed * 1000) // Convert seconds to milliseconds
    }

    startInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [feedItems.length, isPaused, transitionSpeed])

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  // Memoize navigation handlers to prevent unnecessary re-renders
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + feedItems.length) % feedItems.length)
  }, [feedItems.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feedItems.length)
  }, [feedItems.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      } else if (e.key === "f") {
        toggleFullscreen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrevious, goToNext, toggleFullscreen])

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    refreshFeeds()
    setTimeout(() => setIsRefreshing(false), 1000) // Show refresh animation for at least 1 second
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="text-2xl font-medium">Loading feeds...</div>
          <p className="mt-2 text-muted-foreground">This may take a moment for the first load</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <div className="text-2xl font-medium text-destructive mb-2">Error loading feeds</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm mb-4">Try adding different RSS feeds in the settings panel (bottom right)</p>
          <Button onClick={handleRefresh} variant="outline" className="mx-auto">
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (feedItems.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <div className="text-2xl font-medium mb-2">No feed items found</div>
          <p className="text-muted-foreground mb-4">
            Add some RSS feeds in the settings panel or check if your feeds contain valid items.
          </p>
          <p className="text-sm mb-4">
            Click the settings icon <span className="inline-block">⚙️</span> in the bottom right corner to add feeds.
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mx-auto">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  // Determine if we should show background image
  const showBgImage = showCustomBackground && customBackground

  // Calculate arrow size based on content size
  const arrowSize = Math.max(24, Math.round(24 * (contentSize / 100)))
  const arrowFontSize = `${Math.max(1.5, 1.5 * (contentSize / 100))}rem`

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        showBgImage
          ? {
              backgroundImage: `url(${customBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      {/* Particle effects */}
      <ParticleEffects effect={particleEffect} />

      {/* Clock positioned at top center */}
      {showClock && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Clock timezone={timezone} size={clockSize} />
        </div>
      )}

      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className="rounded-full bg-background/50 backdrop-blur-sm"
          disabled={isRefreshing}
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-full bg-background/50 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 },
          }}
          className="h-full w-full perspective-1000"
        >
          {feedItems[currentIndex] &&
            (vibeMode === "off" ? (
              <FeedCard item={feedItems[currentIndex]} />
            ) : (
              <VibeModeCard item={feedItems[currentIndex]} vibeMode={vibeMode} />
            ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows positioned at the bottom center */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-6 items-center justify-center"
        style={{ transform: `translateX(-50%) scale(${contentSize / 100})` }}
      >
        <Button
          variant="ghost"
          onClick={goToPrevious}
          className="p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70"
          aria-label="Previous item"
        >
          <KeyboardArrowButton direction="left" size={arrowSize} fontSize={arrowFontSize} />
        </Button>

        <Button
          variant="ghost"
          onClick={goToNext}
          className="p-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70"
          aria-label="Next item"
        >
          <KeyboardArrowButton direction="right" size={arrowSize} fontSize={arrowFontSize} />
        </Button>
      </div>
    </div>
  )
}

// Custom keyboard arrow button component
function KeyboardArrowButton({
  direction,
  size = 24,
  fontSize = "1.5rem",
}: {
  direction: "left" | "right"
  size?: number
  fontSize?: string
}) {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <span className="text-foreground" style={{ fontSize }}>
        {direction === "left" ? "←" : "→"}
      </span>
    </div>
  )
}

