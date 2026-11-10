"use server";

import { updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { listVersions, readVersion, storageMode, writeVersion, type Version } from "@/lib/cms/store";
import { MENTORSHIP_KEY, MENTORSHIP_TAG } from "@/lib/mentorship/data";
import { describeIssue, mentorshipSchema, type Mentorship } from "@/lib/mentorship/schema";

export type SaveResult = { error: string } | { doc: Mentorship; versions: Version[] };

const NO_STORAGE = "Saving is off because no Vercel Blob store is connected. Connect one to the project in Vercel, then redeploy.";

export async function saveMentorship(json: string): Promise<SaveResult> {
  await requireAdmin();
  if (storageMode() === "none") return { error: NO_STORAGE };
  if (json.length > 600_000) return { error: "That's too much content to save at once." };

  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { error: "The content couldn't be read. Refresh the page and try again." };
  }
  const parsed = mentorshipSchema.safeParse(data);
  if (!parsed.success) return { error: describeIssue(parsed.error) };

  try {
    await writeVersion(MENTORSHIP_KEY, parsed.data);
  } catch (error) {
    console.error("[admin] save failed", error);
    return { error: "Saving failed. Check your connection and try again." };
  }
  updateTag(MENTORSHIP_TAG);
  return { doc: parsed.data, versions: await listVersions(MENTORSHIP_KEY) };
}

/** Makes an older version live again (saved as a new version, so nothing is lost). */
export async function restoreMentorship(id: string): Promise<SaveResult> {
  await requireAdmin();
  if (storageMode() === "none") return { error: NO_STORAGE };
  try {
    const parsed = mentorshipSchema.safeParse(await readVersion(MENTORSHIP_KEY, id));
    if (!parsed.success) return { error: "That version can't be restored: " + describeIssue(parsed.error) };
    await writeVersion(MENTORSHIP_KEY, parsed.data);
    updateTag(MENTORSHIP_TAG);
    return { doc: parsed.data, versions: await listVersions(MENTORSHIP_KEY) };
  } catch (error) {
    console.error("[admin] restore failed", error);
    return { error: "That version couldn't be restored. Try again." };
  }
}
