import React, { useState, useEffect, memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { PROFILE_CONFIG } from "../config";
import { Play, Pause, Disc3 } from "lucide-react";

function NowPlayingWidget() {
  const { track, artist, durationSeconds, initialProgressPercent } =
    PROFILE_CONFIG.nowPlaying;

  const [isPlaying, setIsPlaying] = useState(true);
  const [seconds, setSeconds] = useState(
    Math.floor((durationSeconds * initialProgressPercent) / 100)
  );

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev >= durationSeconds ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, durationSeconds]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = Math.min(100, (seconds / durationSeconds) * 100);

  return (
    <GlassWidgetCard className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-0">
      {/* Header with animated equalizer bars */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 flex items-center gap-1.5 whitespace-nowrap">
          <Disc3 size={11} className={`text-[#0A84FF] ${isPlaying ? "animate-spin" : ""}`} />
          NOW PLAYING
        </span>

        {/* Dynamic Equalizer animation */}
        <div className="flex items-end gap-[2px] h-3 shrink-0">
          <span
            className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
              isPlaying ? "animate-[pulse_0.7s_ease-in-out_infinite] h-full" : "h-1 opacity-50"
            }`}
          />
          <span
            className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
              isPlaying ? "animate-[pulse_0.9s_ease-in-out_0.2s_infinite] h-3/4" : "h-1 opacity-50"
            }`}
          />
          <span
            className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
              isPlaying ? "animate-[pulse_0.6s_ease-in-out_0.4s_infinite] h-4/5" : "h-1 opacity-50"
            }`}
          />
          <span
            className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
              isPlaying ? "animate-[pulse_0.8s_ease-in-out_0.1s_infinite] h-1/2" : "h-1 opacity-50"
            }`}
          />
        </div>
      </div>

      {/* Album Art & Title */}
      <div className="flex items-center gap-2.5 my-auto py-0.5">
        {/* Generated gradient album-art tile */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-[38px] h-[38px] rounded-lg overflow-hidden shrink-0 relative group cursor-pointer border border-white/[0.15] shadow-sm flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #2b3a4a 0%, #151a24 55%, #080a0f 100%)",
          }}
        >
          <div className="absolute inset-1 rounded-full border border-white/[0.08]" />
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#0A84FF] to-sky-300 shadow-sm z-10" />

          {/* Hover Play/Pause overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            {isPlaying ? (
              <Pause size={12} className="text-white fill-white" />
            ) : (
              <Play size={12} className="text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Song Info & Controls */}
        <div className="min-w-0 flex-1">
          <h4 className="text-[11.5px] font-semibold text-white/95 leading-tight truncate">
            {track}
          </h4>
          <p className="text-[10px] text-white/50 truncate mt-0.5">
            {artist}
          </p>
        </div>

        {/* Small Play/Pause Toggle button */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-6 h-6 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.12] flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
        >
          {isPlaying ? (
            <Pause size={10} className="fill-white" />
          ) : (
            <Play size={10} className="fill-white ml-0.5" />
          )}
        </button>
      </div>

      {/* Progress Bar that actively advances */}
      <div className="space-y-1 pt-1.5 border-t border-white/[0.08] shrink-0">
        <div className="w-full h-1 bg-white/[0.1] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0A84FF] rounded-full transition-all duration-300 ease-linear shadow-[0_0_6px_#0A84FF]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-sans tabular-nums text-white/45">
          <span>{formatTime(seconds)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(NowPlayingWidget);
