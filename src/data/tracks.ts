import { cleanMetadataString } from "./id3Reader";

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

// 3. Glob optional JSON metadata files in the components/music/data folder
const jsonGlob = import.meta.glob(
  [
    "../components/music/data/*.json",
    "../components/music/data/**/*.json",
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
const jsonPaths = Object.keys(jsonGlob);

// Smart Recognition Knowledge Base (matched dynamically by song keywords / title, NEVER by hardcoded folder name)
interface SongMetadataTemplate {
  keywords: string[];
  title: string;
  artist: string;
  movie: string;
  whyILoveThis: string;
  moodTags: string[];
  spotifySearch?: string;
}

const RECOGNIZED_SONGS: SongMetadataTemplate[] = [
  {
    keywords: ["ramuloo", "ramulaa", "ramulo", "ramula"],
    title: "Ramuloo Ramulaa",
    artist: "Anurag Kulkarni, Mangli, Thaman S",
    movie: "Ala Vaikunthapurramuloo",
    whyILoveThis:
      "High-voltage acoustic groove, infectious folk hooks, and Thaman's electrifying rhythm section that dominates every celebration.",
    moodTags: ["High Energy", "Telugu Hit", "Folk Pop", "Celebration"],
    spotifySearch: "Ramuloo Ramulaa Ala Vaikunthapurramuloo",
  },
  {
    keywords: ["tum tum", "tumtum"],
    title: "Tum Tum",
    artist: "Thaman S, Sri Vardhini, Aditi Bhavaraju",
    movie: "Enemy",
    whyILoveThis:
      "Infectious rhythm, playful acoustic groove, and celebratory energy that instantly lifts your mood.",
    moodTags: ["Upbeat", "Dance", "Celebration", "Tamil Pop"],
    spotifySearch: "Tum Tum Enemy",
  },
  {
    keywords: ["verappa", "sai abhyankkar", "arivu", "karuppu"],
    title: "Verappa",
    artist: "Sai Abhyankkar, Arivu",
    movie: "Karuppu",
    whyILoveThis:
      "Soul-stirring brass hooks and gritty folk cadence delivered with powerhouse vocal chemistry.",
    moodTags: ["Acoustic", "Soulful", "Indie Folk", "Raw Energy"],
    spotifySearch: "Verappa Sai Abhyankkar",
  },
  {
    keywords: ["shambhu", "har har shambhu", "abhilipsa"],
    title: "Har Har Shambhu",
    artist: "Jeetu Sharma, Abhilipsa Panda",
    movie: "Shiv Stotram",
    whyILoveThis:
      "Electrifying devotional chant with powerful percussion and transcendental energy.",
    moodTags: ["Devotional", "Trance", "Spiritual", "Energy"],
    spotifySearch: "Har Har Shambhu",
  },
  {
    keywords: ["sanwle se kanha", "sanwle", "kanha"],
    title: "Sanwle Se Kanha",
    artist: "Swati Mishra, Nikhil Verma",
    movie: "Krishna Bhajan",
    whyILoveThis:
      "Soothing melody, soulful lyrics, and serene acoustic arrangement for quiet focus and reflection.",
    moodTags: ["Peaceful", "Acoustic", "Devotion", "Calm"],
    spotifySearch: "Sanwle Se Kanha",
  },
  {
    keywords: ["veera raja veera", "veera raja"],
    title: "Veera Raja Veera",
    artist: "A.R. Rahman, Shankar Mahadevan, KS Chithra",
    movie: "Ponniyin Selvan - 2",
    whyILoveThis:
      "Grand classical orchestration blended with timeless vocal depth and historical majesty.",
    moodTags: ["Classical", "Epic", "Soulful", "A.R. Rahman"],
    spotifySearch: "Veera Raja Veera",
  },
  {
    keywords: ["karuppane", "vaarumayya", "veeramanidasan"],
    title: "Karuppane Vaarumayya",
    artist: "Veeramanidasan",
    movie: "Village Folk",
    whyILoveThis:
      "Raw rural folk percussion with intense rustic energy, passion, and cultural roots.",
    moodTags: ["Folk", "High Tempo", "Traditional", "Rustic"],
    spotifySearch: "Karuppane Vaarumayya",
  },
  {
    keywords: ["naatu naatu", "naatu"],
    title: "Naatu Naatu",
    artist: "Rahul Sipligunj, Kaala Bhairava, M.M. Keeravani",
    movie: "RRR",
    whyILoveThis:
      "Unstoppable percussion, breathless pace, and historic Oscar-winning acoustic energy.",
    moodTags: ["Energetic", "Oscar Winner", "Dance", "High Tempo"],
    spotifySearch: "Naatu Naatu RRR",
  },
  {
    keywords: ["arabic kuthu", "halamithi habibo"],
    title: "Arabic Kuthu",
    artist: "Anirudh Ravichander, Jonita Gandhi",
    movie: "Beast",
    whyILoveThis:
      "Irresistible fusion of Arabic melodies and traditional South Indian kuthu beat.",
    moodTags: ["Dance", "Party", "Upbeat", "Anirudh"],
    spotifySearch: "Arabic Kuthu Beast",
  },
  {
    keywords: ["enjoy enjaami"],
    title: "Enjoy Enjaami",
    artist: "Dhee, Arivu, Santhosh Narayanan",
    movie: "Independent Single",
    whyILoveThis:
      "Stirring tribal rhythms celebrating nature, heritage, and soil with soulful vocals.",
    moodTags: ["Indie", "Folk", "Tribal", "Soulful"],
    spotifySearch: "Enjoy Enjaami",
  },
  {
    keywords: ["kesariya"],
    title: "Kesariya",
    artist: "Arijit Singh, Pritam",
    movie: "Brahmāstra",
    whyILoveThis:
      "Romantic acoustic melody with soaring orchestral lifts and soulful vocals.",
    moodTags: ["Romantic", "Melody", "Acoustic", "Soulful"],
    spotifySearch: "Kesariya Brahmastra",
  },
];

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
    artist: "Swati Mishra, Nikhil Verma",
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
    title: "Ramuloo Ramulaa",
    artist: "Anurag Kulkarni, Mangli, Thaman S",
    movie: "Ala Vaikunthapurramuloo",
    artwork:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200",
    url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=lofi-chill-medium-version-159456.mp3",
    whyILoveThis:
      "High-voltage acoustic groove, infectious folk hooks, and Thaman's electrifying rhythm section that dominates every celebration.",
    moodTags: ["High Energy", "Telugu Hit", "Folk Pop", "Celebration"],
    spotifyUrl: "https://open.spotify.com/search/Ramuloo%20Ramulaa%20Ala%20Vaikunthapurramuloo",
  },
];

