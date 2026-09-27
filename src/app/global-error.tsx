"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { viewfinderFonts } from "./_home/fonts";
import styles from "./blog/blog.module.css";

// Replaces the root layout when it crashes, so it brings its own html, fonts and styles.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0d0a0a" }}>
        <div className={`${viewfinderFonts} ${styles.root}`}>
          <main className={`${styles.wrap} ${styles.mast}`}>
            <span className={styles.mono}>something went wrong</span>
            <h1 aria-label="Snag">
              {"SNAG".split("").map((c, i) => (
                <span key={i} aria-hidden="true">
                  {c}
                </span>
              ))}
              <span className={styles.dot} aria-hidden="true">
                .
              </span>
            </h1>
            <p>
              an unexpected error happened. try again, or head back home and
              start fresh.
            </p>
            <p style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <button type="button" className={styles.mono} onClick={reset}>
                try again ↻
              </button>
              <Link className={styles.mono} href="/">
                ← back home
              </Link>
            </p>
          </main>
        </div>
      </body>
    </html>
  );
}
