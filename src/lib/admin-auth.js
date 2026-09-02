import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// In-memory session store (in production, use Redis or database)
const sessions = new Map();

export async function verifyAdminPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD not configured");
  }

  // Simple string comparison (in production, consider using bcrypt)
  return password === adminPassword;
}

export async function createAdminSession() {
  const sessionId = randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION;

  sessions.set(sessionId, { expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });

  return sessionId;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionId) return null;

  const session = sessions.get(sessionId);

  if (!session) return null;

  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    return null;
  }

  return sessionId;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function isAdminAuthenticated() {
  const session = await getAdminSession();
  return session !== null;
}
