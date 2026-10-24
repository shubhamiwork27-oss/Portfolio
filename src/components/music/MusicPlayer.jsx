import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  PauseIcon,
  ArrowLeft02Icon,
  ArrowRight02Icon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeMute01Icon,
  RepeatIcon,
  SpotifyIcon,
  MusicNote01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

import { TRACKS } from "../../data/tracks";
import { fetchTrackId3 } from "../../data/id3Reader";
import LeftCard from "./LeftCard";
import SpotlightCard from "./SpotlightCard";
import TiltedCard from "./TiltedCard";
import StarBorder from "./StarBorder";
import Equalizer from "./Equalizer";
import ProgressBar from "./ProgressBar";

function MusicPlayer({ isOpen = true }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [mobileTab, setMobileTab] = useState("player"); // "player" | "info" | "queue"
  const [liveMetadata, setLiveMetadata] = useState({});

  const audioRef = useRef(null);
  const volumeRef = useRef(null);

  const baseTrack = TRACKS[trackIndex] || TRACKS[0];
  const live = liveMetadata[baseTrack.id];
  const currentTrack = {
    ...baseTrack,
    title: live?.title || baseTrack.title,
    artist: live?.artist || baseTrack.artist,
    movie: live?.album || baseTrack.movie,
    artwork: live?.artworkUrl || baseTrack.artwork,
    spotifyUrl: live?.title
      ? `https://open.spotify.com/search/${encodeURIComponent(
          `${live.title} ${live.album || ""} ${live.artist || ""}`.trim()
        )}`
      : baseTrack.spotifyUrl,
  };

  // Dynamically inspect audio file ID3 tags in background if available
  useEffect(() => {
    let active = true;
    if (!baseTrack?.url) return;
    fetchTrackId3(baseTrack.url).then((tags) => {
      if (active && tags && (tags.title || tags.artist || tags.album || tags.artworkUrl)) {
        setLiveMetadata((prev) => ({
          ...prev,
          [baseTrack.id]: tags,
        }));
      }
    });
    return () => {
      active = false;
    };
  }, [baseTrack?.id, baseTrack?.url]);

  const paginate = useCallback(
    (direction) => {
      setTrackIndex((prev) => (prev + direction + TRACKS.length) % TRACKS.length);
    },
    []
  );

  const selectTrack = (index) => {
    if (index === trackIndex) {
      togglePlay();
      return;
    }
    setTrackIndex(index);
    setIsPlaying(true);
  };

  // Keyboard navigation (Space = play/pause, ArrowLeft = prev, ArrowRight = next)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target?.getAttribute("role") === "slider"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        paginate(-1);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        paginate(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, paginate]);

  // Sync audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [trackIndex]);

  // Sync volume with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
      audio.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Sync loop mode with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLooping;
    }
  }, [isLooping]);

  // Close volume popover on outside click
  useEffect(() => {
    if (!showVolumeSlider) return;
    const onPointerDown = (e) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolumeSlider(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [showVolumeSlider]);

  // Audio Play / Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(true);
        });
    }
  };

  // Audio Ended handler
  const handleEnded = () => {
    if (isLooping) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } else {
      paginate(1);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration || 0);
    }
  };

  const handleSeek = (newTime) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume icon helper
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeMute01Icon;
    if (volume < 50) return VolumeLowIcon;
    return VolumeHighIcon;
  };

  return (
    <div className="flex flex-col items-center select-none pointer-events-auto w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] mx-auto px-2 sm:px-4">
      {/* Background audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
        className="hidden"
      />

      {/* Mobile/Tablet Sub-Tab Navigation (<1024px) */}
      <div className="flex lg:hidden items-center justify-center gap-1.5 p-1 mb-2.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 shadow-sm">
        <button
          type="button"
          onClick={() => setMobileTab("info")}
          className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            mobileTab === "info"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-white/80 hover:text-white"
          }`}
        >
          Track Info
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("player")}
          className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            mobileTab === "player"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-white/80 hover:text-white"
          }`}
        >
          Player
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("queue")}
          className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            mobileTab === "queue"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-white/80 hover:text-white"
          }`}
        >
          Up Next ({TRACKS.length})
        </button>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex flex-row items-center justify-center gap-4 lg:gap-5 xl:gap-7 2xl:gap-8 w-full">
        {/* ======================================================== */}
        {/* LEFT PANEL: Artist info, Note, Mood chips, Track counter */}
        {/* ======================================================== */}
        <div
          className={`w-full max-w-[360px] sm:max-w-[420px] lg:max-w-none lg:flex-1 lg:min-w-[290px] lg:max-w-[410px] h-[430px] sm:h-[460px] lg:h-[470px] xl:h-[500px] 2xl:h-[530px] max-h-[min(540px,calc(100vh-175px))] ${
            mobileTab === "info" ? "flex" : "hidden lg:flex"
          }`}
        >
          <LeftCard
            track={currentTrack}
            trackIndex={trackIndex}
            totalTracks={TRACKS.length}
            currentTime={currentTime}
            duration={duration}
          />
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Cover, Title + Equalizer, Progress, Controls */}
        {/* Compact, fits in one viewport without vertical scrolling */}
        {/* ======================================================== */}
        <div
          className={`flex-col items-center justify-center flex-shrink-0 w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[370px] xl:max-w-[400px] 2xl:max-w-[440px] ${
            mobileTab === "player" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* Cover Container with TiltedCard */}
          <div className="relative flex items-center justify-center">
            <TiltedCard
              maxTilt={10}
              className="rounded-[32px] sm:rounded-[38px] xl:rounded-[44px]"
            >
              <div
                style={{
                  boxShadow:
                    "0 20px 40px -20px rgba(24, 24, 27, 0.35)",
                }}
                className="relative w-[clamp(260px,28vw,360px)] lg:w-[330px] xl:w-[360px] 2xl:w-[390px] h-[clamp(300px,38vh,420px)] lg:h-[370px] xl:h-[400px] 2xl:h-[430px] max-h-[48vh] rounded-[32px] sm:rounded-[38px] xl:rounded-[44px] overflow-hidden"
              >
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  width={390}
                  height={430}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
                {/* Subtle glass rim overlay */}
                <div
                  style={{
                    boxShadow:
                      "inset 0 0 0 1px rgba(255, 255, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  }}
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                />
              </div>
            </TiltedCard>
          </div>

          {/* Song Title & Equalizer */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 mt-2.5 sm:mt-3 px-2 max-w-full text-center">
            <span
              className="text-white text-base sm:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight drop-shadow-sm truncate max-w-[220px] sm:max-w-[260px] xl:max-w-[310px]"
            >
              {currentTrack.title}
            </span>
            <Equalizer isPlaying={isPlaying} />
          </div>

          {/* Draggable Thin Glass Progress Bar */}
          <div className="w-full mt-1.5 sm:mt-2">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          </div>

          {/* ======================================================== */}
          {/* MUSIC CONTROLLER BAR (Dock Theme - Exact Preserved Style) */}
          {/* ======================================================== */}
          <div className="flex items-center justify-center gap-3 sm:gap-3.5 xl:gap-4.5 mt-2.5 sm:mt-3 xl:mt-4">
            {/* Left Arrow Button (←) - Dock Tile Style */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => paginate(-1)}
              aria-label="Previous Track"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.25)",
                color: "#27272a",
              }}
              className="h-11 w-11 sm:h-12 sm:w-12 xl:h-13 xl:w-13 rounded-full flex items-center justify-center cursor-pointer transition-[filter] hover:brightness-105 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex-shrink-0"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={20} strokeWidth={2} />
            </motion.button>

            {/* Center Pill / Capsule Bar - Dock Panel Style */}
            <div
              style={{
                background: "#ffffff45",
                backdropFilter: "blur(20px) saturate(2)",
                WebkitBackdropFilter: "blur(20px) saturate(2)",
                boxShadow:
                  "inset 0 0 0 1px #ffffff8c, inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)",
              }}
              className="h-11 sm:h-12 xl:h-13 px-3.5 sm:px-4.5 xl:px-5.5 rounded-full flex items-center gap-2.5 sm:gap-3.5"
            >
              {/* Left: Volume Changer with Popup Slider */}
              <div
                ref={volumeRef}
                className="relative flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowVolumeSlider((v) => !v)}
                  aria-label="Adjust Volume"
                  style={{
                    background:
                      isMuted || volume === 0
                        ? "linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%)"
                        : "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
                    boxShadow:
                      "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 3px 8px -3px rgba(24, 24, 27, 0.25)",
                    color: isMuted || volume === 0 ? "#ef4444" : "#27272a",
                  }}
                  className="h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 xl:h-10 xl:w-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-105 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
                >
                  <HugeiconsIcon icon={getVolumeIcon()} size={18} strokeWidth={2} />
                </motion.button>

                {/* Volume Slider Popup */}
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.92 }}
                      transition={{ duration: 0.16 }}
                      style={{
                        background: "#ffffffd9",
                        backdropFilter: "blur(20px) saturate(2)",
                        WebkitBackdropFilter: "blur(20px) saturate(2)",
                        boxShadow:
                          "inset 0 0 0 1px #ffffff, inset 0 1px 0 rgba(255, 255, 255, 1), 0 14px 28px -8px rgba(24, 24, 27, 0.35)",
                      }}
                      className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full z-40 shadow-xl"
                    >
                      <button
                        type="button"
                        onClick={() => setIsMuted((m) => !m)}
                        className="text-[#27272a] hover:opacity-70 transition-opacity cursor-pointer flex items-center"
                        aria-label="Toggle Mute"
                      >
                        <HugeiconsIcon
                          icon={getVolumeIcon()}
                          size={15}
                          strokeWidth={2.2}
                        />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setVolume(val);
                          if (val > 0 && isMuted) setIsMuted(false);
                        }}
                        className="w-16 sm:w-20 h-1.5 accent-[#27272a] bg-zinc-300 rounded-full cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-[#27272a] tabular-nums min-w-[22px]">
                        {isMuted ? "0" : volume}%
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Center Circle: Play / Pause */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause Track" : "Play Track"}
                style={{
                  background: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
                  boxShadow:
                    "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 12px -3px rgba(24, 24, 27, 0.3)",
                  color: "#18181b",
                }}
                className="h-9.5 w-9.5 sm:h-10.5 sm:w-10.5 xl:h-11 xl:w-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-105 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-800"
              >
                <HugeiconsIcon
                  icon={isPlaying ? PauseIcon : PlayIcon}
                  size={20}
                  strokeWidth={2.2}
                  className={!isPlaying ? "ml-0.5" : ""}
                />
              </motion.button>

              {/* Right: Looper (Repeat / Loop Track) */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsLooping(!isLooping)}
                aria-label="Loop Track"
                style={{
                  background: isLooping
                    ? "linear-gradient(180deg, #f0f7ff 0%, #e0effe 100%)"
                    : "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
                  boxShadow: isLooping
                    ? "inset 0 0 0 1px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 1), 0 3px 10px -2px rgba(10, 132, 255, 0.3)"
                    : "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 3px 8px -3px rgba(24, 24, 27, 0.25)",
                  color: isLooping ? "#0a84ff" : "#27272a",
                }}
                className="h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 xl:h-10 xl:w-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-105 active:brightness-90 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <HugeiconsIcon icon={RepeatIcon} size={18} strokeWidth={2.2} />
                {isLooping && (
                  <span
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-[#0a84ff]"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            </div>

            {/* Right Arrow Button (→) - Dock Tile Style */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => paginate(1)}
              aria-label="Next Track"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.25)",
                color: "#27272a",
              }}
              className="h-11 w-11 sm:h-12 sm:w-12 xl:h-13 xl:w-13 rounded-full flex items-center justify-center cursor-pointer transition-[filter] hover:brightness-105 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white flex-shrink-0"
            >
              <HugeiconsIcon icon={ArrowRight02Icon} size={20} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Up Next Queue, Dynamic Spotify Action */}
        {/* ======================================================== */}
        <div
          className={`w-full max-w-[360px] sm:max-w-[420px] lg:max-w-none lg:flex-1 lg:min-w-[290px] lg:max-w-[410px] h-[430px] sm:h-[460px] lg:h-[470px] xl:h-[500px] 2xl:h-[530px] max-h-[min(540px,calc(100vh-175px))] ${
            mobileTab === "queue" ? "flex" : "hidden lg:flex"
          }`}
        >
          <SpotlightCard className="p-5 sm:p-6 xl:p-7 flex flex-col justify-between w-full h-full text-white">
            <div className="flex flex-col justify-between h-full space-y-3 xl:space-y-4">
              {/* Header: Up Next & Live Status */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-white/95">
                    <HugeiconsIcon icon={MusicNote01Icon} size={14} />
                  </div>
                  <span className="text-xs xl:text-sm font-bold tracking-wider uppercase text-white/95">
                    Up Next
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-white/85">
                    {TRACKS.length} tracks
                  </span>
                </div>
              </div>

              {/* Scrollable Queue List (With smooth edge fade & hidden scrollbar) */}
              <div
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, black 8px, black calc(100% - 8px), transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, black 8px, black calc(100% - 8px), transparent 100%)",
                }}
                className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 py-1 min-h-[220px] max-h-[340px] xl:max-h-[380px] 2xl:max-h-[420px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {TRACKS.map((track, idx) => {
                  const isCurrent = idx === trackIndex;
                  const liveItem = liveMetadata[track.id];
                  const displayTitle = liveItem?.title || track.title;
                  const displayArtist = liveItem?.artist || track.artist;
                  const displayMovie = liveItem?.album || track.movie;
                  const displayArtwork = liveItem?.artworkUrl || track.artwork;

                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => selectTrack(idx)}
                      style={{
                        contentVisibility: "auto",
                        containIntrinsicSize: "0 52px",
                      }}
                      className={`group w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                        isCurrent
                          ? "bg-white/22 border border-white/40 shadow-sm ring-1 ring-white/20"
                          : "hover:bg-white/14 border border-transparent hover:border-white/20"
                      }`}
                    >
                      {/* Track Thumbnail */}
                      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/25 shadow-sm">
                        <img
                          src={displayArtwork}
                          alt={displayTitle}
                          width={40}
                          height={40}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                        />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-7 h-7 rounded-full bg-white animate-ping" />
                          </div>
                        )}
                      </div>

                      {/* Track Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-white truncate flex items-center gap-1.5">
                          <span>{displayTitle}</span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-white/70 truncate flex items-center gap-1">
                          <span>{displayArtist}</span>
                          {displayMovie && (
                            <>
                              <span className="text-white/40">•</span>
                              <span className="text-white/60 truncate">{displayMovie}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Spotify Footer Card */}
              <div className="pt-1.5 flex flex-col items-center gap-1.5 border-t border-white/10 flex-shrink-0">
                <StarBorder
                  onClick={() => window.open(currentTrack.spotifyUrl, "_blank", "noopener,noreferrer")}
                  className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-zinc-900 shadow-md cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
                  aria-label="Listen on Spotify"
                >
                  <HugeiconsIcon icon={SpotifyIcon} size={25} className="text-[#005b18]" />
                  <span>Listen on Spotify</span>
                </StarBorder>
                <div className="flex items-center justify-between w-full text-[10px] text-white/60 px-1 pt-0.5">
                  <span className="truncate max-w-[210px] text-white/75">
                    Match: <span className="text-white font-medium">"{currentTrack.title}"</span>
                  </span>
                  <span className="text-white font-medium tracking-wide flex items-center gap-0.5 flex-shrink-0">
                    Open Spotify ↗
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}

export default memo(MusicPlayer);