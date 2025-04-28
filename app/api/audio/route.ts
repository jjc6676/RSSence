import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 })
  }

  try {
    let fetchUrl = url;
    // If url is a relative path, prepend the server's base URL
    if (url.startsWith("/")) {
      // Use the request's host header to support different environments
      const baseUrl = request.headers.get("host")
        ? `http://${request.headers.get("host")}`
        : "http://localhost:3000";
      fetchUrl = baseUrl + url;
    }
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upstream fetch failed: ${response.status} ${response.statusText} - ${errorText}`);
      return new NextResponse(
        `Upstream fetch failed: ${response.status} ${response.statusText}`,
        { status: 502 }
      );
    }
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error fetching audio:", error)
    return new NextResponse("Error fetching audio", { status: 500 })
  }
}
