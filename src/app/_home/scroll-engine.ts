// Drives the pinned sections below the chat. Each eases toward the scroll
// position so a notched mouse wheel glides instead of jumping.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export type ScrollParts = {
  root: HTMLElement;
  stage: HTMLElement;
  reel: {
    section: HTMLElement;
    track: HTMLElement;
    ghost: HTMLElement;
    count: HTMLElement;
    bar: HTMLElement;
  };
  dial: {
    section: HTMLElement;
    ring: SVGGElement;
    labels: SVGTextElement[];
    steps: number;
    onStep: (i: number) => void;
  };
  deck: { section: HTMLElement; cards: HTMLElement[] };
  sheet: {
    section: HTMLElement;
    sheet: HTMLElement;
    focus: HTMLElement;
    caption: HTMLElement;
  };
  onHeroScroll: (k: number) => void;
};

/**
 * Measures the viewport once in px so a collapsing phone toolbar, or a host
 * that sizes the frame to the page, can't stretch the pinned sections. Returns
 * true when pinning can't work, and the page should lay out flat.
 */
export function measureViewport(root: HTMLElement): {
  flat: boolean;
  cleanup: () => void;
} {
  const screenH = screen.availHeight || screen.height || innerHeight;
  let vh = Math.min(innerHeight, screenH),
    lastW = innerWidth;
  const flat = innerHeight > screenH * 1.5;
  root.style.setProperty("--vh", `${vh}px`);
  const onResize = () => {
    if (innerHeight > screenH * 1.5) root.dataset.flat = "true";
    if (innerWidth !== lastW || Math.abs(innerHeight - vh) > 140) {
      lastW = innerWidth;
      vh = Math.min(innerHeight, screenH);
      root.style.setProperty("--vh", `${vh}px`);
    }
  };
  addEventListener("resize", onResize);
  return { flat, cleanup: () => removeEventListener("resize", onResize) };
}

