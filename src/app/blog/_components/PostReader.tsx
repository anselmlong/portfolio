"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../blog.module.css";

/**
 * Reading aids for a post: a progress bar, the current section lit in the
 * contents rail, copy buttons on code, and click-to-enlarge images.
 */
export function PostReader() {
  const bar = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-article]");
    if (!article) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heads = [...article.querySelectorAll<HTMLElement>("h2[id],h3[id]")];
    const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-toc] a")];
    const cover = document.querySelector<HTMLElement>("[data-cover]");

    const onScroll = () => {
      const r = article.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      if (bar.current) bar.current.style.transform = `scaleX(${k})`;
      let cur = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.3) cur = i; });
      links.forEach((a, i) => a.toggleAttribute("data-on", i === cur));
      if (cover && !still) cover.style.transform = `translateY(${Math.min(120, scrollY * 0.18)}px) scale(1.08)`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const buttons = [...article.querySelectorAll("pre")].map((pre) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = styles.copy!;
      b.textContent = "copy";
      b.addEventListener("click", () => {
        void navigator.clipboard.writeText(pre.querySelector("code")?.textContent ?? "").then(
          () => { b.textContent = "copied"; },
          () => { b.textContent = "select & copy"; },
        );
      });
      pre.append(b);
      return b;
    });

    const onClick = (e: MouseEvent) => {
      const img = (e.target as Element).closest("img");
      if (img && article.contains(img)) setZoom({ src: img.currentSrc || img.src, alt: img.alt });
    };
    article.addEventListener("click", onClick);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setZoom(null); };
    addEventListener("keydown", onKey);

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("keydown", onKey);
      article.removeEventListener("click", onClick);
      buttons.forEach((b) => b.remove());
    };
  }, []);

  return (
    <>
      <div ref={bar} className={styles.progress} aria-hidden="true" />
      {zoom && (
        <button type="button" className={styles.zoom} onClick={() => setZoom(null)} aria-label="Close enlarged image">
          {/* eslint-disable-next-line @next/next/no-img-element -- already loaded, shown full size */}
          <img src={zoom.src} alt={zoom.alt} />
        </button>
      )}
    </>
  );
}
