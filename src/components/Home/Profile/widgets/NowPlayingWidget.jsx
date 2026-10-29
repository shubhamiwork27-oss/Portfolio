import React, { memo } from "react";
import GlassWidgetCard from "./GlassWidgetCard";
import { useMusic } from "../../../../context/MusicContext";
import { Play, Pause, Disc3, SkipBack, SkipForward, ArrowUpRight } from "lucide-react";

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function NowPlayingWidget({ onNavigateTab }) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progressPercent,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
  } = useMusic();

  const handleCardClick = () => {
    onNavigateTab?.("Music");
  };

  const handleSeekClick = (e) => {
    e.stopPropagation();
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const trackTitle = currentTrack?.title || "No Track";
  const trackArtist = currentTrack?.artist || "Unknown Artist";
  const trackArtwork = currentTrack?.artwork || "/profilephoto.png";

  return (
    <GlassWidgetCard
      onClick={handleCardClick}
      className="p-3.5 sm:p-4 flex flex-col justify-between h-full min-h-0 cursor-pointer group/widget transition-colors duration-200 hover:border-white/25"
    >
      {/* Header with animated equalizer bars & Open Music indicator */}
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 flex items-center gap-1.5 whitespace-nowrap">
          <Disc3
            size={11}
            className={`text-[#0A84FF] transition-transform ${
              isPlaying ? "animate-spin [animation-duration:3.5s]" : ""
            }`}
          />
          NOW PLAYING
        </span>

        <div className="flex items-center gap-2">
          {/* Dynamic Equalizer animation */}
          <div className="flex items-end gap-[2px] h-3 shrink-0">
            <span
              className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
                isPlaying ? "animate-[pulse_0.7s_ease-in-out_infinite] h-full" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
                isPlaying ? "animate-[pulse_0.9s_ease-in-out_0.2s_infinite] h-3/4" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
                isPlaying ? "animate-[pulse_0.6s_ease-in-out_0.4s_infinite] h-4/5" : "h-1 opacity-40"
              }`}
            />
            <span
              className={`w-[2px] bg-[#0A84FF] rounded-full transition-all duration-300 ${
                isPlaying ? "animate-[pulse_0.8s_ease-in-out_0.1s_infinite] h-1/2" : "h-1 opacity-40"
              }`}
            />
          </div>

          {/* Subtly animated Open Music hint */}
          <span className="text-[9.5px] font-medium text-white/40 group-hover/widget:text-[#0A84FF] flex items-center gap-0.5 transition-colors">
            <span className="hidden sm:inline">Open</span>
            <ArrowUpRight size={10} />
          </span>
        </div>
      </div>

      {/* Album Art & Title & Controls */}
      <div className="flex items-center gap-2.5 my-auto py-0.5">
        {/* Album Artwork thumbnail with hover play/pause */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-[38px] h-[38px] rounded-lg overflow-hidden shrink-0 relative group/art cursor-pointer border border-white/[0.15] shadow-sm flex items-center justify-center bg-zinc-900"
          title={isPlaying ? "Pause" : "Play"}
        >
          <img
            src={trackArtwork}
            alt={trackTitle}
            className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-300 group-hover/art:scale-110"
            draggable={false}
          />

          {/* Hover Play/Pause overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity z-20">
            {isPlaying ? (
              <Pause size={13} className="text-white fill-white" />
            ) : (
              <Play size={13} className="text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Song Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-[11.5px] font-semibold text-white/95 leading-tight truncate group-hover/widget:text-[#0A84FF] transition-colors">
            {trackTitle}
          </h4>
          <p className="text-[10px] text-white/50 truncate mt-0.5">
            {trackArtist}
          </p>
        </div>

        {/* Dynamic Controls: Prev, Play/Pause, Next */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevTrack();
            }}
            title="Previous track"
            aria-label="Previous track"
            className="w-5 h-5 rounded-full hover:bg-white/[0.14] text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
          >
            <SkipBack size={10} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-6 h-6 rounded-full bg-white/[0.10] hover:bg-white/[0.20] border border-white/[0.14] flex items-center justify-center text-white transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
          >
            {isPlaying ? (
              <Pause size={10} className="fill-white" />
            ) : (
              <Play size={10} className="fill-white ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            title="Next track"
            aria-label="Next track"
            className="w-5 h-5 rounded-full hover:bg-white/[0.14] text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
          >
            <SkipForward size={10} />
          </button>
        </div>
      </div>

      {/* Dynamic Progress Bar that tracks live playback and allows seeking */}
      <div className="space-y-1 pt-1.5 border-t border-white/[0.08] shrink-0">
        <div
          onClick={handleSeekClick}
          className="w-full h-1.5 bg-white/[0.10] hover:bg-white/[0.18] rounded-full overflow-hidden cursor-pointer relative group/bar transition-colors"
          title="Click to seek"
        >
          <div
            className="h-full bg-[#0A84FF] rounded-full transition-all duration-150 ease-linear shadow-[0_0_6px_#0A84FF]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-mono tabular-nums text-white/45">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </GlassWidgetCard>
  );
}

export default memo(NowPlayingWidget);
