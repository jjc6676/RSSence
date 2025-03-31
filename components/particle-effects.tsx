"use client"

import { useEffect, useRef } from "react"
import type { ParticleEffect } from "@/context/feed-context"

interface ParticleEffectsProps {
  effect: ParticleEffect
}

export default function ParticleEffects({ effect }: ParticleEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (effect === "none") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles based on effect type
    let particles: any[] = []
    const particleCount =
      effect === "confetti"
        ? 100
        : effect === "stars"
          ? 150
          : effect === "springLeaves" || effect === "autumnLeaves"
            ? 40
            : 50

    const createParticles = () => {
      // Pre-allocate the array with the correct size for better performance
      particles = new Array(particleCount)

      for (let i = 0; i < particleCount; i++) {
        let particle

        switch (effect) {
          case "bubbles":
            particle = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 5 + 1,
              speed: Math.random() * 0.5 + 0.1,
              opacity: Math.random() * 0.5 + 0.3,
              color: `hsla(${Math.random() * 360}, 70%, 70%, ${Math.random() * 0.3 + 0.2})`,
            }
            break
          case "confetti":
            particle = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 5 + 2,
              speed: Math.random() * 1 + 0.5,
              angle: Math.random() * 360,
              rotation: Math.random() * 360,
              color: `hsl(${Math.random() * 360}, 70%, 70%)`,
            }
            break
          case "stars":
            particle = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 2 + 0.5,
              opacity: Math.random(),
              speed: Math.random() * 0.05,
              twinkleSpeed: Math.random() * 0.01 + 0.005,
              twinkleDirection: Math.random() > 0.5 ? 1 : -1,
            }
            break
          case "springLeaves":
            // Spring leaves - fresh greens
            const springColors = [
              "rgba(120, 190, 32, 0.7)", // Light green
              "rgba(85, 166, 48, 0.7)", // Medium green
              "rgba(141, 198, 63, 0.7)", // Yellow-green
              "rgba(95, 178, 88, 0.7)", // Grass green
              "rgba(173, 223, 173, 0.7)", // Pale green
            ]
            particle = {
              x: Math.random() * canvas.width,
              y: -20 - Math.random() * 100, // Start above the screen
              size: Math.random() * 8 + 5,
              speed: Math.random() * 1 + 0.5,
              rotationSpeed: (Math.random() - 0.5) * 2,
              rotation: Math.random() * 360,
              swayFactor: Math.random() * 2 + 1,
              swayOffset: Math.random() * 1000,
              color: springColors[Math.floor(Math.random() * springColors.length)],
              shape: Math.floor(Math.random() * 3), // Different leaf shapes
            }
            break
          case "autumnLeaves":
            // Autumn leaves - warm oranges, reds, browns
            const autumnColors = [
              "rgba(184, 90, 13, 0.7)", // Brown
              "rgba(205, 133, 63, 0.7)", // Peru
              "rgba(210, 105, 30, 0.7)", // Chocolate
              "rgba(178, 34, 34, 0.7)", // Firebrick
              "rgba(255, 140, 0, 0.7)", // Dark Orange
              "rgba(255, 69, 0, 0.7)", // Orange Red
              "rgba(139, 69, 19, 0.7)", // Saddle Brown
            ]
            particle = {
              x: Math.random() * canvas.width,
              y: -20 - Math.random() * 100, // Start above the screen
              size: Math.random() * 10 + 8, // Slightly larger than spring leaves
              speed: Math.random() * 0.8 + 0.3, // Slightly slower
              rotationSpeed: (Math.random() - 0.5) * 3,
              rotation: Math.random() * 360,
              swayFactor: Math.random() * 3 + 2, // More pronounced swaying
              swayOffset: Math.random() * 1000,
              color: autumnColors[Math.floor(Math.random() * autumnColors.length)],
              shape: Math.floor(Math.random() * 3), // Different leaf shapes
            }
            break
        }

        particles[i] = particle
      }
    }

    createParticles()

    // Draw leaf shape
    const drawLeaf = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      shape: number,
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.fillStyle = color

      // Different leaf shapes
      switch (shape) {
        case 0: // Oval leaf
          ctx.beginPath()
          ctx.ellipse(0, 0, size / 2, size, 0, 0, Math.PI * 2)
          ctx.fill()

          // Stem
          ctx.beginPath()
          ctx.moveTo(0, size)
          ctx.lineTo(0, size + size / 3)
          ctx.lineWidth = size / 10
          ctx.strokeStyle = color
          ctx.stroke()

          // Vein
          ctx.beginPath()
          ctx.moveTo(0, -size)
          ctx.lineTo(0, size)
          ctx.lineWidth = size / 15
          ctx.strokeStyle = color
          ctx.globalAlpha = 0.5
          ctx.stroke()
          break

        case 1: // Maple-like leaf
          const points = 5
          const outerRadius = size
          const innerRadius = size / 2

          ctx.beginPath()
          for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (i * Math.PI) / points
            if (i === 0) {
              ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
            } else {
              ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius)
            }
          }
          ctx.closePath()
          ctx.fill()
          break

        case 2: // Simple round leaf
          ctx.beginPath()
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
          ctx.fill()

          // Stem
          ctx.beginPath()
          ctx.moveTo(0, size / 2)
          ctx.lineTo(0, size)
          ctx.lineWidth = size / 10
          ctx.strokeStyle = color
          ctx.stroke()
          break
      }

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        switch (effect) {
          case "bubbles":
            // Draw bubble
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()

            // Move bubble upward
            particle.y -= particle.speed

            // Reset if out of bounds
            if (particle.y < -particle.radius) {
              particle.y = canvas.height + particle.radius
              particle.x = Math.random() * canvas.width
            }
            break

          case "confetti":
            // Draw confetti
            ctx.save()
            ctx.translate(particle.x, particle.y)
            ctx.rotate((particle.rotation * Math.PI) / 180)
            ctx.fillStyle = particle.color
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
            ctx.restore()

            // Move confetti downward with some angle
            particle.y += Math.cos((particle.angle * Math.PI) / 180) * particle.speed
            particle.x += Math.sin((particle.angle * Math.PI) / 180) * particle.speed
            particle.rotation += 1

            // Reset if out of bounds
            if (particle.y > canvas.height + particle.size) {
              particle.y = -particle.size
              particle.x = Math.random() * canvas.width
            }
            break

          case "stars":
            // Update star twinkle
            particle.opacity += particle.twinkleSpeed * particle.twinkleDirection
            if (particle.opacity > 1 || particle.opacity < 0.1) {
              particle.twinkleDirection *= -1
            }

            // Draw star
            ctx.beginPath()
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
            ctx.fill()

            // Slight movement
            particle.x += (Math.random() - 0.5) * particle.speed
            particle.y += (Math.random() - 0.5) * particle.speed

            // Keep within bounds
            if (particle.x < 0) particle.x = canvas.width
            if (particle.x > canvas.width) particle.x = 0
            if (particle.y < 0) particle.y = canvas.height
            if (particle.y > canvas.height) particle.y = 0
            break

          case "springLeaves":
          case "autumnLeaves":
            // Calculate sway (horizontal movement)
            const sway = Math.sin((Date.now() + particle.swayOffset) * 0.001) * particle.swayFactor

            // Draw leaf
            drawLeaf(
              ctx,
              particle.x + sway,
              particle.y,
              particle.size,
              particle.rotation,
              particle.color,
              particle.shape,
            )

            // Update position
            particle.y += particle.speed
            particle.rotation += particle.rotationSpeed

            // Reset if out of bounds
            if (particle.y > canvas.height + particle.size) {
              particle.y = -particle.size
              particle.x = Math.random() * canvas.width
              particle.rotation = Math.random() * 360
            }
            break
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [effect])

  if (effect === "none") return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
}

