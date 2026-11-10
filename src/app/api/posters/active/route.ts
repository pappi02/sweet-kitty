import { connection } from "next/server";
import { getPosters } from "@/lib/posters/data";
import { livePosters, toPublicPoster } from "@/lib/posters/schema";

/**
 * GET /api/posters/active: posters running right now, for the site pop-up.
 * The same for every visitor, so the CDN keeps it for a minute: an edit in the
 * admin shows within about a minute.
 */
export async function GET() {
  await connection();
  try {
    const data = livePosters(await getPosters()).slice(0, 5).map(toPublicPoster);
    return Response.json({ data }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } });
  } catch (error) {
    console.error("[posters] active feed error", error);
    return Response.json({ data: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}
