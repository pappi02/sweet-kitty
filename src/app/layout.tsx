import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Great_Vibes, Instrument_Sans } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBuyBar } from "@/components/layout/mobile-buy-bar";
import { Analytics } from "@/components/analytics/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { VideoLightboxProvider } from "@/components/video/video-lightbox";
import { isDarajaReady } from "@/lib/payments/daraja";
import { organizationLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const vibes = Great_Vibes({
  variable: "--font-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: "My Sweet Kitty | Your Beauty Besties",
    template: "%s | My Sweet Kitty",
  },
  description:
    "Natural, secret-recipe feminine rituals. The 7-Day Sweet Kitty Kit: more glow, more energy, more confidence. Discreet packaging, order on WhatsApp.",
  applicationName: site.name,
  // Icons and the share image come from app/icon.png, apple-icon.png and opengraph-image.png.
  openGraph: {
    title: "My Sweet Kitty | Your Beauty Besties",
    description: "The 7-day glow-up every woman is whispering about.",
    siteName: site.name,
    url: "/",
    type: "website",
    locale: "en_KE",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#73062C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-KE" data-scroll-behavior="smooth" className={`${bodoni.variable} ${instrument.variable} ${vibes.variable} antialiased`}>
      <body className="min-h-svh">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <CartProvider>
          <VideoLightboxProvider>
            <Header />
            {children}
            <Footer />
            <MobileBuyBar />
            <CartDrawer payEnabled={isDarajaReady()} />
            <Analytics />
          </VideoLightboxProvider>
        </CartProvider>
      </body>
    </html>
  );
}
