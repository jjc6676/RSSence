"use client"

import { Clock, Globe, ScalingIcon as Resize } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFeed } from "@/context/feed-context"

export default function ClockSettings() {
  const { showClock, setShowClock, timezone, setTimezone, clockSize, setClockSize } = useFeed()

  const timezones = [
    { value: "local", label: "Local Time" },
    { value: "America/New_York", label: "New York (EST/EDT)" },
    { value: "America/Chicago", label: "Chicago (CST/CDT)" },
    { value: "America/Denver", label: "Denver (MST/MDT)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Clock Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <Label htmlFor="show-clock">Show Clock</Label>
          </div>
          <Switch id="show-clock" checked={showClock} onCheckedChange={setShowClock} />
        </div>

        {showClock && (
          <>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2">
                <Globe size={18} />
                Timezone
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a timezone for the clock display. "Local Time" uses your device's timezone.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Resize size={18} />
                  <Label htmlFor="clock-size">Clock Size</Label>
                </div>
                <span className="text-sm text-muted-foreground">{clockSize}%</span>
              </div>
              <Slider
                id="clock-size"
                min={75}
                max={200}
                step={5}
                value={[clockSize]}
                onValueChange={(value) => setClockSize(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the size of the clock display from small (75%) to large (200%)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

