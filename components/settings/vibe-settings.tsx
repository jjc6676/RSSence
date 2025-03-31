"use client"

import { Palette } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFeed, type VibeMode } from "@/context/feed-context"

export default function VibeSettings() {
  const { vibeMode, setVibeMode } = useFeed()

  const vibeModes = [
    { value: "off", label: "Off", description: "Standard card view" },
    { value: "light", label: "Light", description: "Minimalist view with light text" },
    { value: "dark", label: "Dark", description: "Minimalist view with dark text" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vibe Mode</h3>
      <div className="space-y-2">
        <Label htmlFor="vibe-mode" className="flex items-center gap-2">
          <Palette size={18} />
          Vibe Mode
        </Label>
        <Select value={vibeMode} onValueChange={(value) => setVibeMode(value as VibeMode)}>
          <SelectTrigger id="vibe-mode">
            <SelectValue placeholder="Select vibe mode" />
          </SelectTrigger>
          <SelectContent>
            {vibeModes.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                <div className="flex flex-col">
                  <span>{mode.label}</span>
                  <span className="text-xs text-muted-foreground">{mode.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Vibe mode provides a minimalist view with elegant typography and smooth animations.
        </p>
      </div>
    </div>
  )
}

