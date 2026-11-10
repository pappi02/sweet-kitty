// Development only: saves an admin upload into public/uploads so the dashboard
// works without a Vercel Blob store. Production refuses (use Blob there).
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAdmin } from "@/lib/admin/auth";

const EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" || process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "Local uploads are for development only." }, { status: 404 });
  }
  if (!(await isAdmin())) return Response.json({ error: "Please sign in again." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const folder = String(form?.get("folder") ?? "");
  const scope = String(form?.get("scope") ?? "mentorship");
  if (!(file instanceof File) || !EXT[file.type] || !/^[a-z]{1,20}$/.test(folder) || !["mentorship", "posters"].includes(scope)) {
    return Response.json({ error: "Choose an MP4, WebM, MOV, JPEG, PNG or WebP file." }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", scope, folder);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${EXT[file.type]}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/uploads/${scope}/${folder}/${name}` });
}
