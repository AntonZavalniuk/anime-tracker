"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { Temporal } from "temporal-polyfill";

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

type UpdateAnimeInput = {
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

export const addNewAnime = async (data: UpdateAnimeInput) => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.create({
    ...data,
    id: createId(),
    userId,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  revalidatePath("/");
  return anime;
};

export const updateAnime = async (id: string, data: UpdateAnimeInput) => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.where({ id, userId }).update({
    ...data,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  revalidatePath("/");
  return anime;
};

export const deleteAnime = async (id: string) => {
  const { userId } = await verifySession();

  const anime = await db.orm.public.Anime.where({ id, userId }).delete();

  revalidatePath("/");
  return anime;
};

export const updateAnimeEpisode = async (id: string, newEpisode: number) => {
  const { userId } = await verifySession();

  const clampedEpisode = Math.max(0, newEpisode);

  const updated = await db.orm.public.Anime.where({ id, userId }).update({
    episode: clampedEpisode,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  revalidatePath("/");
  return updated;
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
