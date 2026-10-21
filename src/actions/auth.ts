"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { createId } from "@paralleldrive/cuid2";
import { Temporal } from "temporal-polyfill";

import { db } from "@/prisma/db";
import { and, or, not } from "@prisma/orm-postgres/orm-client";
import { createSession, deleteSession } from "@/lib/session";
import { verifySession } from "@/lib/dal";
import { NAVIGATION_LINKS } from "@/constants";
import {
  LoginSchema,
  RegisterSchema,
  UpdatePasswordSchema,
  UpdateUsernameSchema,
} from "@/validation-schemas/auth";

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export const login = async (
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  const user = await db.orm.public.User.where({ email }).first();

  if (!user) {
    return { message: "Invalid email or password" };
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return { message: "Invalid email or password" };
  }

  await createSession(user.id);
  redirect(NAVIGATION_LINKS.home);
};

export const register = async (
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const validated = RegisterSchema.safeParse({
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, username, password } = validated.data;

  // Check uniqueness
  const existing = await db.orm.public.User.where((m) =>
    or(m.email.eq(email), m.username.eq(username)),
  ).first();

  if (existing) {
    if (existing.email === email) {
      return { errors: { email: ["This email is already registered"] } };
    }
    return { errors: { username: ["This username is already taken"] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.orm.public.User.create({
    id: createId(),
    email,
    username,
    passwordHash,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  // Create default TableSettings for the new user
  await db.orm.public.TableSettings.create({
    id: createId(),
    userId: user.id,
    showOriginalTitle: true,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  await createSession(user.id);
  redirect(NAVIGATION_LINKS.home);
};

export const logout = async (): Promise<void> => {
  await deleteSession();
  redirect(NAVIGATION_LINKS.login);
};

export const updateUsername = async (
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const { userId } = await verifySession();

  const validated = UpdateUsernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username } = validated.data;

  // Check if username is taken by another user
  const existing = await db.orm.public.User.where((m) =>
    and(m.username.eq(username), not(m.id.eq(userId))),
  ).first();

  if (existing) {
    return { errors: { username: ["This username is already taken"] } };
  }

  await db.orm.public.User.where({ id: userId }).update({
    username,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  return { message: "✅ Username updated successfully" };
};

export const updatePassword = async (
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> => {
  const { userId } = await verifySession();

  const validated = UpdatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validated.data;

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return { message: "User not found" };

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    return { errors: { currentPassword: ["Incorrect current password"] } };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.orm.public.User.where({ id: userId }).update({
    passwordHash,
    updatedAt: Temporal.Now.plainDateTimeISO(),
  });

  return { message: "✅ Password updated successfully" };
};
