// Admin sign-in for a single owner account, with no database.
//
//   ADMIN_PASSWORD_HASH   scrypt hash of the password (make one with `npm run admin:hash`)
//   ADMIN_SESSION_SECRET  32+ random characters used to sign the session cookie
//
// The session is a signed cookie (HMAC-SHA256) holding an expiry and a fingerprint
// of the password hash, so changing the password signs every session out. Every
// admin page, Server Action and upload route calls requireAdmin()/isAdmin() itself;
// proxy.ts only redirects early for convenience.
import { createHash, createHmac, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number, options: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>;

export const SESSION_COOKIE = "sk_admin";
const SESSION_HOURS = 12;

type Hash = { N: number; r: number; p: number; salt: Buffer; key: Buffer };

/**
 * Format: scrypt:N:r:p:saltBase64url:keyBase64url
 * (colons, not "$": .env files expand "$NAME", which would corrupt the hash).
 */
function parseHash(value: string | undefined): Hash | null {
  const parts = value?.trim().split(":");
  if (!parts || parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  const salt = Buffer.from(parts[4], "base64url");
  const key = Buffer.from(parts[5], "base64url");
  if (![N, r, p].every((n) => Number.isInteger(n) && n > 0) || salt.length < 16 || key.length < 32) return null;
  return { N, r, p, salt, key };
}

const secret = () => {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  return s && s.length >= 32 ? s : null;
};

export function isAdminConfigured() {
  return Boolean(parseHash(process.env.ADMIN_PASSWORD_HASH) && secret());
}

export async function verifyPassword(password: string) {
  const hash = parseHash(process.env.ADMIN_PASSWORD_HASH);
  if (!hash || password.length === 0 || password.length > 200) return false;
  const key = await scrypt(password, hash.salt, hash.key.length, { N: hash.N, r: hash.r, p: hash.p, maxmem: 128 * hash.N * hash.r * 2 });
  return key.length === hash.key.length && timingSafeEqual(key, hash.key);
}

const fingerprint = () => createHash("sha256").update(process.env.ADMIN_PASSWORD_HASH?.trim() ?? "").digest("base64url").slice(0, 16);

function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function verifyToken(token: string | undefined) {
  const key = secret();
  if (!token || !key || !isAdminConfigured()) return false;
  const [body, mac] = token.split(".");
  if (!body || !mac) return false;
  const expected = Buffer.from(sign(body, key));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { exp?: number; fp?: string };
    return typeof data.exp === "number" && data.exp > Date.now() && data.fp === fingerprint();
  } catch {
    return false;
  }
}

export async function startSession() {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not set");
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3_600_000, fp: fingerprint() })).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${body}.${sign(body, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  // A session check belongs to a real request (it compares against the current time),
  // so it must never run while a page is being prerendered.
  await connection();
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For admin pages and Server Actions: signed in, or off to the login page. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
