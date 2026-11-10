// Signs direct browser-to-Vercel-Blob uploads for the admin dashboard, so large
// videos never pass through our server (Vercel caps request bodies at 4.5 MB).
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin/auth";

const TYPES = ["video/mp4", "video/webm", "video/quicktime", "image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "No Blob store is connected." }, { status: 503 });
  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body) return Response.json({ error: "Bad request." }, { status: 400 });

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdmin())) throw new Error("Please sign in again.");
        if (!/^mentorship\/[a-z]+\/[A-Za-z0-9._-]{1,120}$/.test(pathname)) throw new Error("Bad file name.");
        return {
          allowedContentTypes: TYPES,
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}
