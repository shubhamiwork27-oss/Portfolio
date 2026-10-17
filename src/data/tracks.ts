export interface Track {
  id: string;
  title: string;
  artist: string;
  movie?: string;
  artwork: string;
  url: string;
  whyILoveThis: string;
  moodTags: string[];
  spotifyUrl: string;
}

// Helper to resolve asset URLs from Vite's import.meta.glob
function resolveAssetUrl(mod: any): string {
  if (!mod) return "";
  if (typeof mod === "string") return mod;
  if (mod.src && typeof mod.src === "string") return mod.src;
  if (mod.default) {
    if (typeof mod.default === "string") return mod.default;
    if (mod.default.src && typeof mod.default.src === "string") return mod.default.src;
  }
  return "";
}

function getBaseName(path: string): string {
  const filename = path.split("/").pop() || "";
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex > -1 ? filename.substring(0, dotIndex) : filename;
}

// 1. Glob all audio files in the components/music/data folder
const audioGlob = import.meta.glob(
  [
    "../components/music/data/*.{mp3,wav,ogg,m4a,aac,flac,MP3,WAV,OGG,M4A,AAC,FLAC}",
    "../components/music/data/**/*.{mp3,wav,ogg,m4a,aac,flac,MP3,WAV,OGG,M4A,AAC,FLAC}",
  ],
  { eager: true }
);

// 2. Glob all image files in the components/music/data folder
const imageGlob = import.meta.glob(
  [
    "../components/music/data/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP,AVIF,GIF,SVG}",
    "../components/music/data/**/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP,AVIF,GIF,SVG}",
  ],
  { eager: true }
);

// Sort paths naturally so folders/files are in consistent order
const audioPaths = Object.keys(audioGlob).sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
);
const imagePaths = Object.keys(imageGlob).sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
);

// Curated metadata dictionary matching folder names or song base names
const CURATED_METADATA: Record<string, Partial<Track>> = {
  song1: {
    title: "Tum Tum",
    artist: "Thaman S, Sri Vardhini, Aditi Bhavaraju",
    movie: "Enemy",
    whyILoveThis:
      "Infectious rhythm, playful acoustic groove, and celebratory energy that instantly lifts your mood.",
    moodTags: ["Upbeat", "Dance", "Celebration", "Tamil Pop"],
    spotifyUrl: "https://open.spotify.com/search/Tum%20Tum%20Enemy",
  },
  song2: {
    title: "Veera Raja Veera",
    artist: "A.R. Rahman, Shankar Mahadevan, KS Chithra",
    movie: "Ponniyin Selvan - 2",
    whyILoveThis:
      "Grand classical orchestration blended with timeless vocal depth and historical majesty.",
    moodTags: ["Classical", "Epic", "Soulful", "A.R. Rahman"],
    spotifyUrl: "https://open.spotify.com/search/Veera%20Raja%20Veera",
  },
  song3: {
    title: "Har Har Shambhu",
    artist: "Jeetu Sharma, Abhilipsa Panda",
    movie: "Shiv Stotram",
    whyILoveThis:
      "Electrifying devotional chant with powerful percussion and transcendental energy.",
    moodTags: ["Devotional", "Trance", "Spiritual", "Energy"],
    spotifyUrl: "https://open.spotify.com/search/Har%20Har%20Shambhu",
  },
  song4: {
    title: "Sanwle Se Kanha",
    artist: "Swati Mishra",
    movie: "Krishna Bhajan",
    whyILoveThis:
      "Soothing melody, soulful lyrics, and serene acoustic arrangement for quiet focus and reflection.",
    moodTags: ["Peaceful", "Acoustic", "Devotion", "Calm"],
    spotifyUrl: "https://open.spotify.com/search/Sanwle%20Se%20Kanha",
  },
  song5: {
    title: "Karuppane Vaarumayya",
    artist: "Veeramanidasan",
    movie: "Village Folk",
    whyILoveThis:
      "Raw rural folk percussion with intense rustic energy, passion, and cultural roots.",
    moodTags: ["Folk", "High Tempo", "Traditional", "Rustic"],
    spotifyUrl: "https://open.spotify.com/search/Karuppane%20Vaarumayya",
  },
};

