/**
 * How often a poster may pop up on one device. Each poster has a number of
 * showings per day (Nairobi day); repeat showings on the same day are kept at
 * least MIN_GAP_MS apart so a visitor isn't shown it twice while browsing.
 * The record lives in the browser (localStorage), so it is per device.
 */

export const POSTER_TIMES_PER_DAY_MAX = 10;
export const MIN_GAP_MS = 30 * 60 * 1000;

export interface SeenRecord {
  /** Nairobi day ("YYYY-MM-DD") the count belongs to. */
  day: string;
  /** Showings on that day. */
  count: number;
  /** When it was last shown (ms since epoch). */
  last: number;
}

/**
 * Reads a stored record. Before showings per day existed, the value was just
 * the day it was last shown; that counts as one showing at an unknown time.
 */
export function parseSeen(raw: string | null): SeenRecord | null {
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return { day: raw, count: 1, last: 0 };
  try {
    const value = JSON.parse(raw) as Partial<SeenRecord>;
    if (typeof value.day === "string" && Number.isInteger(value.count) && typeof value.last === "number") {
      return { day: value.day, count: value.count as number, last: value.last };
    }
  } catch {
    // Unreadable: treat as never shown.
  }
  return null;
}

export function canShowPoster(seen: SeenRecord | null, today: string, now: number, timesPerDay: number): boolean {
  if (!seen || seen.day !== today) return true;
  if (seen.count >= Math.max(1, timesPerDay)) return false;
  return now - seen.last >= MIN_GAP_MS;
}

export function recordShowing(seen: SeenRecord | null, today: string, now: number): SeenRecord {
  return seen && seen.day === today ? { day: today, count: seen.count + 1, last: now } : { day: today, count: 1, last: now };
}
