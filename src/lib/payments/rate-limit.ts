// A small in-memory rate limiter, so nobody can use the pay button to flood a phone
// with M-Pesa prompts. It is per server instance: good enough for one server, and a
// first line of defence on serverless hosts (where a shared store such as Redis would
// make it exact).
const hits = new Map<string, number[]>();

/** True if `key` has made fewer than `max` calls in the last `windowMs`; records this call. */
export function allow(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return true;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
