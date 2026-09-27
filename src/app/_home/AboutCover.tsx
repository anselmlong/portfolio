"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./home.module.css";

const rows = [
  "ANSELM LONG · ANSELM LONG · ANSELM LONG · ",
  "BUILDS · FILMS · CLIMBS · BUILDS · FILMS · CLIMBS · ",
];

/**
 * A magazine-cover portrait. Three layers: the HackHarvard scene with Anselm
 * painted out, giant rows of type that slide as you scroll, and Anselm cut out
 * on top, so the type passes behind his head. The cursor adds a little depth
 * by moving the layers different amounts.
 */
export function AboutCover() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = matchMedia("(pointer: fine)").matches;
    let x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      raf = 0,
      visible = false;
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
        // No cursor on touch screens: a slow drift instead.
        const s = (now - t0) / 1000;
        tx = Math.sin(s * 0.6) * 0.6;
        ty = Math.sin(s * 1.2) * 0.3;
      }
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      // Scroll progress through the viewport: -1 entering, 1 leaving.
      const r = el.getBoundingClientRect();
      const k = Math.max(
        -1,
        Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight),
      );
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      el.style.setProperty("--k", k.toFixed(3));
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
    <section className={styles.about} aria-labelledby="about-title">
      <div ref={stage} className={styles.cover}>
        <Image
          className={styles.coverBack}
          src="/home/me-bg.webp"
          alt=""
          fill
          sizes="(max-width: 820px) 100vw, 760px"
        />
        <div className={styles.coverType} aria-hidden="true">
          {rows.map((row, i) => (
            <div
              key={row}
              className={styles.coverRow}
              data-dir={i % 2 ? "right" : "left"}
            >
              <span>{row.repeat(2)}</span>
            </div>
          ))}
        </div>
        <Image
          className={styles.coverMe}
          src="/home/me-fg.webp"
          alt="Anselm, arms crossed and smiling, in front of the HackHarvard banner"
          fill
          sizes="(max-width: 820px) 100vw, 760px"
        />
        <span className={styles.coverRec} aria-hidden="true">
          <span className={styles.rec} />
          HackHarvard 2025
        </span>
      </div>
      <div className={styles.aboutText}>
        <span className={styles.mono}>about</span>
        <h2 id="about-title">hi, that&apos;s me.</h2>
        <p>
          i study computer science at nus, specialising in ai, and i&apos;m a
          software engineer intern on the maps team at open government products.
        </p>
        <p>
          outside of code i film and take photos, and i boulder around v6 to v7
          in singapore, usually with friends.
        </p>
        <p className={styles.aboutNote}>
          this photo is from hackharvard 2025, where freak-cha won funniest
          hack.
        </p>
      </div>
    </section>
  );
}
