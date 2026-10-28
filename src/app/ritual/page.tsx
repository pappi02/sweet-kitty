import type { Metadata } from "next";
import { FinalCta } from "@/components/home/final-cta";
import { PageHero } from "@/components/layout/page-hero";
import { PageTransition } from "@/components/layout/page-transition";
import { DaysTrack, MorningRitual, RitualRules } from "@/components/ritual/ritual-sections";

export const metadata: Metadata = {
  title: "The ritual",
  description: "How the My Sweet Kitty ritual works: your morning, step by step, and what to expect across seven days.",
  alternates: { canonical: "/ritual" },
};

export default function RitualPage() {
  return (
    <PageTransition>
      <PageHero
        index="03"
        label="Ritual"
        title="How the"
        accent="magic works."
        intro="Five small moments every morning. Seven mornings in a row. This is the ritual behind every Sweet Kitty glow-up."
      />
      <MorningRitual />
      <DaysTrack />
      <RitualRules />
      <FinalCta />
    </PageTransition>
  );
}
