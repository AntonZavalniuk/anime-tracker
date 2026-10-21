import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { NAVIGATION_LINKS } from "@/constants";
import { db } from "@/prisma/db";

export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    redirect(NAVIGATION_LINKS.login);
  }

  return { userId: session.userId };
});

export const redirectIfAuthenticated = async () => {
  const session = await getSession();

  if (session?.userId) {
    redirect(NAVIGATION_LINKS.home);
  }
};

export const AuthCheck = async () => {
  await redirectIfAuthenticated();
  return null;
};

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await db.orm.public.User.where({ id: session.userId }).first();
  if (!user) return null;

  const { id, email, username } = user;
  return { id, email, username };
});

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof getCurrentUser>>
>;
