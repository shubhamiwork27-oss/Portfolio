import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "@hugeicons/core-free-icons";

import { TRACKS } from "./tracks";

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 320 : -320,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 320 : -320,
    opacity: 0,
    scale: 0.9,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

export default function MusicPlayer() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef(null);
  const volumeRef = useRef(null);

  const trackIndex = ((page % TRACKS.length) + TRACKS.length) % TRACKS.length;
  const currentTrack = TRACKS[trackIndex] || TRACKS[0];

  const paginate = useCallback(
    (newDirection) => {
      setPage([page + newDirection, newDirection]);
    },
    [page],
  );

  // Sync audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
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

  // Get current volume icon
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeMute01Icon;
    if (volume < 50) return VolumeLowIcon;
    return VolumeHighIcon;
  };

  return (
    <div className='flex flex-col items-center select-none pointer-events-auto'>
      {/* Background audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload='metadata'
        className='hidden'
      />

      {/* ======================================================== */}
      {/* MID BIG RECTANGULAR BOX (ONLY CONTAINS THE IMAGE)         */}
      {/* Moves sidewards like a card on left/right click or swipe */}
      {/* ======================================================== */}
      <div
        style={{
          background: "#ffffff30",
          backdropFilter: "blur(20px) saturate(2)",
          WebkitBackdropFilter: "blur(20px) saturate(2)",
          boxShadow:
            "inset 0 0 0 1px #ffffff8c, inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 22px 44px -22px rgba(24, 24, 27, 0.35)",
        }}
        className='relative w-[500px] h-[500px] sm:w-[400px] sm:h-[400px] max-w-[78vw] max-h-[45vh] aspect-square rounded-[38px] sm:rounded-[44px] overflow-hidden'>
        <AnimatePresence custom={direction} mode='popLayout' initial={false}>
          <motion.img
            key={page}
            src={currentTrack.artwork}
            alt={currentTrack.title}
            custom={direction}
            variants={cardVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{
              x: { type: "spring", stiffness: 320, damping: 30 },
              opacity: { duration: 0.28 },
              scale: { duration: 0.28 },
            }}
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className='absolute inset-0 w-full h-full object-cover select-none cursor-grab active:cursor-grabbing'
          />
        </AnimatePresence>
      </div>

      {/* ======================================================== */}
      {/* MUSIC CONTROLLER BAR (Dock Theme)                        */}
      {/* ======================================================== */}
      <div className='flex items-center justify-center gap-3.5 sm:gap-4.5 mt-5 sm:mt-6'>
        {/* Left Arrow Button (←) - Dock Tile Style */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => paginate(-1)}
          aria-label='Previous Card'
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.25)",
            color: "#27272a",
          }}
          className='h-12 w-12 sm:h-13 sm:w-13 rounded-full flex items-center justify-center cursor-pointer transition-[filter] hover:brightness-105 active:brightness-90'>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={22} strokeWidth={2} />
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
          className='h-12 sm:h-13 px-4 sm:px-5 rounded-full flex items-center gap-3 sm:gap-4'>
          {/* Left: Volume Changer with Popup Slider */}
          <div
            ref={volumeRef}
            className='relative flex items-center justify-center'>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowVolumeSlider((v) => !v)}
              aria-label='Volume Changer'
              style={{
                background:
                  isMuted || volume === 0
                    ? "linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%)"
                    : "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 3px 8px -3px rgba(24, 24, 27, 0.25)",
                color: isMuted || volume === 0 ? "#ef4444" : "#27272a",
              }}
              className='h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-105 active:brightness-90'>
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
                  className='absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full z-40 shadow-xl'>
                  <button
                    type='button'
                    onClick={() => setIsMuted((m) => !m)}
                    className='text-[#27272a] hover:opacity-70 transition-opacity cursor-pointer flex items-center'
                    aria-label='Toggle Mute'>
                    <HugeiconsIcon
                      icon={getVolumeIcon()}
                      size={15}
                      strokeWidth={2.2}
                    />
                  </button>
                  <input
                    type='range'
                    min='0'
                    max='100'
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setVolume(val);
                      if (val > 0 && isMuted) setIsMuted(false);
                    }}
                    className='w-16 sm:w-20 h-1.5 accent-[#27272a] bg-zinc-300 rounded-full cursor-pointer'
                  />
                  <span className='text-[10px] font-semibold text-[#27272a] tabular-nums min-w-[22px]'>
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
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
              boxShadow:
                "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 12px -3px rgba(24, 24, 27, 0.3)",
              color: "#18181b",
            }}
            className='h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-105 active:brightness-90'>
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
            aria-label='Looper'
            style={{
              background: isLooping
                ? "linear-gradient(180deg, #f0f7ff 0%, #e0effe 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
              boxShadow: isLooping
                ? "inset 0 0 0 1px rgba(10, 132, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 1), 0 3px 10px -2px rgba(10, 132, 255, 0.3)"
                : "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 3px 8px -3px rgba(24, 24, 27, 0.25)",
              color: isLooping ? "#0a84ff" : "#27272a",
            }}
            className='h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-105 active:brightness-90 relative'>
            <HugeiconsIcon icon={RepeatIcon} size={18} strokeWidth={2.2} />
            {isLooping && (
              <span
                className='absolute bottom-1 w-1 h-1 rounded-full bg-[#0a84ff]'
                aria-hidden='true'
              />
            )}
          </motion.button>
        </div>

        {/* Right Arrow Button (→) - Dock Tile Style */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => paginate(1)}
          aria-label='Next Card'
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(24, 24, 27, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), 0 4px 10px -5px rgba(24, 24, 27, 0.25)",
            color: "#27272a",
          }}
          className='h-12 w-12 sm:h-13 sm:w-13 rounded-full flex items-center justify-center cursor-pointer transition-[filter] hover:brightness-105 active:brightness-90'>
          <HugeiconsIcon icon={ArrowRight02Icon} size={22} strokeWidth={2} />
        </motion.button>
      </div>
    </div>
  );
}