// Intelligent filename parser to split artist, title, movie
function parseFilenameDetails(base: string): { title: string; artist?: string; movie?: string } {
  let cleaned = cleanMetadataString(base);

  // Pattern: Title (from "Movie") or Title (From Movie)
  const fromMatch = cleaned.match(/^(.*?)\s*[([](?:from|from movie|movie)\s*["']?([^"')\]]+)["']?[)\]]$/i);
  if (fromMatch) {
    return {
      title: cleanMetadataString(fromMatch[1]),
      movie: cleanMetadataString(fromMatch[2]),
    };
  }

  // Pattern: Artist - Title
  if (cleaned.includes(" - ")) {
    const parts = cleaned.split(" - ");
    if (parts.length >= 2) {
      return {
        artist: cleanMetadataString(parts[0]),
        title: cleanMetadataString(parts.slice(1).join(" - ")),
      };
    }
  }

  // Pattern: Track number prefix e.g. "01 Title"
  cleaned = cleaned.replace(/^\d+[\s._-]+/, "").trim();

  return { title: cleaned || "Custom Track" };
}

// Generate dynamic contextual mood tags for any arbitrary custom song
function generateContextualMoodTags(title: string, artist?: string): string[] {
  const text = `${title} ${artist || ""}`.toLowerCase();
  const tags: string[] = [];

  if (text.includes("dance") || text.includes("party") || text.includes("dj") || text.includes("beat")) {
    tags.push("Dance", "Party");
  }
  if (text.includes("love") || text.includes("dil") || text.includes("ishq") || text.includes("pyar") || text.includes("romance")) {
    tags.push("Romantic", "Melody");
  }
  if (text.includes("shambhu") || text.includes("shiv") || text.includes("krishna") || text.includes("bhajan") || text.includes("ram") || text.includes("stotram")) {
    tags.push("Devotional", "Spiritual");
  }
  if (text.includes("chill") || text.includes("lofi") || text.includes("relax") || text.includes("slow") || text.includes("peace")) {
    tags.push("Chill", "Lofi");
  }
  if (text.includes("folk") || text.includes("rustic") || text.includes("village") || text.includes("tribal")) {
    tags.push("Folk", "Acoustic");
  }

  if (tags.length === 0) {
    tags.push("Favorite", "Acoustic", "Atmospheric");
  } else {
    tags.push("Vibes", "On Repeat");
  }

  return Array.from(new Set(tags)).slice(0, 4);
}

