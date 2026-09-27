"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

const roll = 36; // exposures on a roll of film
const mine = "vf-shots";

/**
 * A tiny clicker: press the shutter, take a shot. Everyone who visits adds to
 * the same count. Presses are batched and sent about once a second, and the
 * number on screen is the server's total plus whatever hasn't been sent yet.
 */
export function Shutter() {
  const [total, setTotal] = useState<number | null>(null);
  const [queued, setQueued] = useState(0);
  const [you, setYou] = useState(0);
  const [bursts, setBursts] = useState<{ id: number; x: number }[]>([]);
  const [note, setNote] = useState("");
  const pending = useRef(0);
  const sending = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLSpanElement>(null);
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
        setNote("easy on the shutter, it needs a breather.");
      else throw new Error(String(res.status));
    } catch {
      pending.current += n;
      setNote(
        "couldn't reach the counter; your shots will send when it's back.",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- send only touches refs and setters
  }, []);

  function shoot(e: React.MouseEvent<HTMLButtonElement>) {
    pending.current += 1;
    setQueued(pending.current);
    const next = ++count.current;
    setYou(next);
    try {
      localStorage.setItem(mine, String(next));
    } catch {
      // Not saved; the global count still gets it.
    }
    if (next % roll === 0)
      setNote(`roll ${next / roll} done: ${roll} exposures.`);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    flash.current?.animate([{ opacity: 0.9 }, { opacity: 0 }], {
      duration: 260,
      easing: "ease-out",
    });
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
      <span ref={flash} className={styles.flash} aria-hidden="true" />
      <button
        type="button"
        className={styles.release}
        onClick={shoot}
        aria-label="Press the shutter to add a shot to everyone's count"
        data-label="SHOOT"
      >
        <span className={styles.blades} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} style={{ rotate: `${i * 60}deg` }} />
          ))}
        </span>
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
          shots taken by everyone who&apos;s visited
        </span>
        <span className={styles.mono}>
          you: {you.toLocaleString("en-SG")} · roll {Math.floor(you / roll) + 1}
          , frame {(you % roll) + 1}/{roll}
        </span>
        {note && (
          <span className={styles.shutterNote} role="status">
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
