"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { ClockIcon } from "lucide-react"

interface ClockProps {
  timezone: string
  size: number
  className?: string
}

export default function Clock({ timezone, size, className = "" }: ClockProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format the time based on the selected timezone
  const formattedTime = useCallback(() => {
    try {
      if (timezone === "local") {
        return format(time, "h:mm:ss a")
      } else {
        // Convert to the selected timezone using Intl.DateTimeFormat
        return new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: timezone,
        }).format(time)
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      return format(time, "h:mm:ss a") // Fallback to local time
    }
  }, [time, timezone])

  // Calculate font size based on the size prop
  const fontSize = Math.max(0.75, (size / 100) * 0.875) // Base size is 0.875rem (text-sm)
  const iconSize = Math.max(12, (size / 100) * 16) // Base icon size is 16px

  return (
    <div
      className={`flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full ${className}`}
      style={{ transform: `scale(${size / 100})`, transformOrigin: "center center" }}
    >
      <ClockIcon size={iconSize} className="text-foreground/70" />
      <span 
        style={{ fontSize: `${fontSize}rem`, fontVariantNumeric: "tabular-nums" }} 
        className="font-medium"
      >
        {formattedTime()}
      </span>
    </div>
  )
}

