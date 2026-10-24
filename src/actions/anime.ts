"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { Temporal } from "temporal-polyfill";
import { and, or } from "@prisma/orm-postgres/orm-client";

import { verifySession } from "@/lib/dal";
import { db } from "../prisma/db";
import type { Models } from "../prisma/contract";

export type AnimeStatus = Models.public_Anime["status"];

const ANIME_STATUSES = [
  "AIRING",
  "COMPLETED",
  "UPCOMING",
] as const satisfies readonly AnimeStatus[];

const isAnimeStatus = (value: unknown): value is AnimeStatus => {
  return (
    typeof value === "string" &&
    (ANIME_STATUSES as readonly string[]).includes(value)
  );
};

export type FilterableAnime = {
  id: string;
  title: string;
  originalTitle: string | null;
  season: number;
  episode: number;
  episodes: number;
  status: AnimeStatus;
  posterUrl: string | null;
};

export type AnimeCounts = {
  ALL: number;
  AIRING: number;
  COMPLETED: number;
  UPCOMING: number;
};

export type GetAnimeBatchParams = {
  offset?: number;
  limit?: number;
  status?: AnimeStatus | "ALL";
  query?: string;
};

export type AnimeBatchResult = {
  items: FilterableAnime[];
  nextOffset: number | null;
  hasMore: boolean;
};

export type UpdateAnimeInput = {
  title: string;
  originalTitle: string | null;
  posterUrl?: string | null;
  season: number;
  episode: number;
  episodes: number;
  status: AnimeStatus;
};

export type ImportAnimeInput = {
  title: string;
  originalTitle?: string | null;
  posterUrl?: string | null;
  season?: number;
  episode?: number;
  episodes?: number;
  status?: AnimeStatus;
};

export const getMyAnimeList = cache(async () => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.where({ userId })
    .orderBy((m) => m.title.asc())
    .all();

  return anime;
});

export type Anime = Awaited<ReturnType<typeof getMyAnimeList>>[number];

export const getAnimeCounts = cache(async (): Promise<AnimeCounts> => {
  const { userId } = await verifySession();

  const groups = await db.orm.public.Anime.where({ userId })
    .groupBy("status")
    .aggregate((a) => ({ count: a.count() }));

  const counts: AnimeCounts = {
    ALL: 0,
    AIRING: 0,
    COMPLETED: 0,
    UPCOMING: 0,
  };

  for (const group of groups) {
    const status = group.status as AnimeStatus;
    if (status in counts) {
      counts[status] = group.count;
      counts.ALL += group.count;
    }
  }

  return counts;
});

export const getAnimeBatch = async ({
  offset = 0,
  limit = 25,
  status = "ALL",
  query = "",
}: GetAnimeBatchParams = {}): Promise<AnimeBatchResult> => {
  const { userId } = await verifySession();

  const cleanQuery = query.trim();

  const baseCollection = db.orm.public.Anime.where((m) => {
    const conditions = [m.userId.eq(userId)];

    if (status && status !== "ALL") {
      conditions.push(m.status.eq(status));
    }

    if (cleanQuery) {
      const q = `%${cleanQuery}%`;
      conditions.push(or(m.title.ilike(q), m.originalTitle.ilike(q)));
    }

    return and(...conditions);
  });

  const rows = await baseCollection
    .orderBy((m) => m.title.asc())
    .offset(offset)
    .limit(limit + 1)
    .all();

  const hasMore = rows.length > limit;
  const items: FilterableAnime[] = (hasMore ? rows.slice(0, limit) : rows).map(
    (item) => ({
      id: item.id,
      title: item.title,
      originalTitle: item.originalTitle,
      season: item.season,
      episode: item.episode,
      episodes: item.episodes,
      status: item.status,
      posterUrl: item.posterUrl,
    }),
  );

  return {
    items,
    nextOffset: hasMore ? offset + limit : null,
    hasMore,
  };
};

export const addNewAnime = async (
  data: UpdateAnimeInput,
): Promise<FilterableAnime> => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.create({
    ...data,
    id: createId(),
    userId,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  revalidatePath("/");
  return {
    id: anime.id,
    title: anime.title,
    originalTitle: anime.originalTitle,
    season: anime.season,
    episode: anime.episode,
    episodes: anime.episodes,
    status: anime.status,
    posterUrl: anime.posterUrl,
  };
};

export const updateAnime = async (
  id: string,
  data: UpdateAnimeInput,
): Promise<FilterableAnime> => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.where({ id, userId }).update({
    ...data,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  if (!anime) {
    throw new Error("Anime not found or unauthorized");
  }

  revalidatePath("/");
  return {
    id: anime.id,
    title: anime.title,
    originalTitle: anime.originalTitle,
    season: anime.season,
    episode: anime.episode,
    episodes: anime.episodes,
    status: anime.status,
    posterUrl: anime.posterUrl,
  };
};

export const deleteAnime = async (id: string) => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.where({ id, userId }).delete();

  if (!anime) {
    throw new Error("Anime not found or unauthorized");
  }

  revalidatePath("/");
  return { id: anime.id, success: true };
};

export const updateAnimeEpisode = async (id: string, newEpisode: number) => {
  const { userId } = await verifySession();

  const clampedEpisode = Math.max(0, newEpisode);

  const updated = await db.orm.public.Anime.where({ id, userId }).update({
    episode: clampedEpisode,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  if (!updated) {
    throw new Error("Anime not found or unauthorized");
  }

  revalidatePath("/");
  return { id: updated.id, episode: updated.episode };
};

export const exportAnimeList = async (): Promise<ImportAnimeInput[]> => {
  const { userId } = await verifySession();

  const rows = await db.orm.public.Anime.where({ userId })
    .orderBy((m) => m.title.asc())
    .all();

  return rows.map((item) => ({
    title: item.title,
    originalTitle: item.originalTitle,
    posterUrl: item.posterUrl,
    season: item.season,
    episode: item.episode,
    episodes: item.episodes,
    status: item.status,
  }));
};

export const importAnimeList = async (
  items: ImportAnimeInput[],
  duplicateMode: "skip" | "overwrite" = "skip",
) => {
  const { userId } = await verifySession();

  let createdCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    if (!item.title || typeof item.title !== "string" || !item.title.trim()) {
      continue;
    }

    const cleanTitle = item.title.trim();
    const validStatus: AnimeStatus = isAnimeStatus(item.status)
      ? item.status
      : "AIRING";

    const payload = {
      title: cleanTitle,
      originalTitle: item.originalTitle?.trim() || null,
      posterUrl: item.posterUrl?.trim() || null,
      season:
        typeof item.season === "number" && item.season > 0 ? item.season : 1,
      episode:
        typeof item.episode === "number" && item.episode >= 0
          ? item.episode
          : 0,
      episodes:
        typeof item.episodes === "number" && item.episodes >= 0
          ? item.episodes
          : 0,
      status: validStatus,
    };

    const existing = await db.orm.public.Anime.where({
      title: cleanTitle,
    }).first();

    if (existing) {
      if (duplicateMode === "overwrite") {
        await db.orm.public.Anime.where({ id: existing.id }).update({
          ...payload,
          updatedAt: Temporal.Now.plainDateTimeISO(),
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    } else {
      await db.orm.public.Anime.create({
        ...payload,
        id: createId(),
        userId,
        updatedAt: Temporal.Now.plainDateTimeISO(),
      });
      createdCount++;
    }
  }

  revalidatePath("/");
  return { createdCount, updatedCount, skippedCount, total: items.length };
};
