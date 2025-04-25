import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FeedProvider } from "@/context/feed-context"
import AudioPlayer from "@/components/audio-player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RSSence - RSS Feed Visualizer",
  description: "A free and open-source RSS feed visualizer for everyone",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FeedProvider>
            <AudioPlayer />
            {children}
          </FeedProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}