// Build dynamic tracks from the data folder
const dynamicTracks: Track[] = audioPaths.map((audioPath, idx) => {
  const audioUrl = resolveAssetUrl(audioGlob[audioPath]);
  const base = getBaseName(audioPath);

  // Extract folder name if present (e.g. "song1", "song2", "song5")
  const pathParts = audioPath.split("/");
  const folderName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "";

  // 1. Check for custom JSON metadata file in same folder or with same base name
  let customMeta: Partial<Track> = {};
  const matchedJsonPath = jsonPaths.find((jp) => {
    if (folderName && jp.includes(`/${folderName}/`)) return true;
    return getBaseName(jp).toLowerCase() === base.toLowerCase();
  });
  if (matchedJsonPath && jsonGlob[matchedJsonPath]) {
    const rawJson = (jsonGlob[matchedJsonPath] as any)?.default || jsonGlob[matchedJsonPath];
    if (typeof rawJson === "object" && rawJson !== null) {
      customMeta = rawJson;
    }
  }

  // 2. Match image in same folder first, or by name, or fallback by index
  let matchedImgPath = imagePaths.find((p) => folderName && p.includes(`/${folderName}/`));
  if (!matchedImgPath) {
    const baseLower = base.toLowerCase();
    matchedImgPath = imagePaths.find((imgPath) => getBaseName(imgPath).toLowerCase() === baseLower);
  }
  if (!matchedImgPath && imagePaths[idx]) {
    matchedImgPath = imagePaths[idx];
  }
  const artworkUrl = matchedImgPath ? resolveAssetUrl(imageGlob[matchedImgPath]) : "";

  // 3. Parse and clean filename details
  const parsed = parseFilenameDetails(base);
  const searchBase = `${folderName} ${base} ${parsed.title}`.toLowerCase();

  // 4. Match against recognized smart knowledge base by song content
  const recognized = RECOGNIZED_SONGS.find((song) =>
    song.keywords.some((kw) => searchBase.includes(kw.toLowerCase()))
  );

  const title = customMeta.title || (recognized ? recognized.title : parsed.title);
  const artist = customMeta.artist || (recognized ? recognized.artist : (parsed.artist || "Independent Artist"));
  const movie = customMeta.movie || (recognized ? recognized.movie : (parsed.movie || "Featured Single"));
  const whyILoveThis =
    customMeta.whyILoveThis ||
    (recognized
      ? recognized.whyILoveThis
      : "A personal highlight from my playlist — memorable arrangement, standout vocals, and great production value.");
  const moodTags =
    customMeta.moodTags ||
    (recognized ? recognized.moodTags : generateContextualMoodTags(title, artist));

  // 5. Dynamic Spotify Link Generation
  // Formats search query intelligently with title, movie/album, and artist
  const spotifyQuery = customMeta.spotifyUrl
    ? ""
    : recognized?.spotifySearch || `${title} ${movie !== "Featured Single" ? movie : ""} ${artist !== "Independent Artist" ? artist : ""}`.trim();

  const spotifyUrl =
    customMeta.spotifyUrl ||
    `https://open.spotify.com/search/${encodeURIComponent(spotifyQuery || title)}`;

  return {
    id: String(idx + 1),
    title,
    artist,
    movie,
    artwork: artworkUrl || FALLBACK_TRACKS[idx % FALLBACK_TRACKS.length].artwork,
    url: audioUrl,
    whyILoveThis,
    moodTags,
    spotifyUrl,
  };
});

export const TRACKS: Track[] = dynamicTracks.length > 0 ? dynamicTracks : FALLBACK_TRACKS;

export const FAVORITE_ARTISTS: string[] = [
  "A.R. Rahman",
  "Thaman S",
  "Anirudh",
  "Sai Abhyankkar",
  "Shankar Mahadevan",
];
