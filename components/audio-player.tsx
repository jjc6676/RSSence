"use client"

import { useEffect, useRef } from "react"
import { useFeed } from "@/context/feed-context"

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { backgroundMusic, isMusicPlaying, musicVolume } = useFeed()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume / 100
    }
  }, [musicVolume])

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isMusicPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true
    }
  }, [])

  if (!backgroundMusic) return null

  return (
    <audio
      ref={audioRef}
      src={backgroundMusic}
      preload="auto"
      className="hidden"
    />
  )
} 