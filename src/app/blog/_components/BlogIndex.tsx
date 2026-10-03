"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { BlogPostMetadata } from "~/lib/blog";
import styles from "../blog.module.css";

const day = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short" });
const monthYear = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-SG", { month: "short", year: "numeric" }).toLowerCase();
const minutes = (r: string) => r.replace(" read", "");
// Set on a history entry once its filtered list has been shown, so returning to it doesn't move you.
const settled = () => (history.state as { blogSettled?: boolean } | null)?.blogSettled === true;

/** Marks each place the search term appears, so a filtered row shows why it's there. */
function marked(text: string, q: string) {
  if (!q) return text;
  const at = text.toLowerCase();
  const out: ReactNode[] = [];
  let from = 0;
  for (let i = at.indexOf(q); i !== -1; i = at.indexOf(q, from)) {
    if (i > from) out.push(text.slice(from, i));
    out.push(<mark key={i} className={styles.hit}>{text.slice(i, i + q.length)}</mark>);
    from = i + q.length;
  }
  out.push(text.slice(from));
  return out;
}

export default function BlogIndex({
  posts,
  featured,
}: {
  posts: BlogPostMetadata[];
  featured: BlogPostMetadata | null;
}) {
  const [active, setActive] = useState("all");
  const [term, setTerm] = useState("");
  const mast = useRef<HTMLHeadingElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const filtered = useRef(false);
  const arrival = useRef<"glide" | "stay" | null>(null);
  const [cover, setCover] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c = new Map<string, number>();
    for (const p of posts) for (const t of p.tags ?? []) c.set(t.toLowerCase(), (c.get(t.toLowerCase()) ?? 0) + 1);
    return c;
  }, [posts]);
  // The nine biggest topics, plus the chosen one if it's smaller, so it always shows as pressed.
  const tags = useMemo(() => {
    const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 9);
    const extra = counts.get(active);
    return extra && !top.some(([t]) => t === active) ? [...top, [active, extra] as const] : top;
  }, [counts, active]);

  const q = term.trim().toLowerCase();
  const shown = posts.filter((p) => {
    const inTag = active === "all" || (p.tags ?? []).some((t) => t.toLowerCase() === active);
    const inText = !q || `${p.title} ${p.excerpt} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(q);
    return inTag && inText;
  });
  const years = [...new Set(shown.map((p) => p.date.slice(0, 4)))];

  // On phones the topics are one swipeable row: fade whichever edge has more to see.
  const edges = () => {
    const el = strip.current;
    if (!el) return;
    el.toggleAttribute("data-more-start", el.scrollLeft > 2);
    el.toggleAttribute("data-more-end", el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };
  useEffect(() => {
    edges();
    addEventListener("resize", edges);
    return () => removeEventListener("resize", edges);
  }, []);

  // A topic in the address (?topic=…, where the tags on each post point) opens the list filtered.
  useEffect(() => {
    const t = new URLSearchParams(location.search).get("topic")?.toLowerCase();
    if (!t || !counts.has(t)) return;
    // A fresh arrival glides to the results; coming back (back button, reload) keeps your place.
    arrival.current = settled() ? "stay" : "glide";
    setActive(t);
  }, [counts]);

  // When the filter changes from deep in the list, or you arrive on a topic, start the results
  // just under the bar, keep the chosen topic in view on the strip, and keep the address shareable.
  useEffect(() => {
    if (!filtered.current) {
      filtered.current = true;
      return;
    }
    const url = new URL(location.href);
    if (active === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", active);
    // Next copies its own router state in alongside ours.
    if (url.href !== location.href || !settled()) history.replaceState({ blogSettled: true }, "", url);

    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = (list.current?.getBoundingClientRect().top ?? 0) - (bar.current?.offsetHeight ?? 0);
    if (arrival.current ? arrival.current === "glide" : top < 0)
      scrollTo({ top: scrollY + top, behavior: smooth ? "smooth" : "auto" });
    arrival.current = null;
    const el = strip.current;
    const chip = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && chip && el.scrollWidth > el.clientWidth) {
      const left = chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2;
      el.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    }
    edges(); // a small topic's chip may have just come or gone
  }, [active, term]);

  // "/" jumps to search from anywhere on the page, bringing the bar up first if it's still below.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]:not([contenteditable=false])")) return;
      e.preventDefault();
      const top = bar.current?.getBoundingClientRect().top ?? 0;
      if (top > 0) {
        const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
        scrollTo({ top: scrollY + top, behavior: smooth ? "smooth" : "auto" });
      }
      field.current?.focus({ preventScroll: true });
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = [...(mast.current?.querySelectorAll<HTMLElement>("span") ?? [])];
    let px = innerWidth / 2, raf = 0;
    const onMove = (e: PointerEvent) => { px = e.clientX; };
    // The masthead letters follow the cursor, then spread and tilt as you scroll away.
    const tick = () => {
      const k = Math.min(1, scrollY / 500);
      letters.forEach((l, i) => {
        const c = i - (letters.length - 1) / 2;
        const pull = (px / innerWidth - 0.5) * 10;
        l.style.transform = `translate(${c * k * 18 + pull * (1 - k)}px,${k * Math.abs(c) * 10}px) rotate(${c * k * 2}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    // A post's cover follows the cursor, lagging and tilting with its speed.
    let tx = 0, ty = 0, x = 0, y = 0, raf2 = 0;
    const fine = matchMedia("(pointer: fine)").matches;
    const onFollow = (e: PointerEvent) => { tx = e.clientX + 170; ty = e.clientY; };
    const follow = () => {
      const vx = (tx - x) * 0.14;
      x += vx;
      y += (ty - y) * 0.14;
      if (peek.current)
        peek.current.style.transform = `translate(${Math.min(x, innerWidth - 160) - 150}px,${y - 94}px) rotate(${Math.max(-10, Math.min(10, vx * 0.4))}deg)`;
      raf2 = requestAnimationFrame(follow);
    };
    if (fine) {
      addEventListener("pointermove", onFollow, { passive: true });
      raf2 = requestAnimationFrame(follow);
    }
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointermove", onFollow);
    };
  }, []);

  return (
    <main className={styles.wrap}>
      <section className={styles.mast} aria-labelledby="writing-title">
        <span className={styles.mono}>
          the blog · {posts.length} posts · since {monthYear(posts.at(-1)?.date ?? "2024-11-01")}
        </span>
        <h1 id="writing-title" ref={mast} aria-label="Writing">
          {"WRITING".split("").map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}
          <span className={styles.dot} aria-hidden="true">.</span>
        </h1>
        <p>Notes from building things: internships, hackathons, fine-tuning models on my own texts, and the occasional brainrot.</p>
      </section>

      {featured && (
        <Link className={styles.feat} href={`/blog/${featured.slug}`}>
          <div className={styles.featImg}>
            {featured.image && <Image src={featured.image} alt="" fill priority sizes="(max-width: 820px) 100vw, 680px" style={{ objectFit: "cover" }} />}
          </div>
          <div>
            <span className={styles.mono}>featured · {featured.readingTime} · {monthYear(featured.date)}</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <span className={styles.go}>Read it →</span>
          </div>
        </Link>
      )}

      <div ref={bar} className={styles.bar} role="search">
        <label className={styles.search}>
          <span className={styles.mono} aria-hidden="true">⌕</span>
          <input
            ref={field}
            type="search"
            placeholder="search posts"
            aria-label="Search posts"
            aria-keyshortcuts="/"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              // Esc clears the search first, then a second press hands the keyboard back to the page.
              if (e.key !== "Escape") return;
              e.preventDefault();
              if (term) setTerm("");
              else e.currentTarget.blur();
            }}
          />
          {!term && <kbd className={styles.slash} aria-hidden="true">/</kbd>}
        </label>
        <div ref={strip} className={styles.tags} role="group" aria-label="Filter by topic" onScroll={edges}>
          {[["all", posts.length] as const, ...tags].map(([t, n]) => (
            <button key={t} type="button" className={styles.tag} aria-pressed={active === t} onClick={() => setActive(t)}>
              {t}<small>{n}</small>
            </button>
          ))}
        </div>
        <span className={`${styles.mono} ${styles.count}`} aria-live="polite">{shown.length} of {posts.length}</span>
      </div>

      <div ref={list} onPointerLeave={() => setCover(null)}>
        {years.map((y) => (
          <section key={y} className={styles.year} aria-label={y}>
            <h3>{y}</h3>
            <div>
              {shown.filter((p) => p.date.startsWith(y)).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.row} onPointerEnter={() => setCover(p.image ?? null)}>
                  <b>{marked(p.title, q)}</b>
                  <div className={styles.meta}>
                    <span className={styles.mono}>{day(p.date)}</span>
                    <span className={styles.mono}>{minutes(p.readingTime)}</span>
                  </div>
                  {p.excerpt && <span className={styles.ex}>{marked(p.excerpt, q)}</span>}
                  <span className={styles.tg}>
                    {/* The chosen topic leads and lights up, even when it's past the first four. */}
                    {[...(p.tags ?? [])]
                      .sort((a, b) => Number(b.toLowerCase() === active) - Number(a.toLowerCase() === active))
                      .slice(0, 4)
                      .map((t) => (
                        <span key={t} data-on={t.toLowerCase() === active || undefined}>
                          {marked(t, q)}
                        </span>
                      ))}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {!shown.length && (
          <div className={styles.empty}>
            <p>
              Nothing matches{term.trim() && <> &ldquo;{term.trim()}&rdquo;</>}
              {active !== "all" && <> in <span className={styles.emptyTag}>{active}</span></>}.
            </p>
            {/* One tap back to every post; focus lands on "all" so it isn't lost when this goes. */}
            <button
              type="button"
              className={styles.go}
              onClick={() => {
                setTerm("");
                setActive("all");
                strip.current?.querySelector("button")?.focus({ preventScroll: true });
              }}
            >
              Show all {posts.length} posts
            </button>
          </div>
        )}
      </div>

      <div ref={peek} className={`${styles.peek} ${cover ? styles.peekOn : ""}`} aria-hidden="true">
        {cover && <Image src={cover} alt="" fill sizes="300px" style={{ objectFit: "cover" }} />}
      </div>
      <footer className={styles.foot}><Link className={styles.mono} href="/">← back to the chat</Link></footer>
    </main>
  );
}
