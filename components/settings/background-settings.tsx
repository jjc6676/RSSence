"use client"

import { useState } from "react"
import { ImageIcon, Sparkles } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFeed, type ParticleEffect } from "@/context/feed-context"

export default function BackgroundSettings() {
  const [backgroundUrlError, setBackgroundUrlError] = useState<string | null>(null)

  const {
    customBackground,
    setCustomBackground,
    showCustomBackground,
    setShowCustomBackground,
    particleEffect,
    setParticleEffect,
  } = useFeed()

  const validateImageUrl = (url: string) => {
    if (!url.trim()) {
      return { valid: false, message: "URL cannot be empty" }
    }

    try {
      new URL(url)
      return { valid: true }
    } catch (error) {
      return { valid: false, message: "Invalid URL format" }
    }
  }

  const handleSetBackground = (url: string) => {
    const validation = validateImageUrl(url)
    if (validation.valid) {
      setCustomBackground(url)
      setBackgroundUrlError(null)
    } else {
      setBackgroundUrlError(validation.message || "Invalid URL")
    }
  }

  const particleEffects = [
    { value: "none", label: "None" },
    { value: "bubbles", label: "Bubbles" },
    { value: "confetti", label: "Confetti" },
    { value: "stars", label: "Stars" },
    { value: "springLeaves", label: "Spring Leaves" },
    { value: "autumnLeaves", label: "Autumn Leaves" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Background Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} />
            <Label htmlFor="show-custom-background">Custom Background</Label>
          </div>
          <Switch
            id="show-custom-background"
            checked={showCustomBackground}
            onCheckedChange={setShowCustomBackground}
            disabled={particleEffect === "stars"}
          />
        </div>

        {showCustomBackground && (
          <div className="space-y-2">
            <Label htmlFor="custom-background-url">Background Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="custom-background-url"
                placeholder="Enter image URL"
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
                className={backgroundUrlError ? "border-destructive" : ""}
              />
              <Button onClick={() => handleSetBackground(customBackground)} variant="default">
                Apply
              </Button>
            </div>
            {backgroundUrlError && <p className="text-sm text-destructive">{backgroundUrlError}</p>}
            <p className="text-xs text-muted-foreground">
              Enter a URL to an image that will be used as the background for the application.
            </p>
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Label htmlFor="particle-effect" className="flex items-center gap-2">
            <Sparkles size={18} />
            Particle Effects
          </Label>
          <Select value={particleEffect} onValueChange={(value) => setParticleEffect(value as ParticleEffect)}>
            <SelectTrigger id="particle-effect">
              <SelectValue placeholder="Select particle effect" />
            </SelectTrigger>
            <SelectContent>
              {particleEffects.map((effect) => (
                <SelectItem key={effect.value} value={effect.value}>
                  {effect.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select a particle effect to display in the background. Some effects may impact performance.
          </p>
        </div>
      </div>
    </div>
  )
}

