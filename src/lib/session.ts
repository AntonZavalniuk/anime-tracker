import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_DURATION_MS } from "@/constants";

export interface SessionPayload {
  userId: string;
  expiresAt: Date;
}

const getSecretKey = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret)
    throw new Error("SESSION_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
};

// ─── Encrypt / Decrypt ───────────────────────────────────────────────────────

export const encrypt = async (payload: SessionPayload): Promise<string> => {
  return new SignJWT({ userId: payload.userId, expiresAt: payload.expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
};

export const decrypt = async (
  token: string | undefined = "",
): Promise<SessionPayload | null> => {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
};

// ─── Session Life cycle ────────────────────────────────────────────────────────

export const createSession = async (userId: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
};

export const deleteSession = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
};

export const getSession = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return decrypt(token);
};
