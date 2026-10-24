import React, { useState, useRef, useEffect, useMemo, memo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  MusicNote01Icon,
  SpotifyIcon,
} from "@hugeicons/core-free-icons";
import { useLyrics } from "./useLyrics";
import SpotlightCard from "./SpotlightCard";
import "./LeftCard.css";

export function LeftCard({
  track,
  trackIndex = 0,
  totalTracks = 5,
  currentTime = 0,
  duration = 0,
}) {
  const [activeTab, setActiveTab] = useState("why"); // "why" | "lyrics"
  const { lyrics, isLoading, error, retry } = useLyrics({
    ...track,
    duration: duration || track?.duration,
  });

  const scrollRef = useRef(null);
  const lineRefs = useRef([]);
  const isUserScrollingRef = useRef(false);
  const userScrollTimeoutRef = useRef(null);

  // Reset scroll to top when track changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [track?.id]);

  // Find active line index based on current playback time
  const activeLineIndex = useMemo(() => {
    if (!lyrics?.synced || lyrics.synced.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.synced.length; i++) {
      if (currentTime >= lyrics.synced[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [lyrics?.synced, currentTime]);

  // Temporarily pause auto-scroll when user scrolls or interacts manually
  const handleUserInteraction = () => {
    isUserScrollingRef.current = true;
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 3500); // 3.5 seconds pause
  };

  // Smoothly auto-scroll active lyric line into center view
  useEffect(() => {
    if (activeTab !== "lyrics" || isUserScrollingRef.current || activeLineIndex < 0) {
      return;
    }
    const container = scrollRef.current;
    const lineEl = lineRefs.current[activeLineIndex];
    if (!container || !lineEl) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targetTop =
      lineEl.offsetTop - container.clientHeight / 2 + lineEl.clientHeight / 2;

    container.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeLineIndex, activeTab]);

  const activeLineText =
    activeLineIndex >= 0 && lyrics?.synced?.[activeLineIndex]?.text
      ? lyrics.synced[activeLineIndex].text
      : "";

  return (
    <SpotlightCard className="p-5 sm:p-6 xl:p-7 flex flex-col justify-between w-full h-full text-white">
      <div className="flex flex-col justify-between h-full space-y-3 xl:space-y-4">
        {/* Header: Track counter badge */}
        <div className="flex items-center justify-between pb-1 border-b border-white/10 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] xl:text-xs font-semibold tracking-wider uppercase bg-white/20 border border-white/30 text-white/95 shadow-sm">
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            Track {trackIndex + 1} of {totalTracks}
          </span>
        </div>

        {/* Artist & Movie/Album details */}
        <div className="space-y-1 sm:space-y-1.5 flex-shrink-0">
          <div className="text-base sm:text-lg xl:text-xl font-bold text-white leading-tight min-h-[26px] truncate">
            {track?.artist || "Unknown Artist"}
          </div>
          {(track?.movie || track?.album) && (
            <div className="text-xs sm:text-sm text-white/85 font-medium flex items-center gap-1.5 truncate">
              <span className="text-white/60">from</span>
              <span className="text-white font-semibold underline decoration-white/30 underline-offset-2 truncate">
                {track?.movie || track?.album}
              </span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* "Why I love this" & "Lyrics" Container with macOS Segmented Control */}
        {/* ======================================================== */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
          }}
          className="p-3 sm:p-3.5 xl:p-4 rounded-2xl flex-1 min-h-[140px] max-h-[190px] sm:max-h-[220px] xl:max-h-[250px] flex flex-col justify-between shadow-inner overflow-hidden"
        >
          {/* macOS-style segmented control header */}
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10 flex-shrink-0">
            <div
              className="lyrics-segmented-control"
              role="tablist"
              aria-label="Track information tabs"
            >
              <button
                type="button"
                role="tab"
                id="tab-why"
                aria-selected={activeTab === "why"}
                aria-controls="panel-why"
                onClick={() => setActiveTab("why")}
                className={`lyrics-segmented-btn ${activeTab === "why" ? "active" : ""}`}
              >
                Why I love this
              </button>
              <button
                type="button"
                role="tab"
                id="tab-lyrics"
                aria-selected={activeTab === "lyrics"}
                aria-controls="panel-lyrics"
                onClick={() => setActiveTab("lyrics")}
                className={`lyrics-segmented-btn ${activeTab === "lyrics" ? "active" : ""}`}
              >
                Lyrics
              </button>
            </div>

            {activeTab === "lyrics" && lyrics?.synced && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Synced
              </span>
            )}
          </div>

          {/* TAB 1: Why I love this content */}
          {activeTab === "why" && (
            <div
              id="panel-why"
              role="tabpanel"
              aria-labelledby="tab-why"
              className="flex-1 overflow-y-auto scrollbar-thin pr-1 flex flex-col justify-center"
            >
              <div className="text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1 flex items-center gap-1 flex-shrink-0">
                <span>“</span> Personal Highlight
              </div>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed italic line-clamp-4 sm:line-clamp-5">
                {track?.whyILoveThis || "A favorite track in this collection."}
              </p>
            </div>
          )}

          {/* TAB 2: Dynamic Lyrics content */}
          {activeTab === "lyrics" && (
            <div
              id="panel-lyrics"
              role="tabpanel"
              aria-labelledby="tab-lyrics"
              className="flex-1 flex flex-col min-h-0 relative"
            >
              {/* Screen-reader announcement for active line changes */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {activeLineText}
              </div>

              {/* State 1: Skeleton Loading Shimmer */}
              {isLoading && (
                <div
                  className="flex-1 flex flex-col justify-center space-y-2.5 px-2 py-1"
                  aria-label="Loading lyrics"
                >
                  <div className="h-3 w-3/4 lyrics-shimmer-line" />
                  <div className="h-3.5 w-5/6 lyrics-shimmer-line" />
                  <div className="h-3 w-2/3 lyrics-shimmer-line" />
                  <div className="h-3.5 w-4/5 lyrics-shimmer-line" />
                  <div className="h-3 w-1/2 lyrics-shimmer-line" />
                </div>
              )}

              {/* State 2: Network Error with Quiet Retry */}
              {!isLoading && error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-2 space-y-2">
                  <p className="text-xs text-white/75">Couldn't load lyrics right now.</p>
                  <button
                    type="button"
                    onClick={retry}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-white/20 hover:bg-white/30 text-white border border-white/25 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* State 3: Instrumental Track */}
              {!isLoading && !error && lyrics?.instrumental && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-2 space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/90 mb-1">
                    <HugeiconsIcon icon={MusicNote01Icon} size={18} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-white/95">
                    Instrumental Track
                  </div>
                  <p className="text-[11px] text-white/60">
                    This composition has no spoken or sung lyrics.
                  </p>
                </div>
              )}

              {/* State 4: Lyrics Not Found */}
              {!isLoading &&
                !error &&
                !lyrics?.instrumental &&
                !lyrics?.synced &&
                !lyrics?.plain && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-2 space-y-1.5">
                    <p className="text-xs text-white/80">
                      Lyrics aren't available for this song yet.
                    </p>
                    {track?.spotifyUrl && (
                      <a
                        href={track.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-white font-medium underline decoration-white/40 hover:decoration-white transition-all cursor-pointer mt-0.5"
                      >
                        <HugeiconsIcon icon={SpotifyIcon} size={14} className="text-[#1ed760]" />
                        <span>Listen on Spotify ↗</span>
                      </a>
                    )}
                  </div>
                )}

              {/* State 5: Synced Lyrics */}
              {!isLoading && !error && lyrics?.synced && lyrics.synced.length > 0 && (
                <div
                  ref={scrollRef}
                  role="region"
                  aria-label="Lyrics"
                  tabIndex={0}
                  onWheel={handleUserInteraction}
                  onTouchMove={handleUserInteraction}
                  onKeyDown={(e) => {
                    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(e.key)) {
                      handleUserInteraction();
                    }
                  }}
                  className="lyrics-scroll-container flex-1 overflow-y-auto px-1 py-3 space-y-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl"
                >
                  {lyrics.synced.map((line, idx) => {
                    const isActive = idx === activeLineIndex;
                    // Skip empty lines in display
                    if (!line.text) return null;

                    return (
                      <div
                        key={`${line.time}-${idx}`}
                        ref={(el) => (lineRefs.current[idx] = el)}
                        className={`lyric-line text-xs sm:text-sm leading-relaxed ${
                          isActive ? "active" : "inactive"
                        }`}
                      >
                        {line.text}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* State 6: Static Plain Lyrics (Fallback if synced not available) */}
              {!isLoading &&
                !error &&
                !lyrics?.synced &&
                lyrics?.plain && (
                  <div
                    ref={scrollRef}
                    role="region"
                    aria-label="Lyrics"
                    tabIndex={0}
                    className="lyrics-scroll-container flex-1 overflow-y-auto px-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-xl"
                  >
                    <p className="text-xs sm:text-sm text-white/90 whitespace-pre-line leading-relaxed font-sans">
                      {lyrics.plain}
                    </p>
                  </div>
                )}

              {/* LRCLIB Attribution Credit Line */}
              <div className="pt-1.5 mt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-white/45 flex-shrink-0">
                <span>Lyrics via LRCLIB</span>
                {track?.spotifyUrl && (
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/80 transition-colors inline-flex items-center gap-1"
                  >
                    Spotify ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mood chips */}
        <div className="space-y-1.5 pt-0.5 flex-shrink-0">
          <div className="text-[11px] xl:text-xs font-bold tracking-wider uppercase text-white/60">
            Mood & Vibes
          </div>
          <div className="flex flex-wrap gap-1.5 xl:gap-2">
            {(track?.moodTags || []).map((tag) => (
              <span
                key={tag}
                className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/15 text-white/95 border border-white/20 transition-colors hover:bg-white/25"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

export default memo(LeftCard);

