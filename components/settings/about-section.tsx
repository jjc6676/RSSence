"use client"

import { Coffee, Heart, ExternalLink, Github, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">About</h3>
      <p className="text-sm text-muted-foreground mb-4">
        This app was created in response to a request from /u/mulcahey on /r/SomebodyMakeThis/ and brought to life by
        Silver Alcid of <span className="text-gradient-primary">Silver Spark Studio</span>. Have an idea you want built?
        Click the Visit Us button below!
      </p>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 mb-4 py-6 bg-primary/5 hover:bg-primary/10 border-primary/20"
        onClick={() => window.open("https://github.com/silveralcid/RSSence", "_blank")}
      >
        <Github className="h-5 w-5" />
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">Star on GitHub</span>
      </Button>

      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => window.open("https://www.buymeacoffee.com/silveralcid", "_blank")}
        >
          <Coffee size={16} />
          Tip Jar
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => window.open("https://www.patreon.com/silveralcid", "_blank")}
        >
          <Heart size={16} />
          Patreon
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => window.open("https://www.silverspark.studio/", "_blank")}
        >
          <ExternalLink size={16} />
          Visit Us
        </Button>
      </div>
    </div>
  )
}

