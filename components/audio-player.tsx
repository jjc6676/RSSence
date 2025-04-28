"use client"

import { useEffect, useRef } from "react"
import { useFeed } from "@/context/feed-context"

export default function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const { backgroundMusic, isMusicPlaying, musicVolume } = useFeed()

  // Initialize audio context and gain node
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new AudioContext()
      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = musicVolume / 100
    }
  }, [musicVolume])

  // Load audio buffer when backgroundMusic changes
  useEffect(() => {
    if (!backgroundMusic || !audioContextRef.current) return

    const loadAudio = async () => {
      try {
        const proxyUrl = `/api/audio?url=${encodeURIComponent(backgroundMusic)}`
        const response = await fetch(proxyUrl)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)
        audioBufferRef.current = audioBuffer
        // If music should be playing, start playback
        if (isMusicPlaying) {
          playAudio()
        }
      } catch (error) {
        console.error("Error loading audio:", error)
      }
    }

    // Stop any existing playback
    stopAudio()
    loadAudio()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundMusic])

  // Play or stop audio when isMusicPlaying changes
  useEffect(() => {
    if (!audioBufferRef.current || !audioContextRef.current) return

    if (isMusicPlaying) {
      // Resume context if needed
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume()
      }
      playAudio()
    } else {
      stopAudio()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMusicPlaying])

  // Helper to play audio
  function playAudio() {
    if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current) return
    // Stop any existing source
    stopAudio()
    // Create new source
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBufferRef.current
    source.loop = true
    source.connect(gainNodeRef.current)
    source.start(0)
    sourceRef.current = source
  }

  // Helper to stop audio
  function stopAudio() {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
      } catch (e) {}
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
  }

  return null
}
