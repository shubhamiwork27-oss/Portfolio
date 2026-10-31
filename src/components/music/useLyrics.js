import { useState, useEffect, useRef, useCallback } from "react";
import { fetchLyricsFromLrclib } from "../../lib/lyrics";

// Per-track in-memory cache so switching back between tracks is instant
const lyricsMemoryCache = new Map();

/**
 * Custom React hook for fetching and caching lyrics
 * Features:
 * - In-flight AbortController cancellation on track change
 * - In-memory cache per track for instant back-navigation
 * - States: loading, error, lyrics, and quiet retry
 */
export function useLyrics(track) {
  const [lyrics, setLyrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef(null);

  // Consistent unique key for the track
  const trackKey = track
    ? `${track.id || ""}:${track.title || ""}:${track.artist || ""}`.trim().toLowerCase()
    : "";

  const loadLyrics = useCallback(
    async (signal) => {
      if (!track || !track.title) {
        setLyrics(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      // Check per-track in-memory cache first
      if (lyricsMemoryCache.has(trackKey)) {
        setLyrics(lyricsMemoryCache.get(trackKey));
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          title: track.title,
          artist: track.artist || "",
        });

        const albumName = track.movie || track.album;
        if (albumName) {
          params.set("album", albumName);
        }

        if (track.duration && track.duration > 0) {
          params.set("duration", Math.round(track.duration).toString());
        }

        let data = null;
        try {
          const res = await fetch(`/api/lyrics?${params.toString()}`, {
            signal,
            headers: {
              Accept: "application/json",
            },
          });

          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // Internal endpoint unavailable, fallback directly to LRCLIB client-side
        }

        if (!data) {
          data = await fetchLyricsFromLrclib({
            title: track.title,
            artist: track.artist || "",
            album: albumName,
            duration: track.duration,
          });
        }

        if (!data || (!data.plain && (!data.synced || data.synced.length === 0) && !data.instrumental)) {
          throw new Error("Lyrics not found");
        }

        // Store in per-track in-memory cache
        lyricsMemoryCache.set(trackKey, data);
        setLyrics(data);
        setError(null);
      } catch (err) {
        if (err.name === "AbortError") {
          // Aborted by user changing track - ignore
          return;
        }
        console.warn("[useLyrics] Network error fetching lyrics:", err);
        setError("Network error loading lyrics");
      } finally {
        setIsLoading(false);
      }
    },
    [trackKey, track?.title, track?.artist, track?.movie, track?.album, track?.duration]
  );

  useEffect(() => {
    // Abort any pending in-flight request when track changes
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    loadLyrics(controller.signal);

    return () => {
      controller.abort();
    };
  }, [trackKey, retryCount, loadLyrics]);

  const retry = useCallback(() => {
    if (trackKey) {
      lyricsMemoryCache.delete(trackKey);
    }
    setRetryCount((prev) => prev + 1);
  }, [trackKey]);

  return {
    lyrics,
    isLoading,
    error,
    retry,
  };
}

export default useLyrics;

