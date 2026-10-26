"use server";

import { cache } from "react";
import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { Temporal } from "temporal-polyfill";

import { verifySession } from "@/lib/dal";
import { db } from "../prisma/db";
import type { Models } from "../prisma/contract";

export type ViewMode = Models.public_TableSettings["viewMode"];

export type SerializableTableSettings = {
  id: string;
  userId: string;
  showOriginalTitle: boolean;
  showPosterInTableRow: boolean;
  viewMode: ViewMode;
};

export type UpdateTableSettingsInput = Partial<
  Omit<SerializableTableSettings, "id" | "userId">
>;

export type TableSettings = SerializableTableSettings;

export const getTableSettings = cache(
  async (): Promise<SerializableTableSettings> => {
    const { userId } = await verifySession();

    const settings = await db.orm.public.TableSettings.where({
      userId,
    }).first();

    if (!settings) {
      const created = await db.orm.public.TableSettings.create({
        id: createId(),
        userId,
        showOriginalTitle: true,
        showPosterInTableRow: false,
        updatedAt: Temporal.Now.plainDateTimeISO(),
      });
      return {
        id: created.id,
        userId: created.userId,
        showOriginalTitle: created.showOriginalTitle,
        showPosterInTableRow: created.showPosterInTableRow,
        viewMode: created.viewMode,
      };
    }

    return {
      id: settings.id,
      userId: settings.userId,
      showOriginalTitle: settings.showOriginalTitle,
      showPosterInTableRow: settings.showPosterInTableRow,
      viewMode: settings.viewMode,
    };
  },
);

export const updateTableSettings = async (
  data: UpdateTableSettingsInput,
): Promise<SerializableTableSettings> => {
  const { userId } = await verifySession();

  const existing = await db.orm.public.TableSettings.where({ userId }).first();

  const settings = existing
    ? await db.orm.public.TableSettings.where({
        id: existing.id,
        userId,
      }).update({
        ...data,
        updatedAt: Temporal.Now.plainDateTimeISO(),
      })
    : await db.orm.public.TableSettings.create({
        ...data,
        id: createId(),
        userId,
        showOriginalTitle: true,
        showPosterInTableRow: false,
        updatedAt: Temporal.Now.plainDateTimeISO(),
      });

  if (!settings) {
    throw new Error("Failed to update table settings");
  }

  revalidatePath("/");
  return {
    id: settings.id,
    userId: settings.userId,
    showOriginalTitle: settings.showOriginalTitle,
    showPosterInTableRow: settings.showPosterInTableRow,
    viewMode: settings.viewMode,
  };
};