// Fallback tracks in case audio files aren't loaded or available
export const FALLBACK_TRACKS: Track[] = [
  {
    id: "1",
    title: "Tum Tum",
    artist: "Thaman S, Sri Vardhini",
    movie: "Enemy",
    artwork:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    whyILoveThis:
      "Infectious rhythm, playful acoustic groove, and celebratory energy that instantly lifts your mood.",
    moodTags: ["Upbeat", "Dance", "Celebration", "Tamil Pop"],
    spotifyUrl: "https://open.spotify.com/search/Tum%20Tum%20Enemy",
  },
  {
    id: "2",
    title: "Veera Raja Veera",
    artist: "A.R. Rahman, Shankar Mahadevan",
    movie: "Ponniyin Selvan - 2",
    artwork:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3",
    whyILoveThis:
      "Grand classical orchestration blended with timeless vocal depth and historical majesty.",
    moodTags: ["Classical", "Epic", "Soulful", "A.R. Rahman"],
    spotifyUrl: "https://open.spotify.com/search/Veera%20Raja%20Veera",
  },
  {
    id: "3",
    title: "Har Har Shambhu",
    artist: "Jeetu Sharma, Abhilipsa Panda",
    movie: "Shiv Stotram",
    artwork:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3",
    whyILoveThis:
      "Electrifying devotional chant with powerful percussion and transcendental energy.",
    moodTags: ["Devotional", "Trance", "Spiritual", "Energy"],
    spotifyUrl: "https://open.spotify.com/search/Har%20Har%20Shambhu",
  },
  {
    id: "4",
    title: "Sanwle Se Kanha",
    artist: "Swati Mishra",
    movie: "Krishna Bhajan",
    artwork:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c230e17d04.mp3?filename=relaxing-mountains-nature-walk-112191.mp3",
    whyILoveThis:
      "Soothing melody, soulful lyrics, and serene acoustic arrangement for quiet focus and reflection.",
    moodTags: ["Peaceful", "Acoustic", "Devotion", "Calm"],
    spotifyUrl: "https://open.spotify.com/search/Sanwle%20Se%20Kanha",
  },
  {
    id: "5",
    title: "Karuppane Vaarumayya",
    artist: "Veeramanidasan",
    movie: "Village Folk",
    artwork:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-version-159456.mp3",
    whyILoveThis:
      "Raw rural folk percussion with intense rustic energy, passion, and cultural roots.",
    moodTags: ["Folk", "High Tempo", "Traditional", "Rustic"],
    spotifyUrl: "https://open.spotify.com/search/Karuppane%20Vaarumayya",
  },
];

// Build dynamic tracks from the data folder
const dynamicTracks: Track[] = audioPaths.map((audioPath, idx) => {
  const audioUrl = resolveAssetUrl(audioGlob[audioPath]);
  const base = getBaseName(audioPath);

  // Extract folder name if present (e.g. "song1", "song2")
  const pathParts = audioPath.split("/");
  const folderName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "";

  // Match image in same folder first, or by name, or fallback by index
  let matchedImgPath = imagePaths.find((p) => folderName && p.includes(`/${folderName}/`));
  if (!matchedImgPath) {
    const baseLower = base.toLowerCase();
    matchedImgPath = imagePaths.find((imgPath) => getBaseName(imgPath).toLowerCase() === baseLower);
  }
  if (!matchedImgPath && imagePaths[idx]) {
    matchedImgPath = imagePaths[idx];
  }

  const artworkUrl = matchedImgPath ? resolveAssetUrl(imageGlob[matchedImgPath]) : "";
  const curated = CURATED_METADATA[folderName] || CURATED_METADATA[`song${idx + 1}`] || {};

  return {
    id: String(idx + 1),
    title: curated.title || base.replace(/[-_]+/g, " ").trim() || `Track ${idx + 1}`,
    artist: curated.artist || "Independent Artist",
    movie: curated.movie || "Featured Single",
    artwork: artworkUrl || FALLBACK_TRACKS[idx % FALLBACK_TRACKS.length].artwork,
    url: audioUrl,
    whyILoveThis:
      curated.whyILoveThis ||
      "A personal highlight from my library — memorable arrangement and timeless production.",
    moodTags: curated.moodTags || ["Favorite", "Acoustic", "Atmospheric"],
    spotifyUrl: curated.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(curated.title || base)}`,
  };
});

export const TRACKS: Track[] = dynamicTracks.length > 0 ? dynamicTracks : FALLBACK_TRACKS;

export const FAVORITE_ARTISTS: string[] = [
  "A.R. Rahman",
  "Thaman S",
  "Anirudh",
  "Veeramanidasan",
  "Shankar Mahadevan",
];

