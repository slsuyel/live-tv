import { NextResponse } from "next/server";
import { fetchUgbyChannels } from "@/utils/ugby";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const channels = await fetchUgbyChannels();
    
    // Save live channel data to local file as requested
    try {
      const cachePath = path.join(process.cwd(), "scratch", "channels.json");
      fs.writeFileSync(cachePath, JSON.stringify(channels, null, 2), "utf8");
    } catch (writeErr: any) {
      console.error("Failed to write to scratch/channels.json:", writeErr.message);
    }

    return NextResponse.json({ success: true, data: channels });
  } catch (error: any) {
    console.error("API /api/ugby/channels error, attempting fallback:", error.message);
    
    // Fallback to locally cached channels.json
    try {
      const fallbackPath = path.join(process.cwd(), "scratch", "channels.json");
      if (fs.existsSync(fallbackPath)) {
        const raw = fs.readFileSync(fallbackPath, "utf8");
        const channels = JSON.parse(raw);
        return NextResponse.json({
          success: true,
          data: channels,
          fallback: true,
          message: "Loaded from cached local fallback due to fetch error"
        });
      }
    } catch (fallbackError: any) {
      console.error("Local channels fallback failed:", fallbackError.message);
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch channels" },
      { status: 500 }
    );
  }
}
