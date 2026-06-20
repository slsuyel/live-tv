import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsedUrl = new URL(targetUrl);
    
    // Construct request headers to mimic a browser player
    const headers = new Headers();
    headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    headers.set("Origin", parsedUrl.origin);
    headers.set("Referer", parsedUrl.origin + "/");

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      return new NextResponse(`Target returned status ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=2",
    };

    return new NextResponse(response.body, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("Proxy error for URL:", targetUrl, error.message);
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
}
