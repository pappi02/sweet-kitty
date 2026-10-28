import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a number as Kenyan shillings, e.g. KSh 10,000 */
export function formatKES(amount: number) {
  return `KSh ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Seeded random numbers so decorative layouts match on server and client. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
