"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useFeed } from "@/context/feed-context"
import { useTheme } from "next-themes"

export default function AppearanceSettings() {
  const { transitionSpeed, setTransitionSpeed, vibeMode, setVibeMode } = useFeed()
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Appearance</h3>
      <div className="grid grid-cols-3 gap-2">
        <Card
          className={`cursor-pointer hover:bg-accent ${theme === "light" ? "ring-2 ring-primary" : ""}`}
          onClick={() => {
            setTheme("light")
            if (vibeMode !== "off") setVibeMode("light")
          }}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Sun className="h-5 w-5 mb-2" />
            <span className="text-sm font-medium">Light</span>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer hover:bg-accent ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
          onClick={() => {
            setTheme("dark")
            if (vibeMode !== "off") setVibeMode("dark")
          }}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Moon className="h-5 w-5 mb-2" />
            <span className="text-sm font-medium">Dark</span>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer hover:bg-accent ${theme === "system" ? "ring-2 ring-primary" : ""}`}
          onClick={() => {
            setTheme("system")
            // Don't force a specific vibe mode when using system theme
            // This will allow the system preference to control the appearance
          }}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Monitor className="h-5 w-5 mb-2" />
            <span className="text-sm font-medium">System</span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="transition-speed">Card Display Duration</Label>
          <span className="text-sm text-muted-foreground">{transitionSpeed}s</span>
        </div>
        <Slider
          id="transition-speed"
          min={3}
          max={15}
          step={1}
          value={[transitionSpeed]}
          onValueChange={(value) => setTransitionSpeed(value[0])}
        />
        <p className="text-xs text-muted-foreground">
          Control how long each card is displayed before transitioning to the next
        </p>
      </div>
    </div>
  )
}

