"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import modular settings components
import FeedSettings from "@/components/settings/feed-settings"
import DisplaySettings from "@/components/settings/display-settings"
import ClockSettings from "@/components/settings/clock-settings"
import BackgroundSettings from "@/components/settings/background-settings"
import AppearanceSettings from "@/components/settings/appearance-settings"
import AboutSection from "@/components/settings/about-section"
import ResetSettings from "@/components/settings/reset-settings"
import MusicSettings from "@/components/settings/music-settings"

export default function SettingsPanel() {
  // State hooks
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isPulsing, setIsPulsing] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Refs
  const panelRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPulsing(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handlers
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    // Call the refresh function from the feed context
    // This is now passed to the FeedSettings component
    setTimeout(() => setIsRefreshing(false), 1000)
  }, [])

  // Early return for non-mounted state
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 z-20 rounded-full bg-background/50 backdrop-blur-sm"
      >
        <Settings size={20} />
      </Button>
    )
  }

  // Main render
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={`absolute bottom-4 right-4 z-20 rounded-full bg-background/50 backdrop-blur-sm ${
          isPulsing ? "animate-pulse ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
        }`}
      >
        <Settings size={20} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] max-w-full overflow-y-auto border-l border-border bg-background dark:bg-[#1A1A1A]"
          >
            <div className="flex items-center justify-between p-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <div className="px-6 pb-6 space-y-8">
              {/* Feed Settings */}
              <FeedSettings isRefreshing={isRefreshing} handleRefresh={handleRefresh} />

              {/* Display Settings */}
              <DisplaySettings />

              {/* Clock Settings */}
              <ClockSettings />

              {/* Background Settings */}
              <BackgroundSettings />

              {/* Music Settings */}
              <MusicSettings />

              {/* Appearance Settings */}
              <AppearanceSettings />

              {/* Reset Settings */}
              <ResetSettings />

              {/* About Section */}
              <AboutSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

