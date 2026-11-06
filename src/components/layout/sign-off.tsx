import styles from "./sign-off.module.css";

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
      className={[styles.signOff, tone === "light" ? styles.light : styles.dark, className].filter(Boolean).join(" ")}
    >
      <span aria-hidden className={styles.symbol} />
      <span>
        crafted by <span className={styles.name}>Am.nyongesa</span>
      </span>
    </a>
  );
}
