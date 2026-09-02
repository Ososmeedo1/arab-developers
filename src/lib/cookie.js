import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "arab_dev_anon";
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365;

function getAnonymousCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_TTL_SECONDS,
    expires: new Date(Date.now() + COOKIE_TTL_SECONDS * 1000),
  };
}

export async function getAnonymousId() {
  const cookieStore = await cookies();
  const id = cookieStore.get(COOKIE_NAME)?.value;
  return typeof id === "string" && id.trim().length > 0 ? id : null;
}

export async function getOrCreateAnonymousId() {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(COOKIE_NAME)?.value;

  if (typeof existingId === "string" && existingId.trim().length > 0) {
    return { id: existingId, isNew: false };
  }

  const id = randomUUID();
  cookieStore.set(COOKIE_NAME, id, getAnonymousCookieOptions());
  return { id, isNew: true };
}

export const COOKIE_HEADER_NAME = COOKIE_NAME;
