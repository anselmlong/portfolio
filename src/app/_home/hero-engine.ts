import type { Scene } from "~/lib/home-content";

// Paints Anselm's footage (or the scene an answer is about) through the letters
// of his name. A cursor lens, a hover peek and typing all nudge the mask.

type Source = HTMLVideoElement | HTMLImageElement;

export type HeroHandle = {
  setScene: (scene: Scene | null) => void;
  setPeek: (scene: Scene | null) => void;
  bump: () => void;
  setScroll: (k: number) => void;
  destroy: () => void;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ready = (s: Source | undefined): s is Source =>
  !!s &&
  (s instanceof HTMLVideoElement
    ? s.readyState >= 2
    : s.complete && s.naturalWidth > 0);

export function startHero({
  stage,
  canvas,
  videos,
  posters,
  still,
  finePointer,
  onLabel,
}: {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  videos: HTMLVideoElement[];
  posters: string[];
  still: boolean;
  finePointer: boolean;
  onLabel: (clipIndex: number | null, scene: Scene | null) => void;
}): HeroHandle {
  const ctx = canvas.getContext("2d");
  const mask = document.createElement("canvas");
  const mctx = mask.getContext("2d");
  if (!ctx || !mctx) {
    const idle = () => undefined;
    return {
      setScene: idle,
      setPeek: idle,
      bump: idle,
      setScroll: idle,
      destroy: idle,
    };
  }

  const images = new Map<string, HTMLImageElement>();
  const image = (src: string) => {
    let i = images.get(src);
    if (!i) {
      i = new Image();
      i.src = src;
      i.addEventListener("load", kick);
      images.set(src, i);
    }
    return i;
  };
  const posterImgs = posters.map(image);

  let W = 0,
    H = 0,
    dpr = 1;
  const t0 = performance.now();
  let open = 0,
    openTarget = 0,
    peekAmt = 0,
    bump = 0,
    scrollK = 0;
  let clipIdx = 0,
    clipFade = 1,
    lastSwap = performance.now();
  let scene: Scene | null = null,
    sceneStart = 0;
  let peek: Scene | null = null,
    peekStart = 0;
  const lens = { x: 0, y: 0, tx: 0, ty: 0, r: 0, tr: 0, pulse: 0 };
  let raf = 0,
    visible = true,
    alive = true;

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = stage.clientWidth;
    H = stage.clientHeight;
    canvas.width = mask.width = Math.round(W * dpr);
    canvas.height = mask.height = Math.round(H * dpr);
    kick();
  }

  function cover(src: Source, zoom = 1, panY = 0.5, alpha = 1, dx = 0, dy = 0) {
    const sw =
      src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth;
    const sh =
      src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight;
    if (!sw || !ctx) return;
    const s = Math.max(W / sw, H / sh) * zoom,
      dw = sw * s,
      dh = sh * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(src, (W - dw) / 2 + dx, (H - dh) * panY + dy, dw, dh);
    ctx.globalAlpha = 1;
  }

  const clipSource = (i: number): Source | undefined =>
    ready(videos[i]) ? videos[i] : posterImgs[i];

  function footage(now: number) {
    const prev = (clipIdx + videos.length - 1) % videos.length;
    const push = still ? 1.06 : 1.06 + ((now - lastSwap) / 7000) * 0.06;
    // Footage drifts slightly against the cursor, so the letters feel like a window.
    const dx = still ? 0 : (lens.x / (W || 1) - 0.5) * -24;
    const dy = still ? 0 : (lens.y / (H || 1) - 0.5) * -16;
    const a = clipSource(prev),
      b = clipSource(clipIdx);
    if (clipFade < 1 && a) cover(a, 1.12, 0.5, 1, dx, dy);
    if (b) cover(b, push, 0.5, clipFade, dx, dy);
  }

  function content(now: number) {
    const sc = scene ?? peek;
    if (!sc || sc.kind === "clip") return footage(now);
    const e = (now - (scene ? sceneStart : peekStart)) / 1000;
    if (sc.kind === "pan") {
      const s = image(sc.src);
      if (!ready(s)) return footage(now);
      // Scroll slowly down the screenshot and back.
      const k = still ? 0 : (Math.sin(e * 0.35 - Math.PI / 2) + 1) / 2;
      cover(s, 1.02, k * 0.9);
      return;
    }
    const n = sc.srcs.length,
      per = 3.2;
    const i = still ? 0 : Math.floor(e / per) % n;
    const f = still ? 1 : Math.min(1, (e % per) / 0.6);
    const a = image(sc.srcs[(i + n - 1) % n]!),
      b = image(sc.srcs[i]!);
    if (ready(a) && f < 1) cover(a, 1.12);
    if (ready(b)) cover(b, still ? 1.02 : 1.02 + (e % per) * 0.025, 0.5, f);
  }

  function draw(now: number) {
    raf = 0;
    if (!alive || !ctx || !mctx) return;
    const e = (now - t0) / 1000;
    const k = still ? 1 : 0.085;
    open += (openTarget - open) * k;
    peekAmt += ((!scene && peek ? 0.28 : 0) - peekAmt) * (still ? 1 : 0.1);
    bump *= 0.9;
    lens.x = lerp(lens.x, lens.tx, 0.18);
    lens.y = lerp(lens.y, lens.ty, 0.18);
    lens.pulse *= 0.92;
    lens.r = lerp(lens.r, lens.tr + lens.pulse, 0.12);
    if (!still && !scene && !peek && now - lastSwap > 6500) {
      clipIdx = (clipIdx + 1) % videos.length;
      clipFade = 0;
      lastSwap = now;
      onLabel(clipIdx, null);
    }
    clipFade = Math.min(1, clipFade + (still ? 1 : 0.025));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    content(now);
    ctx.restore();

    // The mask: the name, a fill for open scenes and peeks, and the cursor lens.
    const word = "ANSELM";
    const fs = Math.min(H * 0.7, W / 3.7);
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.clearRect(0, 0, W, H);
    mctx.fillStyle = "#fff";
    const fill = Math.max(open * 1.25, peekAmt);
    if (fill > 0.01) {
      mctx.globalAlpha = Math.min(1, fill);
      mctx.fillRect(0, 0, W, H);
      mctx.globalAlpha = 1;
    }
    if (lens.r > 2) {
      const g = mctx.createRadialGradient(
        lens.x,
        lens.y,
        0,
        lens.x,
        lens.y,
        lens.r,
      );
      g.addColorStop(0, "rgba(255,255,255,.95)");
      g.addColorStop(0.55, "rgba(255,255,255,.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      mctx.fillStyle = g;
      mctx.fillRect(lens.x - lens.r, lens.y - lens.r, lens.r * 2, lens.r * 2);
      mctx.fillStyle = "#fff";
    }
    const family =
      getComputedStyle(stage).getPropertyValue("--hero-font").trim() ||
      "Impact, sans-serif";
    mctx.font = `900 ${fs}px ${family}`;
    const widths = [...word].map((ch) => mctx.measureText(ch).width);
    const gap = fs * (0.02 + (open + bump) * 0.9 + scrollK * 0.1);
    const total = widths.reduce((a, b) => a + b, 0) + gap * (word.length - 1);
    let x = (W - total) / 2;
    const base = H / 2 + fs * 0.36;
    [...word].forEach((ch, i) => {
      const w = widths[i]!;
      const intro = still ? 1 : clamp((e - 0.15 - i * 0.09) / 0.7);
      const ease = 1 - Math.pow(1 - intro, 3);
      const cx = x + w / 2;
      // Letters near the cursor lift a little toward it.
      const near =
        still || lens.tr === 0
          ? 0
          : Math.max(
              0,
              1 - Math.hypot(lens.x - cx, lens.y - H / 2) / (fs * 1.2),
            );
      mctx.save();
      mctx.globalAlpha = ease;
      mctx.translate(cx, base + (1 - ease) * fs * 0.45 - near * fs * 0.06);
      const sc = 1 + open * 0.35 + scrollK * 0.14 + near * 0.05;
      mctx.scale(sc, sc);
      mctx.fillText(ch, -w / 2, 0);
      mctx.restore();
      x += w + gap;
    });
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(mask, 0, 0);
    ctx.restore();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const vg = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.35,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.75,
    );
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, `rgba(0,0,0,${0.25 + open * 0.25})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    stage.dataset.live ??= "true";
    if (!still && visible) raf = requestAnimationFrame(draw);
  }

  function kick() {
    if (!raf && alive) raf = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(size);
  ro.observe(stage);
  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    if (visible) kick();
  });
  io.observe(stage);
  const onVideo = () => kick();
  videos.forEach((v) => {
    v.addEventListener("loadeddata", onVideo);
    void v.play().catch(() => undefined);
  });
  void document.fonts?.ready.then(kick);
  size();

  const onMove = (ev: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    lens.tx = ev.clientX - r.left;
    lens.ty = ev.clientY - r.top;
    lens.tr = Math.min(W, H) * 0.2;
    if (lens.r < 1) {
      lens.x = lens.tx;
      lens.y = lens.ty;
    }
    const ty = ((ev.clientX - r.left) / r.width - 0.5) * 5;
    const tx = -((ev.clientY - r.top) / r.height - 0.5) * 4;
    stage.style.transform = `rotateX(${tx}deg) rotateY(${ty}deg)`;
  };
  const onLeave = () => {
    stage.style.transform = "";
    lens.tr = 0;
  };
  const onDown = (ev: PointerEvent) => {
    if (!(ev.target as Element).closest("[data-reveal]"))
      lens.pulse = Math.min(W, H) * 0.35;
  };
  if (!still && finePointer) {
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
  }

  function switchClip(sc: Scene | null) {
    if (sc?.kind === "clip" && sc.clip !== clipIdx) {
      clipIdx = sc.clip;
      clipFade = 0;
      lastSwap = performance.now();
    }
  }

  return {
    setScene(next) {
      scene = next;
      sceneStart = performance.now();
      openTarget = !next ? 0 : next.kind === "clip" ? 0.55 : 1;
      switchClip(next);
      onLabel(next ? null : clipIdx, next);
      kick();
    },
    setPeek(next) {
      if (scene || still) return;
      peek = next;
      peekStart = performance.now();
      switchClip(next);
      kick();
    },
    bump() {
      if (!still) bump = Math.min(0.12, bump + 0.035);
      kick();
    },
    setScroll(k) {
      scrollK = k;
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      videos.forEach((v) => v.removeEventListener("loadeddata", onVideo));
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
    },
  };
}
