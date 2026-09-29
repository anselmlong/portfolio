"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

const mine = "vf-cookies";
const milestones: Record<number, string> = {
  10: "10 cookies. warming up.",
  100: "100 cookies! you're a regular now.",
  500: "500 cookies. the oven is tired.",
  1000: "1,000 cookies. absolute legend.",
};
// Where the chocolate chips sit on the cookie (in a 100×100 box).
const chips = [
  [32, 30, 6],
  [60, 26, 5],
  [72, 50, 6.5],
  [45, 52, 5.5],
  [28, 62, 5],
  [56, 72, 6],
  [38, 80, 4],
  [78, 70, 4],
];

/**
 * A tiny cookie clicker: click the cookie, bake a cookie. Everyone who visits adds to
 * the same count. Presses are batched and sent about once a second, and the
 * number on screen is the server's total plus whatever hasn't been sent yet.
 */
export function Cookie() {
  const [total, setTotal] = useState<number | null>(null);
  const [queued, setQueued] = useState(0);
  const [you, setYou] = useState(0);
  const [bursts, setBursts] = useState<{ id: number; x: number }[]>([]);
  const [note, setNote] = useState("");
  const pending = useRef(0);
  const sending = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const nextBurst = useRef(0);
  const count = useRef(0);

  useEffect(() => {
    try {
      count.current = Number(localStorage.getItem(mine)) || 0;
      setYou(count.current);
    } catch {
      // Private mode or blocked storage: start from zero.
    }
  }, []);

  // Send whatever is queued. Keepalive lets the last batch out as the page closes.
  async function send(keepalive = false) {
    const n = Math.min(pending.current, 40);
    if (!n || sending.current) return;
    sending.current = true;
    pending.current -= n;
    try {
      const res = await fetch("/api/clicks", {
        method: "POST",
        keepalive,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n }),
      });
      if (res.ok) {
        const body = (await res.json()) as { total: number };
        setTotal(body.total);
        setNote("");
      } else if (res.status === 429)
        setNote("easy, the oven needs a breather.");
      else throw new Error(String(res.status));
    } catch {
      pending.current += n;
      setNote(
        "couldn't reach the counter; your cookies will send when it's back.",
      );
    } finally {
      sending.current = false;
      setQueued(pending.current);
    }
  }

  useEffect(() => {
    const el = box.current;
    let timer = 0,
      poll = 0;
    const load = () =>
      fetch("/api/clicks")
        .then((r) => (r.ok ? (r.json() as Promise<{ total: number }>) : null))
        .then((b) => b && setTotal(b.total))
        .catch(() => undefined);
    // Only keep the count fresh while the button is on screen.
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(poll);
      if (e?.isIntersecting) {
        void load();
        poll = window.setInterval(() => void load(), 6000);
      }
    });
    if (el) io.observe(el);
    timer = window.setInterval(() => void send(), 900);
    const bye = () => void send(true);
    addEventListener("pagehide", bye);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
      window.clearInterval(poll);
      removeEventListener("pagehide", bye);
    };
  }, []);

  function bake(e: React.MouseEvent<HTMLButtonElement>) {
    pending.current += 1;
    setQueued(pending.current);
    const next = ++count.current;
    setYou(next);
    try {
      localStorage.setItem(mine, String(next));
    } catch {
      // Not saved; the global count still gets it.
    }
    if (milestones[next]) setNote(milestones[next]);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - r.left - r.width / 2 : 0;
    const id = nextBurst.current++;
    setBursts((b) => [...b.slice(-8), { id, x }]);
    window.setTimeout(
      () => setBursts((b) => b.filter((p) => p.id !== id)),
      900,
    );
  }

  const shown = total === null ? null : total + queued;

  return (
    <div ref={box} className={styles.clicker}>
      <button
        type="button"
        className={styles.cookie}
        onClick={bake}
        aria-label="Click the cookie to add one to everyone's count"
        data-label="BAKE"
      >
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <radialGradient id="cookie-dough" cx="38%" cy="34%" r="70%">
              <stop offset="0%" stopColor="#f3c27a" />
              <stop offset="70%" stopColor="#d99a4e" />
              <stop offset="100%" stopColor="#b8773a" />
            </radialGradient>
          </defs>
          <path
            d="M50 4c9 0 13 5 20 7s12 3 16 10 2 12 5 19 6 11 3 19-9 10-12 16-6 13-14 16-13 0-19 3-11 5-19 2-9-9-15-12-12-6-14-14 2-12 0-19-5-12-1-19 10-8 15-12 6-10 13-13 13-3 22-3Z"
            fill="url(#cookie-dough)"
            stroke="#9c6230"
            strokeWidth="1.5"
          />
          {chips.map(([x, y, r]) => (
            <ellipse
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              rx={r}
              ry={r! * 0.8}
              fill="#4a2a18"
              transform={`rotate(${x! * 7} ${x} ${y})`}
            />
          ))}
        </svg>
        {bursts.map((b) => (
          <em
            key={b.id}
            className={styles.plus}
            style={{ translate: `${b.x}px 0` }}
            aria-hidden="true"
          >
            +1
          </em>
        ))}
      </button>
      <div className={styles.tally}>
        <b>{shown === null ? "…" : shown.toLocaleString("en-SG")}</b>
        <span className={styles.mono}>
          cookies baked by everyone who&apos;s visited
        </span>
        <span className={styles.mono}>
          you&apos;ve baked {you.toLocaleString("en-SG")}
        </span>
        {note && (
          <span className={styles.cookieNote} role="status">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
