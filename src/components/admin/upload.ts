"use client";

// Uploads from the admin dashboard. With a Vercel Blob store the browser sends the
// file straight to Blob (big videos are fine); in development without one, files go
// to public/uploads through /api/admin/upload-local.
import type { StorageMode } from "@/lib/cms/store";

export type UploadFolder = "films" | "posters" | "photos";

const EXT: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function uploadFile(file: File, folder: UploadFolder, mode: StorageMode, onProgress?: (percent: number) => void): Promise<string> {
  const ext = EXT[file.type];
  if (!ext) throw new Error("Use an MP4, WebM or MOV video, or a JPEG, PNG or WebP image.");
  const name = `${folder.slice(0, -1)}-${Date.now().toString(36)}.${ext}`;

  if (mode === "blob") {
    const { upload } = await import("@vercel/blob/client");
    const blob = await upload(`mentorship/${folder}/${name}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      contentType: file.type,
      multipart: file.size > 20 * 1024 * 1024,
      onUploadProgress: (e) => onProgress?.(e.percentage),
    });
    return blob.url;
  }

  if (mode === "local") {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/upload-local");
      xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
      xhr.onload = () => {
        try {
          const r = JSON.parse(xhr.responseText) as { url?: string; error?: string };
          if (xhr.status === 200 && r.url) resolve(r.url);
          else reject(new Error(r.error ?? "Upload failed."));
        } catch {
          reject(new Error("Upload failed."));
        }
      };
      xhr.onerror = () => reject(new Error("No connection. Try again."));
      xhr.send(form);
    });
  }

  throw new Error("Uploads need a Vercel Blob store. Connect one to the project in Vercel, then redeploy.");
}

/** Grabs a still from early in a video to use as its poster (JPEG, at most 1080 px). */
export async function capturePoster(file: File): Promise<File | null> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  try {
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    await new Promise<void>((resolve, reject) => {
      video.onloadeddata = () => resolve();
      video.onerror = () => reject(new Error("unreadable"));
      setTimeout(() => reject(new Error("timeout")), 20_000);
    });
    video.currentTime = Math.min(1.5, (Number.isFinite(video.duration) ? video.duration : 3) / 3);
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      setTimeout(resolve, 5000);
    });
    const scale = Math.min(1, 1080 / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    return blob ? new File([blob], "poster.jpg", { type: "image/jpeg" }) : null;
  } catch {
    return null;
  } finally {
    video.removeAttribute("src");
    URL.revokeObjectURL(url);
  }
}
