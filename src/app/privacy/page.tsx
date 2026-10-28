import { LegalPageView, legalMetadata } from "@/components/legal/legal-page";
import { getLegalPage } from "@/lib/legal";

const page = getLegalPage("privacy");

export const metadata = legalMetadata(page);

export default function Page() {
  return <LegalPageView page={page} />;
}
