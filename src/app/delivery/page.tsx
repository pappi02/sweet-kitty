import { LegalPageView, legalMetadata } from "@/components/legal/legal-page";
import { getLegalPage } from "@/lib/legal";

const page = getLegalPage("delivery");

export const metadata = legalMetadata(page);

export default function Page() {
  return <LegalPageView page={page} />;
}
