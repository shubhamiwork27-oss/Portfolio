import { NextRequest, NextResponse } from "next/server";
import { fetchLyricsFromLrclib } from "../../../lib/lyrics";

export const dynamic = "force-dynamic";
export const revalidate = 604800; // Cache for 7 days (604,800 seconds)

export async function GET(request: NextRequest | Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const artist = searchParams.get("artist") || "";
    const album = searchParams.get("album") || undefined;
    const durationParam = searchParams.get("duration");
    const duration = durationParam ? parseFloat(durationParam) : undefined;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Query parameter 'title' is required" },
        { status: 400 }
      );
    }

    const lyricsData = await fetchLyricsFromLrclib({
      title,
      artist,
      album,
      duration,
    });

    return NextResponse.json(lyricsData, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("[GET /api/lyrics] Error handling lyrics request:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve lyrics" },
      { status: 500 }
    );
  }
}

