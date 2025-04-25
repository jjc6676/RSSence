"use client"

import { useState, useRef } from "react"
import { Music, Upload, Trash2, Play, Pause } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useFeed } from "@/context/feed-context"

export default function MusicSettings() {
  const [musicUrl, setMusicUrl] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    backgroundMusic,
    setBackgroundMusic,
    isMusicPlaying,
    setIsMusicPlaying,
    musicVolume,
    setMusicVolume,
  } = useFeed()

  const validateMusicUrl = (url: string) => {
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

  const handleAddMusic = () => {
    if (musicUrl.trim()) {
      const validation = validateMusicUrl(musicUrl.trim())
      if (validation.valid) {
        setBackgroundMusic(musicUrl.trim())
        setMusicUrl("")
        setUrlError(null)
      } else {
        setUrlError(validation.message || "Invalid URL")
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setBackgroundMusic(fileUrl)
    }
  }

  const handleRemoveMusic = () => {
    setBackgroundMusic("")
    setIsMusicPlaying(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Background Music</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music size={18} />
            <Label htmlFor="background-music">Background Music</Label>
          </div>
          <Switch 
            id="background-music" 
            checked={isMusicPlaying} 
            onCheckedChange={setIsMusicPlaying}
            disabled={!backgroundMusic}
          />
        </div>

        {backgroundMusic && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            >
              {isMusicPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRemoveMusic}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="music-url">Music URL</Label>
          <div className="flex gap-2">
            <Input
              id="music-url"
              placeholder="Enter music URL"
              value={musicUrl}
              onChange={(e) => setMusicUrl(e.target.value)}
              className={urlError ? "border-destructive" : ""}
            />
            <Button onClick={handleAddMusic} variant="default">
              Add
            </Button>
          </div>
          {urlError && <p className="text-sm text-destructive">{urlError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="music-file">Or upload a music file</Label>
          <div className="flex gap-2">
            <Input
              id="music-file"
              type="file"
              accept="audio/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload size={16} className="mr-2" />
              Choose File
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: MP3, WAV, OGG
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="music-volume">Volume</Label>
          <Input
            id="music-volume"
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Adjust the volume of the background music
          </p>
        </div>
      </div>
    </div>
  )
} 