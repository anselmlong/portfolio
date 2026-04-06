import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export default function NotFound() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="pt-40 pb-24 md:pt-48">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/"
              className="text-muted-foreground/60 hover:text-muted-foreground group mb-16 inline-flex items-center transition-colors duration-200"
            >
              <span className="group-hover:border-foreground mr-3 flex size-6 items-center justify-center rounded-full border border-current transition-colors duration-200">
                <svg
                  className="size-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </span>
              <span className="text-xs tracking-[0.2em] uppercase">Home</span>
            </Link>

            <div className="relative">
              <span
                className={`text-foreground/[0.03] pointer-events-none absolute -top-12 -left-8 text-[10rem] leading-none font-thin select-none md:-left-20 md:text-[16rem] ${playfair.variable}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                4
              </span>

              <h1
                className={`text-foreground-high mb-8 text-8xl leading-[0.9] font-light tracking-tight md:text-9xl lg:text-[12rem] ${playfair.variable}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                404
              </h1>

              <div className="mt-8 flex items-center gap-6">
                <div className="bg-primary/40 h-px w-16" />
                <p className="text-muted-foreground text-sm tracking-[0.15em] uppercase">
                  page not found
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mt-12 max-w-xl text-lg leading-relaxed font-light text-pretty md:text-xl">
              this page seems to have wandered off. perhaps it&apos;s hiding in
              a draft, or maybe the link got lost along the way.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                href="/"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center border px-8 py-4 text-sm tracking-[0.15em] uppercase transition-colors duration-200"
              >
                Return Home
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground inline-flex items-center text-sm tracking-wide transition-colors duration-200"
              >
                or read the journal →
              </Link>
            </div>

            <div className="mt-24 flex items-center gap-4">
              <div className="bg-border/50 h-px flex-1" />
              <span
                className="text-muted-foreground/20 text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ∅
              </span>
              <div className="bg-border/50 h-px flex-1" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
