import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "arab_dev_anon";

export async function getAnonymousId() {
  const cookieStore = await cookies();
  let id = cookieStore.get(COOKIE_NAME)?.value;
  if (id) return id;
  return null;
}

export async function getOrCreateAnonymousId() {
  const cookieStore = await cookies();
  let id = cookieStore.get(COOKIE_NAME)?.value;
  if (id) return { id, isNew: false };
  id = randomUUID();
  cookieStore.set(COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return { id, isNew: true };
}

export const COOKIE_HEADER_NAME = COOKIE_NAME;
