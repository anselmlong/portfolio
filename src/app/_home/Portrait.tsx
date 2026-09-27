"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./home.module.css";

/**
 * A 2.5D portrait: Anselm cut out of his HackHarvard photo, over the same scene
 * with him painted out. The two layers shift by different amounts as the
 * cursor moves (or drift slowly on touch screens), so he stands out from the
 * banner behind him.
 */
export function Portrait() {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf = 0,
      visible = false;
    const fine = matchMedia("(pointer: fine)").matches;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(
        -1,
        Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2),
      );
      ty = Math.max(
        -1,
        Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2),
      );
    };
    const tick = (now: number) => {
      if (!fine) {
        // No cursor on touch screens: a slow figure-eight drift instead.
        const s = (now - t0) / 1000;
        tx = Math.sin(s * 0.6) * 0.7;
        ty = Math.sin(s * 1.2) * 0.35;
      }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    if (fine) addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <figure className={styles.portrait}>
      <div ref={frame} className={styles.portraitFrame}>
        <Image
          className={styles.portraitBack}
          src="/home/me-bg.webp"
          alt=""
          fill
          sizes="(max-width: 820px) 90vw, 520px"
        />
        <Image
          className={styles.portraitMe}
          src="/home/me-fg.webp"
          alt="Anselm, arms crossed and smiling, in front of the HackHarvard banner"
          fill
          sizes="(max-width: 820px) 90vw, 520px"
        />
        <span className={styles.portraitRec} aria-hidden="true">
          <span className={styles.rec} />
          HackHarvard 2025
        </span>
      </div>
      <figcaption className={styles.mono}>
        me at HackHarvard, where freak-cha won funniest hack
      </figcaption>
    </figure>
  );
}
