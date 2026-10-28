import { ViewTransition, type ReactNode } from "react";

/** Wrap each page's content so route changes fade the old page out and lift the new one in. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <main>{children}</main>
    </ViewTransition>
  );
}
