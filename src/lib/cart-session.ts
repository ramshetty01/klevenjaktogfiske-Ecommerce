/**
 * Cart session helpers — server-side only.
 *
 * The cart is anonymous: a `kj_cart` cookie stores a stable sessionId
 * (UUID v4 generated client-side or by the API). CartItem rows reference
 * this sessionId so the cart persists across requests but doesn't require
 * a user account.
 */

import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const CART_COOKIE = "kj_cart";

/**
 * Returns the current session ID. If no cookie is set, generates a new
 * UUID and stashes it in the response Set-Cookie header. Always call
 * inside an API route handler — this function reads/writes cookies.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing && existing.length > 0) return existing;

  const sid = randomUUID();
  store.set(CART_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return sid;
}

/**
 * Reads the session ID without creating one. Use this for GET endpoints
 * where you want to return an empty cart rather than minting a new session.
 */
export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}
