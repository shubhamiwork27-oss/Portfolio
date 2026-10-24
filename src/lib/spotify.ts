/**
 * Spotify Web API Server-side Client-Credentials Flow
 * Extracts Spotify track metadata (title, artist, album, duration_ms, cover)
 * Keeps credentials securely in environment variables (never exposed to client).
 */

export interface SpotifyTrackMetadata {
  title: string;
  artist: string;
  album: string;
  duration_ms: number;
  duration_sec: number;
  cover: string;
  spotifyUrl: string;
}

interface SpotifyTokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: SpotifyTokenCache | null = null;

/**
 * Extract Spotify track ID from URL, URI or raw ID
 * Examples:
 * - https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=...
 * - spotify:track:4cOdK2wGLETKBW3PvgPWqT
 * - 4cOdK2wGLETKBW3PvgPWqT
 */
export function extractSpotifyTrackId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Match URL: open.spotify.com/track/<id>
  const urlMatch = trimmed.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]{22})/);
  if (urlMatch) return urlMatch[1];

  // Match URI: spotify:track:<id>
  const uriMatch = trimmed.match(/spotify:track:([a-zA-Z0-9]{22})/);
  if (uriMatch) return uriMatch[1];

  // Match raw 22-char alphanumeric ID
  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Fetch Spotify App access token using Client Credentials flow
 */
export async function getSpotifyAccessToken(): Promise<string | null> {
  // Use process.env or import.meta.env for server-side environments
  const clientId =
    process.env.SPOTIFY_CLIENT_ID ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.SPOTIFY_CLIENT_ID);
  const clientSecret =
    process.env.SPOTIFY_CLIENT_SECRET ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.SPOTIFY_CLIENT_SECRET);

  if (!clientId || !clientSecret) {
    console.warn(
      "[Spotify API] SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables are missing."
    );
    return null;
  }

  // Return cached token if still valid (with 60s safety buffer)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60000) {
    return tokenCache.accessToken;
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      console.error(`[Spotify API] Token request failed with HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    };
    return tokenCache.accessToken;
  } catch (error) {
    console.error("[Spotify API] Error fetching access token:", error);
    return null;
  }
}

/**
 * Fetch track metadata from Spotify Web API
 */
export async function fetchSpotifyTrackMetadata(
  spotifyUrlOrId: string
): Promise<SpotifyTrackMetadata | null> {
  const trackId = extractSpotifyTrackId(spotifyUrlOrId);
  if (!trackId) {
    console.warn(`[Spotify API] Invalid track URL or ID: ${spotifyUrlOrId}`);
    return null;
  }

  const token = await getSpotifyAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn(`[Spotify API] Failed to fetch track ${trackId}: HTTP ${response.status}`);
      return null;
    }

    const track = await response.json();
    const title = track.name;
    const artist = (track.artists || []).map((a: any) => a.name).join(", ");
    const album = track.album?.name || "";
    const duration_ms = track.duration_ms || 0;
    const duration_sec = Math.round(duration_ms / 1000);
    const cover = track.album?.images?.[0]?.url || "";
    const spotifyUrl = track.external_urls?.spotify || `https://open.spotify.com/track/${trackId}`;

    return {
      title,
      artist,
      album,
      duration_ms,
      duration_sec,
      cover,
      spotifyUrl,
    };
  } catch (error) {
    console.error(`[Spotify API] Error fetching track ${trackId}:`, error);
    return null;
  }
}

/**
 * Resolves track metadata for playlist entries.
 * Per requirement:
 * "If a track already has title/artist/album in my data, skip Spotify and use that."
 */
export async function resolveTrackMetadata<
  T extends {
    spotifyUrl?: string;
    spotifyId?: string;
    title?: string;
    artist?: string;
    album?: string;
    movie?: string;
    artwork?: string;
    duration?: number;
  }
>(track: T): Promise<T> {
  // If track already has title, artist and album/movie, skip Spotify
  const hasExistingMetadata =
    Boolean(track.title) &&
    Boolean(track.artist) &&
    Boolean(track.album || track.movie);

  if (hasExistingMetadata) {
    return track;
  }

  const spotifyRef = track.spotifyUrl || track.spotifyId;
  if (!spotifyRef) {
    return track;
  }

  const spotifyMeta = await fetchSpotifyTrackMetadata(spotifyRef);
  if (!spotifyMeta) {
    return track;
  }

  return {
    ...track,
    title: track.title || spotifyMeta.title,
    artist: track.artist || spotifyMeta.artist,
    album: track.album || spotifyMeta.album,
    movie: track.movie || spotifyMeta.album,
    artwork: track.artwork || spotifyMeta.cover,
    duration: track.duration || spotifyMeta.duration_sec,
    spotifyUrl: track.spotifyUrl || spotifyMeta.spotifyUrl,
  };
}

