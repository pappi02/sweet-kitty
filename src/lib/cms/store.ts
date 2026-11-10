// Versioned JSON documents for the admin dashboard, with no database.
//
// Every save writes a new, immutable version:
//   - Vercel Blob (when BLOB_READ_WRITE_TOKEN is set): cms/<key>/<timestamp>-<suffix>.json
//   - otherwise, in development only: .data/cms/<key>/<timestamp>.json
// The newest version is the live one, and older versions can be restored. Only the
// most recent KEEP versions are kept.
import { del, list, put } from "@vercel/blob";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const KEEP = 25;
const LOCAL_ROOT = path.join(process.cwd(), ".data", "cms");

export type StorageMode = "blob" | "local" | "none";

export type Version = { id: string; savedAt: string; size: number };

/** Where content and uploads are kept. "none" = production without a Blob store (read-only). */
export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return process.env.NODE_ENV === "production" ? "none" : "local";
}

const stamp = () => new Date().toISOString().replace(/[:.]/g, "-");
const keyOk = (key: string) => /^[a-z0-9-]{1,40}$/.test(key);
const idOk = (id: string) => /^[A-Za-z0-9_.-]{1,120}$/.test(id) && !id.includes("..");

/** Newest first. */
export async function listVersions(key: string): Promise<Version[]> {
  if (!keyOk(key)) throw new Error("Bad key");
  const mode = storageMode();
  if (mode === "blob") {
    const out: Version[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix: `cms/${key}/`, cursor, limit: 1000 });
      for (const b of page.blobs) out.push({ id: b.pathname.slice(`cms/${key}/`.length), savedAt: new Date(b.uploadedAt).toISOString(), size: b.size });
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out.sort((a, b) => b.savedAt.localeCompare(a.savedAt) || b.id.localeCompare(a.id));
  }
  if (mode === "local") {
    const dir = path.join(LOCAL_ROOT, key);
    const names = await readdir(dir).catch(() => [] as string[]);
    return names
      .filter((n) => n.endsWith(".json"))
      .sort()
      .reverse()
      .map((n) => ({ id: n, savedAt: fromStamp(n), size: 0 }));
  }
  return [];
}

function fromStamp(name: string) {
  const m = name.match(/^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/);
  return m ? `${m[1]}T${m[2]}:${m[3]}:${m[4]}.${m[5]}Z` : new Date(0).toISOString();
}

export async function readVersion(key: string, id: string): Promise<unknown> {
  if (!keyOk(key) || !idOk(id)) throw new Error("Bad version");
  const mode = storageMode();
  if (mode === "blob") {
    const { blobs } = await list({ prefix: `cms/${key}/${id}`, limit: 1 });
    const blob = blobs.find((b) => b.pathname === `cms/${key}/${id}`);
    if (!blob) throw new Error("Version not found");
    // Every version has its own immutable URL, so a cached copy is always correct.
    const res = await fetch(blob.url);
    if (!res.ok) throw new Error(`Blob read failed: ${res.status}`);
    return res.json();
  }
  if (mode === "local") return JSON.parse(await readFile(path.join(LOCAL_ROOT, key, id), "utf8"));
  throw new Error("No storage configured");
}

/** The live (newest) version, or null if nothing has been saved yet. */
export async function readLatest(key: string): Promise<{ data: unknown; version: Version } | null> {
  const [latest] = await listVersions(key);
  if (!latest) return null;
  return { data: await readVersion(key, latest.id), version: latest };
}

export async function writeVersion(key: string, data: unknown): Promise<Version> {
  if (!keyOk(key)) throw new Error("Bad key");
  const body = JSON.stringify(data);
  const mode = storageMode();
  let version: Version;
  if (mode === "blob") {
    const blob = await put(`cms/${key}/${stamp()}.json`, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: true,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    version = { id: blob.pathname.slice(`cms/${key}/`.length), savedAt: new Date().toISOString(), size: body.length };
  } else if (mode === "local") {
    const dir = path.join(LOCAL_ROOT, key);
    await mkdir(dir, { recursive: true });
    const id = `${stamp()}.json`;
    await writeFile(path.join(dir, id), body, "utf8");
    version = { id, savedAt: fromStamp(id), size: body.length };
  } else {
    throw new Error("Saving needs a Vercel Blob store. Connect one to this project, then redeploy.");
  }
  await prune(key).catch((e) => console.error("[cms] prune failed", e));
  return version;
}

async function prune(key: string) {
  const old = (await listVersions(key)).slice(KEEP);
  if (old.length === 0) return;
  if (storageMode() === "blob") {
    const { blobs } = await list({ prefix: `cms/${key}/`, limit: 1000 });
    const urls = blobs.filter((b) => old.some((v) => b.pathname === `cms/${key}/${v.id}`)).map((b) => b.url);
    if (urls.length) await del(urls);
  } else {
    await Promise.all(old.map((v) => rm(path.join(LOCAL_ROOT, key, v.id), { force: true })));
  }
}
