import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Google Analytics domains are only allowed when a measurement ID is configured.
const ga = process.env.NEXT_PUBLIC_GA_ID
  ? { script: " https://www.googletagmanager.com", connect: " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com", img: " https://*.google-analytics.com https://*.googletagmanager.com" }
  : { script: "", connect: "", img: "" };

// Videos and posters uploaded in the admin dashboard live in our Vercel Blob store.
// The dashboard uploads straight from the browser to Vercel's Blob API.
const blobHost = "https://*.public.blob.vercel-storage.com";

// Content Security Policy: the site only loads its own scripts, styles, fonts,
// images and videos. When a video CDN, analytics or payments are added, list
// their domains here (media-src, script-src, connect-src, frame-src).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${ga.script}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${blobHost}${ga.img}`,
  `media-src 'self' blob: ${blobHost}`,
  "font-src 'self'",
  `connect-src 'self' https://vercel.com ${blobHost}${isDev ? " ws: wss:" : ""}${ga.connect}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Let phones/laptops on the LAN (and Tailscale) load dev assets and hot reload
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "100.*.*.*", "*.devtunnels.ms"],
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // Posters uploaded in the admin (shown blurred behind the full-screen player).
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
  // Old product links keep working after the 2026-11 renames.
  redirects() {
    return [
      { source: "/shop/sweet-kitty-magic-juice", destination: "/shop/magic-kitty-juice", permanent: true },
      { source: "/shop/sweet-kitty-magic-bath", destination: "/shop/sweet-kitty-love-bath", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Videos are big: let browsers reuse them for a day instead of re-downloading.
      { source: "/videos/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      // The admin dashboard is private: never cached, never indexed.
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
