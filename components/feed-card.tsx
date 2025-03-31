"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, Globe } from "lucide-react"
import type { FeedItem } from "@/types/feed"
import { formatDistanceToNow } from "date-fns"
import { useFeed } from "@/context/feed-context"

interface FeedCardProps {
  item: FeedItem
}

// Safely format the date - moved outside component to prevent recreation on each render
const formatDate = (dateString?: string) => {
  if (!dateString) return ""

  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ""
    }
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return ""
  }
}

export default function FeedCard({ item }: FeedCardProps) {
  const { showImages, contentSize } = useFeed()
  const hasImage = showImages && !!item.image

  // Calculate scale based on content size
  const scale = contentSize / 100

  const formattedDate = formatDate(item.pubDate)

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      {/* Card with rounded edges - using theme colors */}
      <motion.div
        className="w-[500px] max-w-[90%] max-h-[90vh] bg-card text-card-foreground rounded-xl overflow-hidden shadow-xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: scale }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "center center" }}
      >
        <div className="flex flex-col h-full">
          {/* Image section - aspect ratio preserved */}
          {hasImage && (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              {" "}
              {/* 16:9 aspect ratio */}
              <Image
                src={item.image || "/placeholder.svg?height=300&width=400"}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content section - scrollable if needed */}
          <div className="flex flex-col p-6 overflow-auto">
            {/* Source name */}
            <div className="mb-3">
              <span className="text-sm font-medium text-muted-foreground">{item.source}</span>
            </div>

            <h2 className="mb-4 text-xl font-bold leading-tight">{item.title}</h2>

            {item.description && <p className="mb-4 text-sm text-card-foreground">{item.description}</p>}

            <div className="mt-auto pt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground border-t border-border">
              {formattedDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formattedDate}</span>
                </div>
              )}

              {item.link && (
                <div className="flex items-center gap-1">
                  <Globe size={14} />
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Read full article
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

