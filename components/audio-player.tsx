"use client"

import { useEffect, useRef } from "react"
import { useFeed } from "@/context/feed-context"

export default function AudioPlayer() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const { backgroundMusic, isMusicPlaying, musicVolume } = useFeed()

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  // Handle source changes
  useEffect(() => {
    if (!backgroundMusic || !audioContextRef.current) return

    const loadAndPlayAudio = async () => {
      try {
        console.log("Loading audio from:", backgroundMusic)
        
        // Use the proxy API route
        const proxyUrl = `/api/audio?url=${encodeURIComponent(backgroundMusic)}`
        const response = await fetch(proxyUrl)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
        
        // Stop any existing playback
        if (sourceRef.current) {
          sourceRef.current.stop()
        }

        // Create new source
        sourceRef.current = audioContextRef.current.createBufferSource()
        sourceRef.current.buffer = audioBuffer
        sourceRef.current.loop = true
        
        // Connect to gain node
        sourceRef.current.connect(gainNodeRef.current!)
        
        // Start playback if music should be playing
        if (isMusicPlaying) {
          sourceRef.current.start(0)
        }
      } catch (error) {
        console.error("Error loading audio:", error)
      }
    }

    loadAndPlayAudio()
  }, [backgroundMusic])

  // Handle play/pause state
  useEffect(() => {
    if (!sourceRef.current || !audioContextRef.current) return

    if (isMusicPlaying) {
      // Resume audio context if it was suspended
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }
      
      // If we have a buffer, start playback
      if (sourceRef.current.buffer) {
        sourceRef.current.start(0)
      }
    } else {
      // Stop current playback
      sourceRef.current.stop()
      
      // Create new source for next play
      sourceRef.current = audioContextRef.current.createBufferSource()
      sourceRef.current.buffer = sourceRef.current.buffer
      sourceRef.current.loop = true
      sourceRef.current.connect(gainNodeRef.current!)
    }
  }, [isMusicPlaying])

  return null
} 