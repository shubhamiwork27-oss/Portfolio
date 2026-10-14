// Helper to resolve asset URLs from Vite's import.meta.glob
function resolveAssetUrl(mod) {
  if (!mod) return "";
  if (typeof mod === "string") return mod;
  if (mod.src && typeof mod.src === "string") return mod.src;
  if (mod.default) {
    if (typeof mod.default === "string") return mod.default;
    if (mod.default.src && typeof mod.default.src === "string") return mod.default.src;
  }
  return "";
}

function getBaseName(path) {
  const filename = path.split("/").pop() || "";
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex > -1 ? filename.substring(0, dotIndex) : filename;
}

function formatTitle(base) {
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// 1. Glob all audio files in the data folder
const audioGlob = import.meta.glob(
  [
    "./data/*.{mp3,wav,ogg,m4a,aac,flac,MP3,WAV,OGG,M4A,AAC,FLAC}",
    "./data/**/*.{mp3,wav,ogg,m4a,aac,flac,MP3,WAV,OGG,M4A,AAC,FLAC}"
  ],
  { eager: true }
);

// 2. Glob all image files in the data folder
const imageGlob = import.meta.glob(
  [
    "./data/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP,AVIF,GIF,SVG}",
    "./data/**/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP,AVIF,GIF,SVG}"
  ],
  { eager: true }
);

// Natural sort so e.g. "1.mp3", "2.mp3", "10.mp3" sort in numerical order
const audioPaths = Object.keys(audioGlob).sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
);
const imagePaths = Object.keys(imageGlob).sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
);

// Build dynamic tracks from the data folder
const dynamicTracks = audioPaths.map((audioPath, idx) => {
  const audioUrl = resolveAssetUrl(audioGlob[audioPath]);
  const base = getBaseName(audioPath);

  // Match image by same base filename (case-insensitive)
  const baseLower = base.toLowerCase();
  let matchedImgPath = imagePaths.find(
    (imgPath) => getBaseName(imgPath).toLowerCase() === baseLower
  );

  // If not matched by name, pair by corresponding index in image list
  if (!matchedImgPath && imagePaths[idx]) {
    matchedImgPath = imagePaths[idx];
  }

  const artworkUrl = matchedImgPath ? resolveAssetUrl(imageGlob[matchedImgPath]) : "";

  return {
    id: String(idx + 1),
    title: formatTitle(base) || `Track ${idx + 1}`,
    artwork: artworkUrl,
    url: audioUrl,
  };
});

// Fallback tracks in case data folder is not yet loaded
const fallbackTracks = [
  {
    id: "1",
    title: "Midnight City",
    artwork:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
  },
  {
    id: "2",
    title: "Cosmic Serenade",
    artwork:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3",
  },
  {
    id: "3",
    title: "Silent Horizon",
    artwork:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3",
  },
  {
    id: "4",
    title: "Neon Starlight",
    artwork:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c230e17d04.mp3?filename=relaxing-mountains-nature-walk-112191.mp3",
  },
  {
    id: "5",
    title: "Abstract Waves",
    artwork:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-version-159456.mp3",
  },
];

export const TRACKS = dynamicTracks.length > 0 ? dynamicTracks : fallbackTracks;
