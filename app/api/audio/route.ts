import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 })
  }

  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error fetching audio:", error)
    return new NextResponse("Error fetching audio", { status: 500 })
  }
} 