export function startScroll(p: ScrollParts): () => void {
  const vh = () =>
    parseFloat(getComputedStyle(p.root).getPropertyValue("--vh")) ||
    innerHeight;
  const progress = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - vh()));
  };

  const frames = [...p.reel.track.children] as HTMLElement[];
  function reel(k: number) {
    // Phones swipe the reel natively (see home.module.css); leave it alone there.
    if (innerWidth <= 700) return;
    const x = -(p.reel.track.scrollWidth - innerWidth) * k;
    p.reel.track.style.transform = `translate3d(${x}px,0,0)`;
    p.reel.ghost.style.transform = `translate3d(${x * 0.35}px,-50%,0)`;
    for (const f of frames) {
      const r = f.getBoundingClientRect();
      const c = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
      // Screenshots drift inside their frame; designed frames drift as a whole.
      const inner = f.querySelector<HTMLElement>("[data-drift]");
      if (inner)
        inner.style.transform = `translate3d(${c * -6}%,0,0) scale(${1 - Math.abs(c) * 0.05})`;
      f.style.opacity = String(1 - clamp(Math.abs(c) - 0.45) * 0.8);
    }
    const i = Math.min(frames.length - 1, Math.round(k * (frames.length - 1)));
    p.reel.count.textContent = `${String(i + 1).padStart(2, "0")} / ${String(frames.length).padStart(2, "0")}`;
    p.reel.bar.style.transform = `scaleX(${k})`;
  }

  let step = -1;
  // Ticks under the pointer grow and glow, like a lit scale on a lens barrel.
  const ticks = [...p.dial.ring.querySelectorAll("line")].map((line, i) => ({
    line,
    deg: (i / 120) * 360,
    a: (i / 120) * Math.PI * 2,
    r2: Number(line.dataset.r2 ?? 198),
  }));
  function spotlight(rotation: number) {
    for (const t of ticks) {
      const d = ((t.deg - rotation + 540) % 360) - 180;
      const c = Math.max(0, 1 - Math.abs(d) / 34);
      const r2 = t.r2 - c * c * 16;
      t.line.setAttribute("x2", (Math.sin(t.a) * r2).toFixed(1));
      t.line.setAttribute("y2", (-Math.cos(t.a) * r2).toFixed(1));
      t.line.style.stroke =
        c > 0.02 ? `rgba(255, 111, 85, ${(0.35 + 0.65 * c).toFixed(2)})` : "";
    }
  }

  function dial(k: number) {
    const f = k * (p.dial.steps - 1);
    p.dial.ring.setAttribute("transform", `rotate(${-f * 60})`);
    spotlight(f * 60);
    // Keep each year label upright while the ring turns.
    for (const t of p.dial.labels)
      t.setAttribute(
        "transform",
        `rotate(${f * 60} ${t.getAttribute("x")} ${Number(t.getAttribute("y")) - 4})`,
      );
    const i = Math.round(f);
    if (i !== step) {
      step = i;
      p.dial.onStep(i);
    }
  }

  function deck(k: number) {
    const e = 1 - Math.pow(1 - k, 3),
      cw = p.deck.cards[0]?.offsetWidth ?? 0;
    const spread = Math.min(cw * 1.05, (innerWidth - cw) / 2);
    const vertical = innerWidth < 700;
    // On phones the cards fan downwards; space them by their real height so they don't overlap.
    const ch = Math.max(...p.deck.cards.map((c) => c.offsetHeight), 0);
    const table = p.deck.cards[0]?.parentElement?.clientHeight ?? 0;
    const spreadY = Math.min(ch + 14, Math.max(90, (table - ch) / 2));
    p.deck.cards.forEach((c, i) => {
      const o = i - 1;
      const x = vertical ? 0 : o * spread * e,
        y = vertical ? o * spreadY * e : Math.abs(o) * 24 * e;
      const rot = o * (4 - 12 * e) + (i === 0 ? -3 : i === 2 ? 3 : 0) * (1 - e);
      c.style.transform = `translate(${x}px, calc(-50% + ${y}px)) rotate(${rot}deg)`;
      c.style.zIndex = i === 1 ? "3" : "2";
    });
  }

  // While zooming, the sheet is a GPU layer; once it settles the hint goes, so
  // the browser repaints the photo sharp at its zoomed size instead of stretching it.
  let settle = 0;
  function sheet(k: number) {
    const { sheet: s, focus, caption } = p.sheet;
    s.style.willChange = "transform";
    clearTimeout(settle);
    settle = window.setTimeout(() => (s.style.willChange = "auto"), 160);
    s.style.transform = "none";
    const r = focus.getBoundingClientRect(),
      b = s.getBoundingClientRect();
    const target = Math.min(innerWidth / r.width, vh() / r.height) * 1.02;
    const e = k < 0.15 ? 0 : clamp((k - 0.15) / 0.7);
    const ee = e * e * (3 - 2 * e);
    s.style.transformOrigin = `${r.left + r.width / 2 - b.left}px ${r.top + r.height / 2 - b.top}px`;
    const dx = (innerWidth / 2 - (r.left + r.width / 2)) * ee;
    const dy = (vh() / 2 - (r.top + r.height / 2)) * ee;
    s.style.transform = `translate(${dx}px,${dy}px) scale(${1 + (target - 1) * ee})`;
    for (const f of s.children as HTMLCollectionOf<HTMLElement>)
      if (f !== focus) f.style.opacity = String(1 - ee);
    const fc = focus.querySelector<HTMLElement>("figcaption");
    if (fc) fc.style.opacity = String(1 - ee);
    // The outline would scale up with the photo; let it go as the photo takes over.
    focus.style.setProperty("--zoom", ee.toFixed(3));
    const shown = clamp((k - 0.8) / 0.15);
    caption.style.opacity = String(shown);
    // The link only takes clicks once you can actually see it.
    caption.dataset.live = String(shown > 0.5);
  }

  const parts: [HTMLElement, (k: number) => void][] = [
    [p.reel.section, reel],
    [p.dial.section, dial],
    [p.deck.section, deck],
    [p.sheet.section, sheet],
  ];
  const eased = new Map(parts.map(([el]) => [el, progress(el)]));
  let raf = 0,
    drawn = false;
  function tick() {
    if (p.root.dataset.flat === "true") {
      for (const [, fn] of parts) fn(0);
      return;
    }
    for (const [el, fn] of parts) {
      const target = progress(el),
        cur = eased.get(el) ?? target;
      const next =
        Math.abs(target - cur) < 0.0005 ? target : cur + (target - cur) * 0.16;
      if (next !== cur || !drawn) {
        eased.set(el, next);
        fn(next);
      }
    }
    drawn = true;
    const r = p.stage.getBoundingClientRect();
    p.onHeroScroll(clamp(-r.top / r.height));
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    clearTimeout(settle);
  };
}
