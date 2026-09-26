// A viewfinder reticle that snaps to whatever you can click, chips hung on
// springs, and "say hi" letters that shy away from the cursor.

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export function startCursor({
  root,
  reticle,
  label,
  shy,
}: {
  root: HTMLElement;
  reticle: HTMLElement;
  label: HTMLElement;
  shy: HTMLElement;
}): () => void {
  root.dataset.cursor = "on";
  const cur = { x: -100, y: -100, tx: -100, ty: -100, w: 34, h: 34, tw: 34, th: 34 };
  let lock: HTMLElement | null = null;
  let inStage = false;
  let raf = 0;
  const springs = new WeakMap<HTMLElement, { x: number; y: number; vx: number; vy: number }>();
  const letters = [...shy.querySelectorAll<HTMLElement>("span")];

  const onMove = (ev: PointerEvent) => {
    cur.tx = ev.clientX;
    cur.ty = ev.clientY;
    const target = ev.target as Element;
    const hit = target.closest<HTMLElement>("a,button,input,textarea,[data-label]");
    inStage = !!target.closest("[data-stage]") && !target.closest("[data-reveal]");
    lock = hit && !inStage && root.contains(hit) ? hit : null;
    reticle.dataset.state = lock ? "locked" : inStage ? "lens" : "free";
    label.textContent = lock
      ? (lock.dataset.label ?? (lock.matches("input,textarea") ? "TYPE" : "AF"))
      : inStage
        ? "LENS"
        : "";
    for (const s of letters) {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const k = Math.max(0, 1 - Math.hypot(ev.clientX - cx, ev.clientY - cy) / 220);
      s.style.transform = k
        ? `translate(${(cx - ev.clientX) * 0.35 * k}px,${(cy - ev.clientY) * 0.35 * k}px) rotate(${(cx - ev.clientX) * 0.05 * k}deg)`
        : "";
    }
  };
  const onLeave = () => {
    cur.tx = cur.ty = -100;
  };

  function loop() {
    if (lock?.isConnected) {
      const r = lock.getBoundingClientRect(), pad = 6;
      cur.tw = r.width + pad * 2;
      cur.th = r.height + pad * 2;
      cur.x = lerp(cur.x, r.left + r.width / 2, 0.25);
      cur.y = lerp(cur.y, r.top + r.height / 2, 0.25);
    } else {
      cur.tw = cur.th = inStage ? 64 : 34;
      cur.x = lerp(cur.x, cur.tx, 0.35);
      cur.y = lerp(cur.y, cur.ty, 0.35);
    }
    cur.w = lerp(cur.w, cur.tw, 0.22);
    cur.h = lerp(cur.h, cur.th, 0.22);
    reticle.style.width = `${cur.w}px`;
    reticle.style.height = `${cur.h}px`;
    reticle.style.transform = `translate(${cur.x - cur.w / 2}px,${cur.y - cur.h / 2}px)`;

    // Chips: the cursor tugs them, and they wobble back when it leaves.
    for (const c of root.querySelectorAll<HTMLElement>("[data-chips] > *")) {
      const st = springs.get(c) ?? { x: 0, y: 0, vx: 0, vy: 0 };
      springs.set(c, st);
      const r = c.getBoundingClientRect();
      const cx = r.left + r.width / 2 - st.x, cy = r.top + r.height / 2 - st.y;
      const k = Math.max(0, 1 - Math.hypot(cur.tx - cx, cur.ty - cy) / 150);
      st.vx = (st.vx + ((cur.tx - cx) * 0.22 * k - st.x) * 0.14) * 0.78;
      st.vy = (st.vy + ((cur.ty - cy) * 0.3 * k - st.y) * 0.14) * 0.78;
      st.x += st.vx;
      st.y += st.vy;
      c.style.translate = `${st.x.toFixed(2)}px ${st.y.toFixed(2)}px`;
      c.style.rotate = `${(st.vx * 0.6).toFixed(2)}deg`;
    }
    raf = requestAnimationFrame(loop);
  }

  addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    delete root.dataset.cursor;
    for (const s of letters) s.style.transform = "";
  };
}
