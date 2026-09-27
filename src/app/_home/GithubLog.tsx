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
 * A one-line strip (total, a sparkline of weekly activity, the latest commit)
 * that opens on hover or click into the full year: a graph that develops like
 * film the first time it opens, a readout for the day under the pointer, and a
 * `git log` of recent commits.
 */
export function GithubLog({ data }: { data: GithubActivity }) {
  const strip = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState<Day | null>(null);
  const total = useCount(data.total, seen);
  const streak = useCount(data.streak, seen);

  useEffect(() => {
    if (!open) return;
    setSeen(true);
    // On narrow screens the graph scrolls; start at the most recent week.
    if (strip.current) strip.current.scrollLeft = strip.current.scrollWidth;
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Hovering opens it after a beat; leaving closes it unless it was clicked open.
  const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
  const later = (next: boolean, ms: number) => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), ms);
  };
  const onEnter = () => {
    if (fine() && !pinned) later(true, 160);
  };
  const onLeave = () => {
    if (fine() && !pinned) later(false, 380);
    setHover(null);
  };
  const toggle = () => {
    clearTimeout(timer.current);
    const next = !(open && pinned);
    setPinned(next);
    setOpen(next);
  };

  const pad = data.days.length
    ? new Date(`${data.days[0]!.date}T00:00:00`).getDay()
    : 0;
  const weeks = Math.ceil((pad + data.days.length) / 7);
  const weekly: number[] = [];
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
  data.days.forEach((d, i) => {
    const w = Math.floor((pad + i) / 7);
    weekly[w] = (weekly[w] ?? 0) + d.count;
  });
  const peak = Math.max(1, ...weekly.filter(Boolean));
  const latest = data.commits[0];
  const shown = hover ?? data.best;

  return (
    <section
      className={styles.git}
      data-open={open || undefined}
      data-seen={seen || undefined}
      aria-labelledby="git-title"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <button
        type="button"
        className={styles.gitBar}
        aria-expanded={open}
        aria-controls="git-panel"
        onClick={toggle}
        data-label={open ? "CLOSE" : "OPEN"}
      >
        <span className={styles.mono} id="git-title">
          commit log
        </span>
        <b>
          {data.total.toLocaleString("en-SG")}
          <small> contributions this year</small>
        </b>
        {weekly.length > 0 && (
          <span className={styles.gitSpark} aria-hidden="true">
            {weekly.map((n, i) => (
              <i key={i} style={{ height: `${8 + (92 * (n ?? 0)) / peak}%` }} />
            ))}
          </span>
        )}
        {latest && (
          <span className={styles.gitLatest}>
            <em>{latest.repo}</em> {latest.message}
          </span>
        )}
        <span className={styles.gitToggle} aria-hidden="true" />
      </button>

      <div id="git-panel" className={styles.gitPanel} inert={!open}>
        <div>
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
                        {
                          "--c": Math.floor((pad + i) / 7),
                        } as React.CSSProperties
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
          <a
            className={`${styles.mono} ${styles.gitProfile}`}
            href={profile}
            target="_blank"
            rel="noreferrer"
            data-label="OPEN"
          >
            everything on github.com/anselmlong →
          </a>
        </div>
      </div>
    </section>
  );
}
