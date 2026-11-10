export type PosterSize = "original" | "preview" | "x96" | "x48";

const SHIKIMORI_HOST = "shikimori.io";

/**
 * Shikimori serves the same poster in several sizes by path segment:
 * /system/animes/original/1.jpg -> /system/animes/x96/1.jpg
 * URLs from other hosts, or in an unexpected format, are returned unchanged.
 */
export const getPosterUrl = (url: string, size: PosterSize): string => {
  if (size === "original") return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== SHIKIMORI_HOST) return url;
    if (!/\/original\//.test(parsed.pathname)) return url;

    parsed.pathname = parsed.pathname.replace("/original/", `/${size}/`);
    return parsed.toString();
  } catch {
    return url;
  }
};
