"use client"

import { motion } from "framer-motion"
import type { FeedItem } from "@/types/feed"
import { type VibeMode, useFeed } from "@/context/feed-context"

interface VibeModeCardProps {
  item: FeedItem
  vibeMode: VibeMode
}

export default function VibeModeCard({ item, vibeMode }: VibeModeCardProps) {
  const { contentSize } = useFeed()

  // Calculate font sizes based on content size
  const titleSize = Math.max(1.5, 3 * (contentSize / 100)) // Min 1.5rem, scales up to 3rem at 100%
  const textSize = Math.max(1, 1.25 * (contentSize / 100)) // Min 1rem, scales up to 1.25rem at 100%

  // Determine text color based on vibe mode
  const textColor = vibeMode === "light" ? "text-black" : "text-white"
  const textShadow = vibeMode === "light" ? "text-shadow-light" : "text-shadow-dark"

  // No background, just text shadow for readability

  // Clean up description if needed
  const cleanDescription = item.description ? item.description.replace(/&nbsp;/g, " ").replace(/<[^>]*>/g, "") : ""

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <motion.div
        className="w-full max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          transform: `scale(${contentSize / 100})`,
          transformOrigin: "center center",
        }}
      >
        <motion.h1
          className={`mb-8 font-bold leading-tight tracking-tight ${textColor} ${textShadow} px-6 py-4 rounded-lg inline-block`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: `${titleSize}rem` }}
        >
          <span>{item.title}</span>
        </motion.h1>

        {cleanDescription && (
          <motion.p
            className={`mx-auto max-w-3xl leading-relaxed ${textColor} ${textShadow} px-6 py-4 rounded-lg`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ fontSize: `${textSize}rem` }}
          >
            <span>{cleanDescription}</span>
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

