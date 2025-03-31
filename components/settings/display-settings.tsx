"use client"

import { Image, ArrowDownAZ, ArrowUpZA, Shuffle, ScalingIcon as Resize } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFeed, type SortOrder } from "@/context/feed-context"

export default function DisplaySettings() {
  const { showImages, setShowImages, contentSize, setContentSize, sortOrder, setSortOrder } = useFeed()

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Display Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image size={18} />
            <Label htmlFor="show-images">Show Images</Label>
          </div>
          <Switch id="show-images" checked={showImages} onCheckedChange={setShowImages} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Resize size={18} />
              <Label htmlFor="content-size">Content Size</Label>
            </div>
            <span className="text-sm text-muted-foreground">{contentSize}%</span>
          </div>
          <Slider
            id="content-size"
            min={75}
            max={200}
            step={5}
            value={[contentSize]}
            onValueChange={(value) => setContentSize(value[0])}
          />
          <p className="text-xs text-muted-foreground">
            Adjust the size of cards and text from small desktop (75%) to large TV (200%)
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ArrowDownAZ size={18} />
            Sort Order
          </Label>
          <RadioGroup
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="latest" id="latest" />
              <Label htmlFor="latest" className="flex items-center gap-1 cursor-pointer">
                <ArrowDownAZ size={14} />
                Latest to Oldest
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oldest" id="oldest" />
              <Label htmlFor="oldest" className="flex items-center gap-1 cursor-pointer">
                <ArrowUpZA size={14} />
                Oldest to Latest
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shuffle" id="shuffle" />
              <Label htmlFor="shuffle" className="flex items-center gap-1 cursor-pointer">
                <Shuffle size={14} />
                Shuffle (Random)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

