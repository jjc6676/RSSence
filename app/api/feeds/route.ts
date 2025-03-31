import { NextResponse } from "next/server"
import type { FeedItem } from "@/types/feed"
import { XMLParser } from "fast-xml-parser"

// Helper function to extract text content from XML element
function getTextValue(obj: any, path: string): string | undefined {
  const parts = path.split(".")
  let current = obj

  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined
    current = current[part]
  }

  return typeof current === "string" ? current : undefined
}

// Helper function to extract image from feed item
function extractImage(item: any): string | undefined {
  // Try media:content
  if (item["media:content"] && item["media:content"]["@_url"]) {
    return item["media:content"]["@_url"]
  }

  // Try enclosure
  if (item.enclosure && item.enclosure["@_url"] && item.enclosure["@_type"]?.startsWith("image/")) {
    return item.enclosure["@_url"]
  }

  // Try to extract from content or description
  const content = item["content:encoded"] || item.content || item.description
  if (content && typeof content === "string") {
    // Simple regex to extract image URL from HTML content
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i)
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1]
    }
  }

  return undefined
}

// Helper function to extract favicon
function getFaviconUrl(feedUrl: string): string {
  try {
    const url = new URL(feedUrl)
    return `${url.protocol}//${url.hostname}/favicon.ico`
  } catch (error) {
    return ""
  }
}

// Helper function to clean HTML from text
function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

// Parse RSS feed
async function parseFeed(feedUrl: string): Promise<FeedItem[]> {
  try {
    // Add custom headers to mimic a browser request
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Referer: "https://www.google.com/",
    }

    // Use fetch API with custom headers
    const response = await fetch(feedUrl, { headers })

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()

    // Parse XML using fast-xml-parser
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => ["item", "entry"].includes(name),
    })

    try {
      const result = parser.parse(text)

      // Determine if it's RSS or Atom
      const isRSS = !!result.rss || !!result.feed

      if (!isRSS) {
        throw new Error("Not a valid RSS or Atom feed")
      }

      // Get the channel/feed info
      const channel = result.rss?.channel || result.feed
      if (!channel) {
        throw new Error("Could not find channel or feed element")
      }

      // Get feed title
      const feedTitle = channel.title || new URL(feedUrl).hostname

      // Get items (works for both RSS and Atom)
      const items = channel.item || channel.entry || []

      if (!Array.isArray(items) || items.length === 0) {
        return []
      }

      const feedItems: FeedItem[] = items.map((item: any) => {
        // Get item properties
        const title = item.title || "Untitled"
        const description = item.description || item.summary
        const content = item["content:encoded"] || item.content
        const link = item.link?.["@_href"] || (typeof item.link === "string" ? item.link : undefined)
        const pubDate = item.pubDate || item.published || item.date
        const guid = item.guid || item.id || link

        // Extract image
        const image = extractImage(item)

        return {
          id: guid || `${feedTitle}-${title}`,
          title: typeof title === "object" ? JSON.stringify(title) : title,
          description: description ? stripHtml(description) : undefined,
          content: typeof content === "string" ? content : undefined,
          link,
          pubDate: typeof pubDate === "string" ? pubDate : undefined,
          image,
          source: typeof feedTitle === "string" ? feedTitle : "Unknown Source",
          favicon: getFaviconUrl(feedUrl),
        }
      })

      return feedItems
    } catch (parseError) {
      console.error("XML parsing error:", parseError)
      throw new Error("Failed to parse feed XML")
    }
  } catch (error) {
    console.error(`Error parsing feed ${feedUrl}:`, error)
    return []
  }
}

export async function POST(request: Request) {
  try {
    const { feeds } = await request.json()

    if (!feeds || !Array.isArray(feeds) || feeds.length === 0) {
      return NextResponse.json({ error: "No feeds provided" }, { status: 400 })
    }

    console.log(`Fetching ${feeds.length} feeds...`)

    // List of CORS proxies to try in order
    const corsProxies = [
      (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
      (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
      (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
    ]

    // Fetch all feeds in parallel
    const feedPromises = feeds.map(async (feedUrl) => {
      try {
        console.log(`Fetching feed: ${feedUrl}`)

        // Try direct fetch first
        try {
          const items = await parseFeed(feedUrl)
          if (items.length > 0) {
            return items
          }
          throw new Error("No items found in direct fetch")
        } catch (directError) {
          console.log(`Direct fetch failed, trying proxies for: ${feedUrl}`)

          // Try each proxy in sequence until one works
          for (const proxyFn of corsProxies) {
            try {
              const proxyUrl = proxyFn(feedUrl)
              console.log(`Trying proxy: ${proxyUrl}`)
              const items = await parseFeed(proxyUrl)
              if (items.length > 0) {
                return items
              }
            } catch (proxyError) {
              console.log(`Proxy fetch failed: ${proxyError}`)
              // Continue to next proxy
            }
          }

          // If all proxies fail, return empty array
          console.error(`All fetch attempts failed for ${feedUrl}`)
          return []
        }
      } catch (error) {
        console.error(`Error fetching feed ${feedUrl}:`, error)
        return []
      }
    })

    const results = await Promise.all(feedPromises)

    // Flatten the array of arrays and sort by publication date (newest first)
    const allItems = results
      .flat()
      .filter((item) => item.title && item.title !== "Untitled") // Filter out items without titles
      .sort((a, b) => {
        if (!a.pubDate) return 1
        if (!b.pubDate) return -1
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      })

    console.log(`Returning ${allItems.length} total items`)

    if (allItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items found in the provided feeds. Try adding different RSS feeds." },
        { status: 404 },
      )
    }

    return NextResponse.json(allItems)
  } catch (error) {
    console.error("Error processing feeds:", error)
    return NextResponse.json(
      { error: "Failed to process feeds: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

