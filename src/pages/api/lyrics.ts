import type { APIRoute } from "astro";
import { fetchLyricsFromLrclib } from "../../lib/lyrics";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get("title");
    const artist = url.searchParams.get("artist") || "";
    const album = url.searchParams.get("album") || undefined;
    const durationParam = url.searchParams.get("duration");
    const duration = durationParam ? parseFloat(durationParam) : undefined;

    if (!title || !title.trim()) {
      return new Response(
        JSON.stringify({ error: "Query parameter 'title' is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const lyricsData = await fetchLyricsFromLrclib({
      title,
      artist,
      album,
      duration,
    });

    return new Response(JSON.stringify(lyricsData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("[Astro GET /api/lyrics] Error handling lyrics request:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to retrieve lyrics" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

