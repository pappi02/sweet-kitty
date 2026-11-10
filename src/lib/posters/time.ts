/**
 * Nairobi time helpers for posters. Kenya is UTC+3 all year (no daylight saving),
 * so admins enter times in Nairobi time and they convert exactly.
 */

const NAIROBI_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" in Nairobi time: the day a pop-up's showings are counted against. */
export function nairobiDay(at: Date = new Date()): string {
  return new Date(at.getTime() + NAIROBI_OFFSET_MS).toISOString().slice(0, 10);
}

/** A datetime-local value ("2026-10-25T23:59") read as Nairobi time. */
export function fromNairobiInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) return null;
  const date = new Date(`${value.length === 16 ? `${value}:00` : value}+03:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** The datetime-local value for a moment, in Nairobi time. */
export function toNairobiInput(at: Date): string {
  return new Date(at.getTime() + NAIROBI_OFFSET_MS).toISOString().slice(0, 16);
}

/** The coming Sunday at the end of the day, Nairobi time (today's, if it is Sunday). */
export function endOfSunday(now: Date = new Date()): Date {
  const local = new Date(now.getTime() + NAIROBI_OFFSET_MS);
  const daysToSunday = (7 - local.getUTCDay()) % 7;
  const sunday = new Date(local.getTime() + daysToSunday * DAY_MS).toISOString().slice(0, 10);
  return new Date(`${sunday}T23:59:59.999+03:00`);
}

/** How a moment reads to people, e.g. "Sun 25 Oct, 23:59". */
export function formatNairobi(at: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Nairobi", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(
    typeof at === "string" ? new Date(at) : at,
  );
}
