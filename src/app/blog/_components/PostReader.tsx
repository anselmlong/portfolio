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
 * contents rail (and named in the phone strip), the next post racking into focus when you finish, copy
 * buttons on code, and images that grow out of the page into a full-screen view (by click, Enter or Space)
 * and settle back on close.
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
    // The desktop rail and the phone strip each list the same headings, in order.
    const navs = [...document.querySelectorAll("[data-toc]")].map((n) => [...n.querySelectorAll("a")]);
    const phone = document.querySelector<HTMLDetailsElement>("[data-toc-phone]");
    const now = phone?.querySelector("[data-toc-now]");
    const cover = document.querySelector<HTMLElement>("[data-cover]");
    const next = document.querySelector<HTMLElement>("[data-next]");
    let shown = -1;

    const onScroll = () => {
      const r = article.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      if (bar.current) bar.current.style.transform = `scaleX(${k})`;
      // Reaching the end racks the next post into focus, once.
      if (k > 0.98 && next && !next.hasAttribute("data-arrived")) next.setAttribute("data-arrived", "");
      let cur = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.3) cur = i; });
      navs.forEach((links) => links.forEach((a, i) => {
        a.toggleAttribute("data-on", i === cur);
        if (i === cur) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      }));
      const label = phone?.querySelectorAll("a")[cur]?.textContent;
      if (now && label && now.textContent !== label) {
        now.textContent = label;
        // The new name rolls in from the way you're reading: up from below going on, down from above going back.
        if (shown >= 0 && !still.current) {
          const y = cur > shown ? "0.6em" : "-0.6em";
          now.animate([{ opacity: 0, transform: `translateY(${y})` }, { opacity: 1, transform: "none" }], { duration: 280, easing: ease });
        }
      }
      shown = cur;
      if (cover && !still.current) cover.style.transform = `translateY(${Math.min(120, scrollY * 0.18)}px) scale(1.08)`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // The phone contents fold away after a jump, on Escape, or on a tap elsewhere.
    const fold = () => { if (phone) phone.open = false; };
    const onPick = (e: MouseEvent) => { if ((e.target as Element).closest("a")) fold(); };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !phone?.open) return;
      fold();
      phone.querySelector("summary")?.focus();
    };
    const onAway = (e: PointerEvent) => { if (phone?.open && !phone.contains(e.target as Node)) fold(); };
    // A long list opens at the section you're reading, not back at the top.
    const onOpen = () => {
      const list = phone?.querySelector<HTMLElement>("[data-toc]");
      const on = list?.querySelector<HTMLElement>("a[data-on]");
      if (!phone?.open || !list || !on) return;
      const l = list.getBoundingClientRect(), a = on.getBoundingClientRect();
      list.scrollTop += a.top - l.top - (l.height - a.height) / 2;
    };
    phone?.addEventListener("click", onPick);
    phone?.addEventListener("keydown", onEsc);
    phone?.addEventListener("toggle", onOpen);
    document.addEventListener("pointerdown", onAway);

    const buttons = [...article.querySelectorAll("pre")].map((pre) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = styles.copy!;
      b.textContent = "copy";
      b.addEventListener("click", () => {
        void navigator.clipboard.writeText(pre.querySelector("code")?.textContent ?? "").then(
          () => {
            b.textContent = "copied ✓";
            b.dataset.state = "copied";
            clearTimeout(Number(b.dataset.timer));
            b.dataset.timer = String(setTimeout(() => { b.textContent = "copy"; delete b.dataset.state; }, 1800));
          },
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
      phone?.removeEventListener("click", onPick);
      phone?.removeEventListener("keydown", onEsc);
      phone?.removeEventListener("toggle", onOpen);
      document.removeEventListener("pointerdown", onAway);
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
