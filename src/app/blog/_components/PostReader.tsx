"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../blog.module.css";

const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/** Where an image of this size sits when it fills the screen, capped at its own resolution. */
function fitted(img: HTMLImageElement) {
  const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
  const pad = innerWidth < 600 ? 16 : 40;
  const s = Math.min(1, (innerWidth - pad * 2) / w, (innerHeight - pad * 2 - 44) / h);
  return { width: w * s, height: h * s, left: (innerWidth - w * s) / 2, top: (innerHeight - h * s) / 2 };
}

/** The transform that makes a full-screen image sit exactly over its place in the post. */
function from(src: HTMLImageElement, to: ReturnType<typeof fitted>) {
  const r = src.getBoundingClientRect();
  return `translate(${r.left - to.left}px,${r.top - to.top}px) scale(${r.width / to.width},${r.height / to.height})`;
}

const onScreen = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight;
};

/**
 * Reading aids for a post: a progress bar, the current section lit in the
 * contents rail, copy buttons on code, and images that grow out of the page
 * into a full-screen view (by click, Enter or Space) and settle back on close.
 */
export function PostReader() {
  const bar = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const big = useRef<HTMLImageElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const shut = useRef<HTMLButtonElement>(null);
  const still = useRef(false);
  const leaving = useRef(false);
  const [zoom, setZoom] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>("[data-article]");
    if (!article) return;
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      if (cover && !still.current) cover.style.transform = `translateY(${Math.min(120, scrollY * 0.18)}px) scale(1.08)`;
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

    // Images inside links keep navigating; the rest can be enlarged from the keyboard too.
    const zoomable = [...article.querySelectorAll("img")].filter((img) => !img.closest("a"));
    zoomable.forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", img.alt ? `Enlarge image: ${img.alt}` : "Enlarge image");
      img.setAttribute("aria-haspopup", "dialog");
    });
    const pick = (t: EventTarget | null) => {
      const img = (t as Element | null)?.closest?.("img");
      return img && zoomable.includes(img) ? img : null;
    };
    const onClick = (e: MouseEvent) => {
      const img = pick(e.target);
      if (img) setZoom(img);
    };
    const onKey = (e: KeyboardEvent) => {
      const img = pick(e.target);
      if (!img || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      setZoom(img);
    };
    article.addEventListener("click", onClick);
    article.addEventListener("keydown", onKey);

    return () => {
      removeEventListener("scroll", onScroll);
      article.removeEventListener("click", onClick);
      article.removeEventListener("keydown", onKey);
      buttons.forEach((b) => b.remove());
      zoomable.forEach((img) => {
        img.removeAttribute("tabindex");
        ["role", "aria-label", "aria-haspopup"].forEach((a) => img.removeAttribute(a));
      });
    };
  }, []);

  // Open: the photo leaves its spot in the post and grows to fill the screen.
  useEffect(() => {
    const d = dialog.current, img = big.current;
    if (!zoom || !d || !img) return;
    const place = () => {
      const to = fitted(zoom);
      Object.assign(img.style, { width: `${to.width}px`, height: `${to.height}px`, left: `${to.left}px`, top: `${to.top}px` });
      return to;
    };
    const to = place();
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    shut.current?.focus();
    leaving.current = false;
    if (!still.current && onScreen(zoom)) {
      zoom.style.visibility = "hidden";
      img.animate([{ transform: from(zoom, to) }, { transform: "none" }], { duration: 460, easing: ease });
      shade.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: "ease-out" });
    }
    addEventListener("resize", place);
    return () => {
      removeEventListener("resize", place);
      zoom.style.visibility = "";
    };
  }, [zoom]);

  // However the dialog closed, put the photo back and hand focus back to it.
  function settle() {
    const src = zoom;
    dialog.current?.removeAttribute("open");
    setZoom(null);
    if (!src) return;
    src.style.visibility = "";
    src.focus({ preventScroll: true });
  }

  // Close: it settles back where it came from, or fades if you've scrolled it away.
  function close() {
    const d = dialog.current, img = big.current, src = zoom;
    if (!d || !img || !src || leaving.current) return;
    leaving.current = true;
    const done = () => {
      if (typeof d.close === "function") d.close();
      else settle();
    };
    if (still.current || typeof img.animate !== "function") return done();
    const back = onScreen(src)
      ? img.animate([{ transform: "none" }, { transform: from(src, fitted(src)) }], { duration: 380, easing: ease, fill: "forwards" })
      : img.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
    shade.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease-in", fill: "forwards" });
    back.finished.then(done, done);
  }

  return (
    <>
      <div ref={bar} className={styles.progress} aria-hidden="true" />
      <dialog
        ref={dialog}
        className={styles.zoom}
        aria-label={zoom?.alt ? `Enlarged image: ${zoom.alt}` : "Enlarged image"}
        onCancel={(e) => { e.preventDefault(); close(); }}
        onClose={settle}
        onClick={close}
      >
        {zoom && (
          <>
            <div ref={shade} className={styles.shade} />
            {/* eslint-disable-next-line @next/next/no-img-element -- already loaded, shown full size */}
            <img ref={big} src={zoom.currentSrc || zoom.src} alt={zoom.alt} />
            <button ref={shut} type="button" className={styles.close}>
              close <kbd>esc</kbd>
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
