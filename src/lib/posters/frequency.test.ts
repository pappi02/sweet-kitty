import assert from "node:assert/strict";
import { test } from "node:test";
import { canShowPoster, MIN_GAP_MS, parseSeen, recordShowing } from "./frequency";

const day = "2026-11-10";
const t0 = Date.UTC(2026, 10, 10, 9);

test("a poster shows up to its number of times a day, spaced apart", () => {
  let seen = parseSeen(null);
  assert.equal(canShowPoster(seen, day, t0, 3), true);
  seen = recordShowing(seen, day, t0);
  assert.equal(canShowPoster(seen, day, t0 + MIN_GAP_MS - 1, 3), false, "too soon after the last showing");
  assert.equal(canShowPoster(seen, day, t0 + MIN_GAP_MS, 3), true);
  seen = recordShowing(seen, day, t0 + MIN_GAP_MS);
  seen = recordShowing(seen, day, t0 + 2 * MIN_GAP_MS);
  assert.equal(seen.count, 3);
  assert.equal(canShowPoster(seen, day, t0 + 10 * MIN_GAP_MS, 3), false, "used up for today");
  assert.equal(canShowPoster(seen, "2026-11-11", t0 + 48 * MIN_GAP_MS, 3), true, "a new day starts again");
  assert.equal(recordShowing(seen, "2026-11-11", t0).count, 1);
});

test("once a day stays once a day", () => {
  const seen = recordShowing(null, day, t0);
  assert.equal(canShowPoster(seen, day, t0 + 5 * MIN_GAP_MS, 1), false);
});

test("records from before showings per day still count as one showing", () => {
  const legacy = parseSeen(day);
  assert.deepEqual(legacy, { day, count: 1, last: 0 });
  assert.equal(canShowPoster(legacy, day, t0, 1), false);
  assert.equal(canShowPoster(legacy, day, t0, 2), true);
});

test("unreadable records are ignored", () => {
  assert.equal(parseSeen("{oops"), null);
  assert.equal(parseSeen(JSON.stringify({ day, count: "2" })), null);
});
