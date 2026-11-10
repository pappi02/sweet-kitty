import type { Metadata } from "next";
import { Suspense } from "react";
import { MentorshipEditor } from "@/components/admin/mentorship-editor";
import { requireAdmin } from "@/lib/admin/auth";
import { listVersions, storageMode } from "@/lib/cms/store";
import { MENTORSHIP_KEY, readMentorshipForAdmin } from "@/lib/mentorship/data";
import { defaultMentorship } from "@/lib/mentorship/defaults";
import { isDarajaReady } from "@/lib/payments/daraja";

export const metadata: Metadata = { title: "Mentorship" };

export default function MentorshipAdminPage() {
  return (
    <Suspense fallback={<div className="mx-auto mt-10 h-96 max-w-7xl animate-pulse rounded-xl bg-white/60 px-6" />}>
      <Editor />
    </Suspense>
  );
}

async function Editor() {
  await requireAdmin();
  const [{ doc, problem }, versions] = await Promise.all([readMentorshipForAdmin(), listVersions(MENTORSHIP_KEY)]);
  return <MentorshipEditor initial={doc} defaults={defaultMentorship} versions={versions} storage={storageMode()} payReady={isDarajaReady()} problem={problem} />;
}
