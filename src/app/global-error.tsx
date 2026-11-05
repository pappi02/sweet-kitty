"use client";

import { useEffect } from "react";

// Last-resort screen when the root layout itself fails. It renders its own
// document without the site's CSS, so styles are inline and kept minimal.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-KE">
      <body style={{ margin: 0, minHeight: "100svh", display: "grid", placeItems: "center", background: "#FFF1F8", color: "#330412", fontFamily: "Georgia, serif", textAlign: "center", padding: "0 20px" }}>
        <title>Something went wrong | My Sweet Kitty</title>
        <div>
          <p style={{ color: "#73062C", fontStyle: "italic", margin: 0 }}>My Sweet Kitty</p>
          <h1 style={{ fontSize: "clamp(2rem,8vw,3.5rem)", lineHeight: 1, margin: "12px 0" }}>
            Something <em style={{ color: "#73062C" }}>slipped.</em>
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, opacity: 0.75, margin: "0 0 24px" }}>Please try again in a moment.</p>
          <button
            onClick={() => retry()}
            style={{ background: "#73062C", color: "#fff", border: 0, borderRadius: 999, padding: "12px 28px", fontSize: 14, fontWeight: 600, fontFamily: "system-ui, sans-serif", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
