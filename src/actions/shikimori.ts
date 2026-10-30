"use server";

import { revalidatePath } from "next/cache";
import { Temporal } from "temporal-polyfill";

import { verifySession } from "@/lib/dal";
import { db } from "../prisma/db";
import { getMyAnimeList } from "./anime";

const SHIKIMORI_API_BASE = "https://shikimori.one/api";
const SHIKIMORI_IMAGE_ORIGIN = "https://shikimori.io";
const USER_AGENT = process.env.SHIKIMORI_USER_AGENT || "AnimeTrackerApp";
const SEARCH_LIMIT = 15;
const SYNC_REQUEST_DELAY_MS = 300;
const SYNC_BATCH_LIMIT = 40;

type ShikimoriApiAnime = {
  id: number;
  name: string;
  russian: string | null;
  image: {
    original: string | null;
    preview: string | null;
    x96: string | null;
    x48: string | null;
  };
  url: string;
  kind: string;
  score: string;
  status: string;
  episodes: number;
  episodes_aired: number;
  aired_on: string | null;
  released_on: string | null;
};

export type ShikimoriSearchResult = {
  shikimoriId: number;
  title: string;
  originalTitle: string;
  posterUrl: string | null;
  thumbnailUrl: string | null;
  episodes: number;
  seasonOrdinal: number;
  year: number | null;
  kind: string;
};

export type SyncPostersResult = {
  total: number;
  synced: number;
  notFound: number;
  failed: number;
  remaining: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchShikimori = async <T>(
  path: string,
  params: Record<string, string | number>,
): Promise<T> => {
  const url = new URL(`${SHIKIMORI_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach Shikimori. Check your connection and try again.",
    );
  }

  if (res.status === 429) {
    throw new Error("Shikimori rate limit reached. Please try again shortly.");
  }

  if (!res.ok) {
    throw new Error(`Shikimori request failed (${res.status}).`);
  }

  return (await res.json()) as T;
};

const toAbsoluteImageUrl = (relativePath?: string | null): string | null => {
  if (!relativePath) return null;
  return `${SHIKIMORI_IMAGE_ORIGIN}${relativePath}`;
};

const parseSeasonOrdinal = (name: string): number => {
  const text = name.trim();

  let match = text.match(/(\d+)[-\s]?(?:й|ый|ой)?\s*сезон/i);
  if (match) return parseInt(match[1], 10);

  match = text.match(/season\s+(\d+)/i);
  if (match) return parseInt(match[1], 10);

  match = text.match(/(\d+)(?:st|nd|rd|th)\s+season/i);
  if (match) return parseInt(match[1], 10);

  const romanMatch = text.match(/\s(I{1,3}|IV|V)\s*$/);
  const ROMAN_NUMERALS: Record<string, number> = { II: 2, III: 3, IV: 4, V: 5 };
  if (romanMatch && ROMAN_NUMERALS[romanMatch[1]]) {
    return ROMAN_NUMERALS[romanMatch[1]];
  }

  match = text.match(/\s(\d{1,2})\s*$/);
  if (match) return parseInt(match[1], 10);

  return 1;
};

const stripSeasonMarkers = (text: string): string => {
  return text
    .replace(/\d+[-\s]?(?:й|ый|ой)?\s*сезон/gi, "")
    .replace(/season\s*\d+/gi, "")
    .replace(/\d+(?:st|nd|rd|th)\s+season/gi, "")
    .replace(/\bfinal season\b/gi, "")
    .replace(/\s(I{1,3}|IV|V)\s*$/i, "")
    .replace(/\s\d{1,2}\s*$/, "")
    .replace(/[:\-–—]\s*$/, "")
    .trim()
    .toLowerCase();
};

const isLikelyMatch = (candidateTitle: string, queryTitle: string): boolean => {
  const a = stripSeasonMarkers(candidateTitle);
  const b = stripSeasonMarkers(queryTitle);
  if (!a || !b) return false;
  return a.includes(b) || b.includes(a) || a.slice(0, 4) === b.slice(0, 4);
};

const normalizeResult = (raw: ShikimoriApiAnime): ShikimoriSearchResult => {
  const title = raw.russian?.trim() || raw.name;
  const nameForSeasonParsing = raw.russian?.trim() || raw.name;

  return {
    shikimoriId: raw.id,
    title,
    originalTitle: raw.name,
    posterUrl: toAbsoluteImageUrl(raw.image?.original),
    thumbnailUrl: toAbsoluteImageUrl(raw.image?.preview || raw.image?.x96),
    episodes: raw.episodes || raw.episodes_aired || 0,
    seasonOrdinal: parseSeasonOrdinal(nameForSeasonParsing),
    year: raw.aired_on ? parseInt(raw.aired_on.slice(0, 4), 10) || null : null,
    kind: raw.kind,
  };
};

const pickBestCandidate = (
  candidates: ShikimoriSearchResult[],
  targetSeason: number,
): ShikimoriSearchResult | null => {
  if (candidates.length === 0) return null;

  const exact = candidates.find((c) => c.seasonOrdinal === targetSeason);
  if (exact) return exact;

  const base = candidates.find((c) => c.seasonOrdinal === 1);
  if (base) return base;

  return candidates[0];
};

export const searchShikimoriAnime = async (
  query: string,
): Promise<ShikimoriSearchResult[]> => {
  await verifySession();

  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const raw = await fetchShikimori<ShikimoriApiAnime[]>("/animes", {
    search: trimmed,
    limit: SEARCH_LIMIT,
  });

  return raw.map(normalizeResult);
};

export const findShikimoriPosterMatch = async (
  title: string,
  season: number,
): Promise<ShikimoriSearchResult | null> => {
  await verifySession();

  const cleanTitle = title.trim();
  if (!cleanTitle) return null;

  const targetSeason = Math.max(1, Math.round(season) || 1);

  const candidates = await searchShikimoriAnime(cleanTitle);
  const filtered = candidates.filter(
    (c) =>
      isLikelyMatch(c.title, cleanTitle) ||
      isLikelyMatch(c.originalTitle, cleanTitle),
  );
  const pool = filtered.length > 0 ? filtered : candidates;

  return pickBestCandidate(pool, targetSeason);
};

export const syncAllPosters = async (): Promise<SyncPostersResult> => {
  const { userId } = await verifySession();

  const all = await getMyAnimeList();
  const missing = all.filter((a) => !a.posterUrl);
  const targets = missing.slice(0, SYNC_BATCH_LIMIT);

  let synced = 0;
  let notFound = 0;
  let failed = 0;

  for (const anime of targets) {
    try {
      const match = await findShikimoriPosterMatch(anime.title, anime.season);
      if (match?.posterUrl) {
        await db.orm.public.Anime.where({ id: anime.id, userId }).update({
          posterUrl: match.posterUrl,
          updatedAt: Temporal.Now.plainDateTimeISO(),
        });
        synced++;
      } else {
        notFound++;
      }
    } catch {
      failed++;
    }

    await sleep(SYNC_REQUEST_DELAY_MS);
  }

  if (synced > 0) {
    revalidatePath("/");
  }

  return {
    total: targets.length,
    synced,
    notFound,
    failed,
    remaining: Math.max(0, missing.length - targets.length),
  };
};
