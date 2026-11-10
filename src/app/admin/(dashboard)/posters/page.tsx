import type { Metadata } from "next";
import { Suspense } from "react";
import { PostersEditor } from "@/components/admin/posters-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { storageMode } from "@/lib/cms/store";
import { readPostersForAdmin } from "@/lib/posters/data";

export const metadata: Metadata = { title: "Posters" };

export default function PostersAdminPage() {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 h-96 max-w-7xl animate-pulse rounded-xl bg-white/60" />}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  await requireAdmin();
  const { doc, version, problem } = await readPostersForAdmin();
  return <PostersEditor initial={doc} savedAt={version?.savedAt ?? null} storage={storageMode()} problem={problem} />;
}
