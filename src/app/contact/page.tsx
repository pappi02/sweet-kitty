import type { Metadata } from "next";
import { ContactBuilder } from "@/components/contact/contact-builder";
import { PageHero } from "@/components/layout/page-hero";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to My Sweet Kitty on WhatsApp. Orders, product questions, delivery and glow stories, answered privately.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <PageHero
        index="07"
        label="Contact"
        title="Say"
        accent="hello."
        intro="Orders, questions or your glow story. Everything happens privately on WhatsApp, and a real person answers."
      />
      <ContactBuilder />
    </PageTransition>
  );
}
