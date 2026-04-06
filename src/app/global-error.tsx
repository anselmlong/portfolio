"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import Link from "next/link";

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
    <html>
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center">
        <div className="max-w-md px-6 text-center">
          <p className="text-muted-foreground mb-8 text-xs tracking-[0.2em] uppercase">
            something went wrong
          </p>

          <h1
            className="text-foreground-high mb-6 text-4xl font-light md:text-5xl"
            style={{
              fontFamily: "var(--font-display, ui-serif, Georgia, serif)",
            }}
          >
            we hit a snag
          </h1>

          <p className="text-muted-foreground mb-10 leading-relaxed font-light text-pretty">
            an unexpected error occurred. try refreshing the page, or head back
            home and start fresh.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={reset}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center border px-8 py-4 text-sm tracking-[0.15em] uppercase transition-colors duration-200"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm tracking-wide transition-colors duration-200"
            >
              return home →
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
