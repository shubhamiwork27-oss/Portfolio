export interface SyncedLyricLine {
  time: number; // in seconds
  text: string;
}

export interface LyricsResponse {
  plain: string | null;
  synced: SyncedLyricLine[] | null;
  instrumental: boolean;
  source: "lrclib";
}

/**
 * Clean track title by removing:
 * - (From "...") or - From ...
 * - feat. / ft. / featuring suffixes
 * - remix, version, remaster, live, acoustic tags
 * - extra whitespace
 */
export function cleanTrackTitle(title: string): string {
  if (!title) return "";
  let cleaned = title;

  // 1. Remove (From "...") or [from "..."] or - From ...
  cleaned = cleaned.replace(/\s*[\(\[]\s*from\s+["']?[^"')\]]+["']?\s*[\)\]]/gi, "");
  cleaned = cleaned.replace(/\s*-\s*from\s+["']?[^"'-]+["']?/gi, "");

  // 2. Remove feat. / ft. / featuring (both in parentheses and standalone)
  cleaned = cleaned.replace(/\s*[\(\[]\s*(?:feat|ft|featuring)\.?\s+[^)\]]+[\)\]]/gi, "");
  cleaned = cleaned.replace(/\s*(?:feat|ft|featuring)\.?\s+.*$/gi, "");

  // 3. Remove remix, version, acoustic, live, remaster, radio edit, etc.
  cleaned = cleaned.replace(
    /\s*[\(\[]\s*(?:remix|acoustic|live|version|edit|remaster(?:ed)?|deluxe|bonus\s+track|official(?:\s+audio|\s+video)?)[^)*\]]*[\)\]]/gi,
    ""
  );
  cleaned = cleaned.replace(
    /\s*-\s*(?:remix|acoustic|live|version|edit|remaster(?:ed)?(?:\s+\d{4})?).*$/gi,
    ""
  );

  // 4. Clean extra whitespace
  return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Parse standard LRC format string into array of { time: seconds, text: string }
 */
export function parseLrc(lrcString: string | null | undefined): SyncedLyricLine[] | null {
  if (!lrcString || typeof lrcString !== "string") return null;

  const lines = lrcString.split(/\r?\n/);
  const result: SyncedLyricLine[] = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const matches = Array.from(line.matchAll(timeRegex));
    if (matches.length === 0) continue;

    const text = line.replace(timeRegex, "").trim();

    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      let millis = 0;
      if (match[3]) {
        const fractionStr = match[3].padEnd(3, "0").slice(0, 3);
        millis = parseInt(fractionStr, 10);
      }
      const time = minutes * 60 + seconds + millis / 1000;
      result.push({ time, text });
    }
  }

  if (result.length === 0) return null;

  result.sort((a, b) => a.time - b.time);
  return result;
}

const LRCLIB_BASE_URL = "https://lrclib.net/api";
const USER_AGENT = "PortfolioMusicLyrics/1.0 (https://github.com/shubham-idnani/portfolio; lyrics-client)";

// 7-day in-memory server cache
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const lyricsCache = new Map<string, { data: LyricsResponse; timestamp: number }>();

export async function fetchLyricsFromLrclib({
  title,
  artist,
  album,
  duration,
}: {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
}): Promise<LyricsResponse> {
  const cleanedTitle = cleanTrackTitle(title);
  const cacheKey = `${cleanedTitle.toLowerCase()}::${(artist || "").toLowerCase()}::${Math.round(duration || 0)}`;

  const cached = lyricsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let record: any = null;

  // 1. Primary: GET https://lrclib.net/api/get
  const getParams = new URLSearchParams({
    track_name: cleanedTitle,
    artist_name: artist || "",
  });
  if (album) getParams.set("album_name", album);
  if (duration && duration > 0) {
    getParams.set("duration", Math.round(duration).toString());
  }

  try {
    const getRes = await fetch(`${LRCLIB_BASE_URL}/get?${getParams.toString()}`, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (getRes.ok) {
      record = await getRes.json();
    }
  } catch (err) {
    console.warn("[LRCLIB] /get failed:", err);
  }

  // 2. Fallback: GET https://lrclib.net/api/search if /get returned 404 or missing lyrics
  if (!record || (!record.syncedLyrics && !record.plainLyrics && !record.instrumental)) {
    try {
      const searchParams = new URLSearchParams({
        track_name: cleanedTitle,
        artist_name: artist || "",
      });
      const searchRes = await fetch(`${LRCLIB_BASE_URL}/search?${searchParams.toString()}`, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (searchRes.ok) {
        const searchResults: any[] = await searchRes.json();
        if (Array.isArray(searchResults) && searchResults.length > 0) {
          if (duration && duration > 0) {
            searchResults.sort((a, b) => {
              const diffA = Math.abs((a.duration || 0) - duration);
              const diffB = Math.abs((b.duration || 0) - duration);
              return diffA - diffB;
            });
          }
          record = searchResults[0];
        }
      }
    } catch (err) {
      console.warn("[LRCLIB] /search failed:", err);
    }
  }

  const plain = record?.plainLyrics?.trim() || null;
  const synced = parseLrc(record?.syncedLyrics);
  const instrumental = Boolean(record?.instrumental);

  const response: LyricsResponse = {
    plain,
    synced,
    instrumental,
    source: "lrclib",
  };

  lyricsCache.set(cacheKey, { data: response, timestamp: Date.now() });
  return response;
}

