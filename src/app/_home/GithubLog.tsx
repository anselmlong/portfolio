"use client";

import { useEffect, useRef, useState } from "react";
import type { Day, GithubActivity } from "~/server/github";
import styles from "./home.module.css";

const profile = "https://github.com/anselmlong";

const long = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function ago(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/** Counts a number up from zero once, when `on` turns true. */
function useCount(target: number, on: boolean) {
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!on || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return setN(target);
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 1400);
      setN(Math.round(target * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, on]);
  return n;
}

/**
 * A year of GitHub contributions as a strip of film that develops as it scrolls
 * into view (a scan line sweeps across and each week lights up behind it), with
 * a readout for whichever day the pointer is on and a live `git log`.
 */
export function GithubLog({ data }: { data: GithubActivity }) {
  const box = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<Day | null>(null);
  const total = useCount(data.total, seen);
  const streak = useCount(data.streak, seen);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    // On narrow screens the strip scrolls; start at the most recent week.
    if (strip.current) strip.current.scrollLeft = strip.current.scrollWidth;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pad = data.days.length
    ? new Date(`${data.days[0]!.date}T00:00:00`).getDay()
    : 0;
  const weeks = Math.ceil((pad + data.days.length) / 7);
  const months: { label: string; col: number }[] = [];
  data.days.forEach((d, i) => {
    if (d.date.endsWith("-01") || i === 0) {
      const col = Math.floor((pad + i) / 7);
      // A partial first month gives way to the next one rather than overlapping it.
      if (months.length && col - months.at(-1)!.col <= 2) months.pop();
      months.push({
        label: new Date(`${d.date}T00:00:00`).toLocaleDateString("en-SG", {
          month: "short",
        }),
        col,
      });
    }
  });
  const shown = hover ?? data.best;

  return (
    <section
      ref={box}
      className={styles.git}
      data-seen={seen || undefined}
      aria-labelledby="git-title"
    >
      <div className={styles.kicker}>
        <h2 id="git-title">Commit log</h2>
        <a
          className={styles.mono}
          href={profile}
          target="_blank"
          rel="noreferrer"
          data-label="OPEN"
        >
          github.com/anselmlong →
        </a>
      </div>

      {data.days.length > 0 && (
        <>
          <div className={styles.gitStats}>
            <div>
              <b>{total.toLocaleString("en-SG")}</b>
              <span className={styles.mono}>contributions this year</span>
            </div>
            <div>
              <b>{streak}</b>
              <span className={styles.mono}>day streak, longest</span>
            </div>
            <div className={styles.gitReadout} aria-live="polite">
              <b>{shown?.count ?? 0}</b>
              <span className={styles.mono}>
                {hover ? "on" : "best day,"} {shown ? long(shown.date) : ""}
              </span>
            </div>
          </div>

          <div
            ref={strip}
            className={styles.gitStrip}
            onPointerLeave={() => setHover(null)}
          >
            <div
              className={styles.gitMonths}
              style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
              aria-hidden="true"
            >
              {months.map((m) => (
                <span
                  key={`${m.label}-${m.col}`}
                  style={{ gridColumn: m.col + 1 }}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <div
              className={styles.gitGrid}
              style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
              role="img"
              aria-label={`${data.total} GitHub contributions in the past year, longest streak ${data.streak} days.`}
            >
              {Array.from({ length: pad }, (_, i) => (
                <i key={`pad-${i}`} className={styles.gitPad} />
              ))}
              {data.days.map((d, i) => (
                <i
                  key={d.date}
                  data-l={d.level}
                  style={
                    { "--c": Math.floor((pad + i) / 7) } as React.CSSProperties
                  }
                  onPointerEnter={() => setHover(d)}
                />
              ))}
              <span className={styles.gitScan} aria-hidden="true" />
            </div>
          </div>
        </>
      )}

      {data.commits.length > 0 && (
        <div className={styles.gitLog}>
          <span className={styles.mono}>
            $ git log --all --author=anselm --oneline
          </span>
          <ol>
            {data.commits.map((c, i) => (
              <li key={c.url} style={{ "--i": i } as React.CSSProperties}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  data-label="VIEW"
                >
                  <code>{c.url.split("/").at(-1)!.slice(0, 7)}</code>
                  <em>{c.repo}</em>
                  <span>{c.message}</span>
                  <time dateTime={c.date} suppressHydrationWarning>
                    {ago(c.date)}
                  </time>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
