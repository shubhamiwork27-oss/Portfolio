import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { TRACKS } from "../data/tracks";
import { fetchTrackId3 } from "../data/id3Reader";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState({});

  const audioRef = useRef(null);

  const baseTrack = TRACKS[trackIndex] || TRACKS[0];
  const live = liveMetadata[baseTrack?.id];

  const currentTrack = useMemo(() => {
    if (!baseTrack) return null;
    return {
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
  }, [baseTrack, live]);

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

  const togglePlay = useCallback(() => {
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
          setIsPlaying(false);
        });
    }
  }, [isPlaying]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  }, []);

  const paginate = useCallback((direction) => {
    setTrackIndex((prev) => (prev + direction + TRACKS.length) % TRACKS.length);
  }, []);

  const nextTrack = useCallback(() => {
    paginate(1);
  }, [paginate]);

  const prevTrack = useCallback(() => {
    paginate(-1);
  }, [paginate]);

  const selectTrack = useCallback(
    (index) => {
      if (index === trackIndex) {
        togglePlay();
        return;
      }
      setTrackIndex(index);
      setIsPlaying(true);
    },
    [trackIndex, togglePlay]
  );

  const seek = useCallback((newTime) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (isLooping) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } else {
      paginate(1);
    }
  }, [isLooping, paginate]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration || 0);
    }
  }, []);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const value = {
    tracks: TRACKS,
    trackIndex,
    setTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isLooping,
    setIsLooping,
    liveMetadata,
    progressPercent,
    togglePlay,
    play,
    pause,
    paginate,
    nextTrack,
    prevTrack,
    selectTrack,
    seek,
  };

  return (
    <MusicContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
        className="hidden"
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
