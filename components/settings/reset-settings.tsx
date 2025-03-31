"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFeed } from "@/context/feed-context"
import { useTheme } from "next-themes"

export default function ResetSettings() {
  const [resetConfirmation, setResetConfirmation] = useState(false)

  const {
    setFeeds,
    setTransitionSpeed,
    setShowImages,
    setSortOrder,
    setCustomBackground,
    setShowCustomBackground,
    setParticleEffect,
    setVibeMode,
    setShowClock,
    setTimezone,
    setContentSize,
    setClockSize,
  } = useFeed()

  const { setTheme } = useTheme()

  const resetToDefaults = () => {
    // Default values with NPR, BBC, and NYT
    const defaultFeeds = [
      "https://feeds.bbci.co.uk/news/world/rss.xml", // BBC
      "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", // NYT
      "https://feeds.npr.org/1001/rss.xml", // NPR
      "https://www.nasa.gov/feed/",
    ]
    const defaultBackground =
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=4096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    // Clear all localStorage items
    localStorage.removeItem("rss-visualizer-feeds")
    localStorage.removeItem("rss-visualizer-transition-speed")
    localStorage.removeItem("rss-visualizer-show-images")
    localStorage.removeItem("rss-visualizer-sort-order")
    localStorage.removeItem("rss-visualizer-custom-background")
    localStorage.removeItem("rss-visualizer-show-custom-background")
    localStorage.removeItem("rss-visualizer-particle-effect")
    localStorage.removeItem("rss-visualizer-vibe-mode")
    localStorage.removeItem("rss-visualizer-show-clock")
    localStorage.removeItem("rss-visualizer-timezone")
    localStorage.removeItem("rss-visualizer-content-size")
    localStorage.removeItem("rss-visualizer-clock-size")

    // Reset all state values to defaults
    setTransitionSpeed(5)
    setShowImages(true)
    setSortOrder("latest")
    setCustomBackground(defaultBackground)
    setShowCustomBackground(true)
    setParticleEffect("bubbles")
    setVibeMode("off")
    setShowClock(true)
    setTimezone("local")
    setContentSize(100)
    setClockSize(100)
    setFeeds(defaultFeeds)

    // Reset theme to system
    setTheme("system")

    // Show confirmation message
    setResetConfirmation(true)
    setTimeout(() => setResetConfirmation(false), 3000)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Reset Settings</h3>
      <Button variant="destructive" onClick={resetToDefaults} className="w-full">
        Reset All Settings to Default
      </Button>
      {resetConfirmation && (
        <Alert className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
          <AlertDescription>Settings have been reset to defaults</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        This will clear all saved settings and restore the default configuration.
      </p>
    </div>
  )
}

