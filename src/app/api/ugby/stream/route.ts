import { NextRequest, NextResponse } from "next/server";
import { fetchUgbyStream } from "@/utils/ugby";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const token = searchParams.get("token");

  if (!key || !token) {
    return NextResponse.json(
      { success: false, error: "Missing required query parameters: 'key' and 'token'" },
      { status: 400 }
    );
  }

  try {
    const streamInfo = await fetchUgbyStream(key, token);
    if (!streamInfo) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch or decrypt stream metadata" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: streamInfo });
  } catch (error: any) {
    console.error(`API /api/ugby/stream error for key ${key}:`, error.message);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process stream decryption" },
      { status: 500 }
    );
  }
}
