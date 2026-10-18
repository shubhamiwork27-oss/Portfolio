// Lightweight, zero-dependency in-browser ID3v2 tag parser
// Reads TIT2 (Title), TPE1 (Artist), TALB (Album/Movie), and APIC (Cover Art) from ArrayBuffer / Blob

export interface ParsedId3Tags {
  title?: string;
  artist?: string;
  album?: string;
  year?: string;
  artworkUrl?: string;
}

export function cleanMetadataString(str?: string): string {
  if (!str) return "";
  return str
    // remove leading/trailing non-word junk, null bytes
    .replace(/^[\s,.;:\-_]+|[\s,.;:\-_]+$/g, "")
    // remove URLs and domains
    .replace(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|in|net|org|co|xyz|info|io|biz|me)\b/gi, "")
    // remove promotional bracketed watermarks like (KoshalWorld.Com), [MassTamilan], (320kbps), etc.
    .replace(
      /\s*[([][^()\[\]]*(?:koshal|mass|tamil|pagal|dj|song|world|320|128|kbps|ringtone|download|remix|official|lyric|video|audio|full|free|hit|music)[^()\[\]]*[)\]]\s*/gi,
      " "
    )
    // remove trailing site tags like - MassTamilan or - Topic or - KoshalWorld
    .replace(
      /\s*-\s*(?:MassTamilan|Topic|KoshalWorld|PagalWorld|DJMaza|SongsPK|Sensongs|NaaSongs)\b/gi,
      ""
    )
    // remove stray brackets
    .replace(/[()[\]{}]/g, " ")
    // normalize spaces
    .replace(/\s+/g, " ")
    .trim();
}

export function parseId3Buffer(buffer: ArrayBuffer): ParsedId3Tags | null {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 10) return null;

  // Check ID3 header magic bytes: "ID3"
  if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return null;

  const version = bytes[3]; // 3 for ID3v2.3, 4 for ID3v2.4
  if (version !== 3 && version !== 4) return null;

  // Synchsafe integer for ID3 tag size (7 bits per byte)
  const tagSize =
    ((bytes[6] & 0x7f) << 21) |
    ((bytes[7] & 0x7f) << 14) |
    ((bytes[8] & 0x7f) << 7) |
    (bytes[9] & 0x7f);

  const maxOffset = Math.min(bytes.length, 10 + tagSize);
  let offset = 10;
  const result: ParsedId3Tags = {};

  const decodeText = (bodyBytes: Uint8Array): string => {
    if (!bodyBytes.length) return "";
    const encoding = bodyBytes[0];
    const data = bodyBytes.subarray(1);
    try {
      if (encoding === 0 || encoding === 3) {
        return new TextDecoder(encoding === 0 ? "iso-8859-1" : "utf-8")
          .decode(data)
          .replace(/\0+$/, "")
          .trim();
      } else if (encoding === 1 || encoding === 2) {
        return new TextDecoder("utf-16le")
          .decode(data)
          .replace(/\0+$/, "")
          .trim();
      }
    } catch {
      return "";
    }
    return "";
  };

  while (offset + 10 <= maxOffset) {
    const frameId = String.fromCharCode(
      bytes[offset],
      bytes[offset + 1],
      bytes[offset + 2],
      bytes[offset + 3]
    );

    // Frame IDs are 4 uppercase alphanumeric characters
    if (!/^[A-Z0-9]{4}$/.test(frameId)) break;

    let frameSize = 0;
    if (version === 4) {
      // v2.4 synchsafe
      frameSize =
        ((bytes[offset + 4] & 0x7f) << 21) |
        ((bytes[offset + 5] & 0x7f) << 14) |
        ((bytes[offset + 6] & 0x7f) << 7) |
        (bytes[offset + 7] & 0x7f);
    } else {
      // v2.3 standard 32-bit uint
      frameSize =
        (bytes[offset + 4] << 24) |
        (bytes[offset + 5] << 16) |
        (bytes[offset + 6] << 8) |
        bytes[offset + 7];
    }

    if (frameSize <= 0 || offset + 10 + frameSize > maxOffset) break;
    const body = bytes.subarray(offset + 10, offset + 10 + frameSize);
    offset += 10 + frameSize;

    if (frameId === "TIT2") {
      const title = cleanMetadataString(decodeText(body));
      if (title) result.title = title;
    } else if (frameId === "TPE1") {
      const artist = cleanMetadataString(decodeText(body));
      if (artist) result.artist = artist;
    } else if (frameId === "TALB") {
      const album = cleanMetadataString(decodeText(body));
      if (album) result.album = album;
    } else if (frameId === "TYER" || frameId === "TDRC") {
      const year = decodeText(body).substring(0, 4);
      if (year) result.year = year;
    } else if (frameId === "APIC" && !result.artworkUrl && typeof window !== "undefined") {
      try {
        // Parse APIC: [encoding (1B)][mimeType (null-terminated)][pictureType (1B)][desc (null-terminated)][data]
        let p = 1;
        while (p < body.length && body[p] !== 0) p++;
        const mime = new TextDecoder("ascii").decode(body.subarray(1, p)) || "image/jpeg";
        p++; // skip null
        p++; // skip pictureType (1 byte)
        while (p < body.length && body[p] !== 0) p++;
        p++; // skip null
        const imgData = body.subarray(p);
        if (imgData.length > 512) {
          const blob = new Blob([imgData], { type: mime });
          result.artworkUrl = URL.createObjectURL(blob);
        }
      } catch {
        // ignore APIC parse errors
      }
    }
  }

  return result;
}

export async function fetchTrackId3(url: string): Promise<ParsedId3Tags | null> {
  try {
    // Read the first 64KB where ID3 header and metadata reside
    const res = await fetch(url, {
      headers: { Range: "bytes=0-65535" },
    });
    if (!res.ok && res.status !== 206) return null;
    const buffer = await res.arrayBuffer();
    return parseId3Buffer(buffer);
  } catch {
    return null;
  }
}

