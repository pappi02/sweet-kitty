// Plain global classes: this project runs every .css file through Tailwind,
// which turns CSS modules into global CSS and leaves the module classes empty.
import "./sign-off.css";

const PORTFOLIO_URL = "https://david-baraka.vercel.app";

/**
 * The developer's sign-off, the same mark as on the portfolio. The symbol is a CSS
 * mask over /am-symbol.svg, so its colour comes from the tone: lime on dark
 * footers, cobalt on light ones.
 */
export function SignOff({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <a
      href={PORTFOLIO_URL}
      target="_blank"
      rel="noopener"
      aria-label="Crafted by Am.nyongesa. Opens the developer's portfolio in a new tab"
      className={["sign-off", tone === "light" ? "sign-off--light" : "sign-off--dark", className].filter(Boolean).join(" ")}
    >
      <span aria-hidden className="sign-off__symbol" />
      <span>
        crafted by <span className="sign-off__name">Am.nyongesa</span>
      </span>
    </a>
  );
}
