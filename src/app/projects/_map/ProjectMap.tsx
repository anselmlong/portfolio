"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { groups, statuses, type Status } from "~/lib/projects";
import type { MapLink } from "~/server/projects";
import {
  H,
  W,
  anchors,
  laneY,
  month,
  statusX,
  step,
  type Body,
  type Layout,
} from "./sim";
import styles from "./map.module.css";

type Placed = Omit<Body, "vx" | "vy" | "fx" | "fy">;
type Cam = { x: number; y: number; k: number };

const order: Status[] = ["live", "building", "done", "shelved", "unsorted"];
const layouts: { key: Layout; label: string }[] = [
  { key: "map", label: "map" },
  { key: "status", label: "by status" },
  { key: "time", label: "timeline" },
];
const monthName = (t: number, t0: number) => {
  const m = t0 + t;
  return new Date(Math.floor(m / 12), m % 12, 1).toLocaleDateString("en-SG", {
    month: "short",
    year: "numeric",
  });
};

/**
 * Every project as a star in a constellation: live ones broadcast, works in
 * progress spin, finished ones glow steady and shelved ones are outlines.
 * Related projects are joined, and hovering a line says why. It opens by
 * replaying how the sky filled in, year by year.
 */
export function ProjectMap({
  placed,
  links,
}: {
  placed: Placed[];
  links: MapLink[];
}) {
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);
  const nodeEls = useRef(new Map<string, SVGGElement>());
  const edgeEls = useRef<(SVGGElement | null)[]>([]);
  const groupEls = useRef(new Map<string, SVGTextElement>());
  const labelEls = useRef(new Map<string, { el: SVGTextElement; w: number }>());
  const visible = useRef(new Set<string>());
  const bodies = useRef<Body[]>(
    placed.map((p) => ({ ...p, vx: 0, vy: 0, fx: null, fy: null })),
  );
  const cam = useRef<Cam>({ x: 0, y: 0, k: 1 });
  const alpha = useRef(0);
  const raf = useRef(0);
  const still = useRef(false);
  const layoutRef = useRef<Layout>("map");

  const span = Math.max(...placed.map((p) => p.t));
  const t0 = Math.min(...placed.map((p) => month(p.started)));
  const [layout, setLayout] = useState<Layout>("map");
  const [hover, setHover] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [off, setOff] = useState<Set<Status>>(new Set());
  const [term, setTerm] = useState("");
  const [cutoff, setCutoff] = useState(span);
  const [playing, setPlaying] = useState(false);
  const [list, setList] = useState(false);

  const byId = useMemo(() => new Map(placed.map((p) => [p.id, p])), [placed]);
  const near = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const l of links) {
      m.set(l.source, (m.get(l.source) ?? new Set()).add(l.target));
      m.set(l.target, (m.get(l.target) ?? new Set()).add(l.source));
    }
    return m;
  }, [links]);
  const focus = hover ?? picked;
  const q = term.trim().toLowerCase();
  const matches = (p: Placed) =>
    !q ||
    `${p.name} ${p.blurb ?? ""} ${p.language ?? ""} ${groups[p.group]}`
      .toLowerCase()
      .includes(q);
  const counts = order.map(
    (s) => [s, placed.filter((p) => p.status === s).length] as const,
  );

  // Draw: move every node and edge to where the simulation has it.
  // Each name tries below its dot, then above, right and left, and takes the
  // first spot that clears every dot and every name already placed. Bigger
  // projects choose first. A name with nowhere to go waits for hover or focus.
  function placeLabels() {
    const bodiesNow = bodies.current.filter((b) => visible.current.has(b.id));
    type Box = { x0: number; y0: number; x1: number; y1: number };
    const hit = (a: Box, b: Box) =>
      a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    const taken: Box[] = bodiesNow.map((b) => ({
      x0: b.x - b.r,
      y0: b.y - b.r,
      x1: b.x + b.r,
      y1: b.y + b.r,
    }));
    for (const b of [...bodiesNow].sort((p, q) => q.r - p.r)) {
      let entry = labelEls.current.get(b.id);
      if (!entry) {
        const el = nodeEls.current
          .get(b.id)
          ?.querySelector<SVGTextElement>(`.${styles.label}`);
        if (!el) continue;
        entry = { el, w: el.getComputedTextLength() || b.name.length * 7.2 };
        labelEls.current.set(b.id, entry);
      }
      const { el, w } = entry;
      const spots = [
        { dx: 0, dy: b.r + 16, anchor: "middle", x0: -w / 2, y0: b.r + 5 },
        { dx: 0, dy: -b.r - 8, anchor: "middle", x0: -w / 2, y0: -b.r - 19 },
        { dx: b.r + 7, dy: 4, anchor: "start", x0: b.r + 5, y0: -7 },
        { dx: -b.r - 7, dy: 4, anchor: "end", x0: -b.r - 9 - w, y0: -7 },
      ];
      const own = (s: (typeof spots)[number]): Box => ({
        x0: b.x + s.x0,
        y0: b.y + s.y0,
        x1: b.x + s.x0 + w + 4,
        y1: b.y + s.y0 + 14,
      });
      const self = taken.findIndex(
        (t) => t.x0 === b.x - b.r && t.y0 === b.y - b.r,
      );
      const spot = spots.find((s) => {
        const box = own(s);
        return !taken.some((t, i) => i !== self && hit(box, t));
      });
      const use = spot ?? spots[0]!;
      el.setAttribute("x", String(use.dx));
      el.setAttribute("y", String(use.dy));
      el.setAttribute("text-anchor", use.anchor);
      el.toggleAttribute("data-tucked", !spot);
      if (spot) taken.push(own(spot));
    }
  }

  const draw = useCallback(() => {
    const c = cam.current;
    world.current?.setAttribute(
      "transform",
      `translate(${c.x} ${c.y}) scale(${c.k})`,
    );
    const at = new Map(bodies.current.map((b) => [b.id, b]));
    for (const b of bodies.current)
      nodeEls.current
        .get(b.id)
        ?.setAttribute(
          "transform",
          `translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`,
        );
    // Each group's name floats just above its cluster, wherever it drifts.
    for (const [g, el] of groupEls.current) {
      const members = bodies.current.filter((b) => b.group === g);
      if (!members.length) continue;
      const x = members.reduce((s, b) => s + b.x, 0) / members.length;
      const y = Math.min(...members.map((b) => b.y - b.r));
      el.setAttribute("x", x.toFixed(1));
      el.setAttribute("y", (y - 34).toFixed(1));
    }
    placeLabels();
    links.forEach((l, i) => {
      const a = at.get(l.source),
        b = at.get(l.target),
        g = edgeEls.current[i];
      if (!a || !b || !g) return;
      const line = g.firstElementChild as SVGLineElement;
      line.setAttribute("x1", a.x.toFixed(1));
      line.setAttribute("y1", a.y.toFixed(1));
      line.setAttribute("x2", b.x.toFixed(1));
      line.setAttribute("y2", b.y.toFixed(1));
      g.lastElementChild?.setAttribute(
        "transform",
        `translate(${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2).toFixed(1)})`,
      );
    });
  }, [links]);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const frame = () => {
      if (alpha.current > 0.02) {
        step(bodies.current, links, layoutRef.current, alpha.current);
        alpha.current *= 0.985;
        draw();
        raf.current = requestAnimationFrame(frame);
      } else raf.current = 0;
    };
    raf.current = requestAnimationFrame(frame);
  }, [draw, links]);
  const heat = useCallback(
    (a: number) => {
      if (still.current) {
        for (let i = 0; i < 260; i++)
          step(
            bodies.current,
            links,
            layoutRef.current,
            Math.max(0.05, 1 - i / 260),
          );
        draw();
        return;
      }
      alpha.current = Math.max(alpha.current, a);
      if (!raf.current) run();
    },
    [draw, links, run],
  );
  // Fit the camera so the whole sky is in view.
  // Move the camera, easing unless motion is reduced.
  const glide = useCallback(
    (to: Cam) => {
      if (still.current) {
        cam.current = to;
        return draw();
      }
      const from = { ...cam.current },
        start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 650),
          e = 1 - (1 - t) ** 3;
        cam.current = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          k: from.k + (to.k - from.k) * e,
        };
        draw();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [draw],
  );
  const fit = useCallback(() => glide({ x: 0, y: 0, k: 1 }), [glide]);

  useEffect(() => {
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On a phone the whole sky is too small to read, so start zoomed in on its middle.
    if (innerWidth < 700) {
      const k = 2;
      cam.current = { k, x: W / 2 - (W / 2) * k, y: H / 2 - (H / 2) * k };
    }
    draw();
    if (still.current) return;
    // Open by replaying the sky filling in, month by month.
    setCutoff(-1);
    setPlaying(true);
  }, [draw]);

  // Projects appearing or being filtered out free up (or claim) label room.
  useEffect(() => draw(), [cutoff, off, draw]);

  // A new layout re-forms the sky and pulls the camera back to see all of it.
  const firstLayout = useRef(true);
  useEffect(() => {
    layoutRef.current = layout;
    heat(0.9);
    if (firstLayout.current) firstLayout.current = false;
    else fit();
  }, [layout, heat, fit]);

  // Timeline playback.
  useEffect(() => {
    if (!playing) return;
    let last = performance.now(),
      id = 0,
      cur = cutoff >= span ? -1 : cutoff;
    const tick = (now: number) => {
      cur += ((now - last) / 1000) * Math.max(6, span / 6);
      last = now;
      if (cur >= span) {
        setCutoff(span);
        setPlaying(false);
        return;
      }
      setCutoff(Math.floor(cur));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- starts from the cutoff at the moment play is pressed
  }, [playing, span]);

  // Screen point to world point.
  const toWorld = (cx: number, cy: number) => {
    const s = svg.current!;
    const pt = new DOMPoint(cx, cy).matrixTransform(
      s.getScreenCTM()!.inverse(),
    );
    const c = cam.current;
    return { x: (pt.x - c.x) / c.k, y: (pt.y - c.y) / c.k, vx: pt.x, vy: pt.y };
  };

  const flyTo = useCallback(
    (id: string) => {
      const b = bodies.current.find((x) => x.id === id);
      if (!b) return;
      const k = Math.max(cam.current.k, 1.35);
      glide({ k, x: W * 0.4 - b.x * k, y: H / 2 - b.y * k });
    },
    [glide],
  );

  const pick = (id: string | null) => {
    setPicked(id);
    if (id) flyTo(id);
  };

  // Pointer: drag a node to fling it, drag the sky to pan, wheel or pinch to zoom.
  const drag = useRef<{
    id: string | null;
    moved: boolean;
    sx: number;
    sy: number;
    cam: Cam;
  } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{
    d: number;
    k: number;
    mid: { x: number; y: number };
  } | null>(null);

  const onDown = (e: React.PointerEvent, id: string | null) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const mid = toWorld((a!.x + b!.x) / 2, (a!.y + b!.y) / 2);
      pinch.current = {
        d: Math.hypot(a!.x - b!.x, a!.y - b!.y),
        k: cam.current.k,
        mid: { x: mid.vx, y: mid.vy },
      };
      drag.current = null;
      return;
    }
    drag.current = {
      id,
      moved: false,
      sx: e.clientX,
      sy: e.clientY,
      cam: { ...cam.current },
    };
    e.stopPropagation();
  };
  const onMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      zoomAt(
        pinch.current.mid,
        Math.min(3, Math.max(0.5, (pinch.current.k * d) / pinch.current.d)),
      );
      return;
    }
    const g = drag.current;
    if (!g) return;
    if (Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 4) g.moved = true;
    if (!g.moved) return;
    if (g.id) {
      const b = bodies.current.find((x) => x.id === g.id)!;
      const w = toWorld(e.clientX, e.clientY);
      b.fx = w.x;
      b.fy = w.y;
      heat(0.35);
    } else {
      const s = svg.current!.getScreenCTM()!;
      cam.current = {
        ...g.cam,
        x: g.cam.x + (e.clientX - g.sx) / s.a,
        y: g.cam.y + (e.clientY - g.sy) / s.d,
      };
      draw();
    }
  };
  const onUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    const g = drag.current;
    drag.current = null;
    if (!g) return;
    if (g.id) {
      const b = bodies.current.find((x) => x.id === g.id);
      if (b && g.moved) {
        // Let go and it springs back into place.
        b.fx = b.fy = null;
        heat(0.5);
      }
      if (!g.moved) pick(g.id);
    } else if (!g.moved) setPicked(null);
  };
  const zoomAt = (p: { x: number; y: number }, k: number) => {
    const c = cam.current;
    const wx = (p.x - c.x) / c.k,
      wy = (p.y - c.y) / c.k;
    cam.current = { k, x: p.x - wx * k, y: p.y - wy * k };
    draw();
  };
  useEffect(() => {
    const s = svg.current;
    if (!s) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        s.getScreenCTM()!.inverse(),
      );
      const k = Math.min(
        3,
        Math.max(0.5, cam.current.k * Math.exp(-e.deltaY * 0.0015)),
      );
      zoomAt({ x: p.x, y: p.y }, k);
    };
    s.addEventListener("wheel", onWheel, { passive: false });
    return () => s.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- zoomAt only touches refs
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPicked(null);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const shown = (p: Placed) => !off.has(p.status) && p.t <= cutoff;
  visible.current = new Set(placed.filter(shown).map((p) => p.id));
  const sel = picked ? byId.get(picked) : null;
  const used = (Object.keys(groups) as (keyof typeof groups)[]).filter((g) =>
    placed.some((p) => p.group === g),
  );
  const at = anchors(used);
  const year = monthName(Math.max(0, Math.min(span, cutoff)), t0);

  return (
    <div
      className={styles.root}
      data-layout={layout}
      data-focus={focus ? "" : undefined}
    >
      <header className={styles.top}>
        <div className={styles.title}>
          <Link href="/" className={styles.mono} data-label="BACK">
            ← anselmlong.com
          </Link>
          <h1>Project map</h1>
          <p>
            {placed.length} things i&apos;ve made, half-made, and walked away
            from. lines join projects that are related; hover one to see why.
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.seg} role="group" aria-label="Layout">
            {layouts.map((l) => (
              <button
                key={l.key}
                type="button"
                aria-pressed={layout === l.key && !list}
                onClick={() => {
                  setList(false);
                  setLayout(l.key);
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={list}
              onClick={() => setList(!list)}
            >
              list
            </button>
          </div>
          <label className={styles.search}>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="find a project"
              aria-label="Find a project"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => {
                const first = placed.find((p) => shown(p) && matches(p));
                if (e.key === "Enter" && first) {
                  setList(false);
                  pick(first.id);
                }
              }}
            />
          </label>
        </div>
      </header>

      <div className={styles.stage} hidden={list}>
        <svg
          ref={svg}
          className={styles.sky}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={(e) => onDown(e, null)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-label="Project map"
          role="group"
        >
          <defs>
            <radialGradient id="pm-glow">
              <stop offset="0%" stopColor="#ff6f55" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff6f55" stopOpacity="0" />
            </radialGradient>
            <pattern
              id="pm-dots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#2e2929" />
            </pattern>
          </defs>
          <text
            className={styles.year}
            x={W / 2}
            y={H / 2 + 90}
            textAnchor="middle"
            aria-hidden="true"
          >
            {year.split(" ")[1]}
          </text>
          <g ref={world}>
            <rect
              x={-W}
              y={-H}
              width={W * 3}
              height={H * 3}
              fill="url(#pm-dots)"
            />
            <g className={styles.groupNames} aria-hidden="true">
              {layout === "map" &&
                used.map((g) => (
                  <text
                    key={g}
                    ref={(el) => {
                      if (el) groupEls.current.set(g, el);
                      else groupEls.current.delete(g);
                    }}
                    x={at[g].x}
                    y={at[g].y}
                    textAnchor="middle"
                  >
                    {groups[g]}
                  </text>
                ))}
              {layout === "status" &&
                order
                  .filter((s) => counts.find(([k]) => k === s)![1])
                  .map((s) => {
                    return (
                      <text
                        key={s}
                        x={statusX(s)}
                        y={130}
                        textAnchor="middle"
                        className={styles.colHead}
                      >
                        {statuses[s].label}
                      </text>
                    );
                  })}
              {layout === "time" &&
                Array.from({ length: Math.floor(span / 12) + 2 }, (_, i) => {
                  // The first tick is where the timeline starts; the rest are new years.
                  const m =
                    i === 0 ? 0 : Math.ceil(t0 / 12) * 12 + (i - 1) * 12 - t0;
                  if (m < 0 || m > span || (i > 0 && m === 0)) return null;
                  const x = 150 + (m / Math.max(1, span)) * (W - 300);
                  return (
                    <g key={m} className={styles.tick}>
                      <line x1={x} x2={x} y1={150} y2={H - 150} />
                      <text x={x} y={138} textAnchor="middle">
                        {Math.floor((t0 + m) / 12)}
                      </text>
                    </g>
                  );
                })}
              {layout === "time" &&
                used.map((g) => (
                  <text key={g} x={24} y={laneY(g) + 4} className={styles.lane}>
                    {groups[g]}
                  </text>
                ))}
            </g>

            <g className={styles.edges}>
              {links.map((l, i) => {
                const a = byId.get(l.source)!,
                  b = byId.get(l.target)!;
                const on = focus === l.source || focus === l.target;
                return (
                  <g
                    key={`${l.source}-${l.target}`}
                    ref={(el) => {
                      edgeEls.current[i] = el;
                    }}
                    data-on={on || undefined}
                    data-off={!shown(a) || !shown(b) || undefined}
                  >
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                    <g
                      transform={`translate(${(a.x + b.x) / 2} ${(a.y + b.y) / 2})`}
                    >
                      <text textAnchor="middle" dy="-6">
                        {l.why}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            <g className={styles.nodes}>
              {placed.map((p) => {
                const visible = shown(p);
                const lit =
                  !focus || focus === p.id || !!near.get(focus)?.has(p.id);
                return (
                  <g
                    key={p.id}
                    ref={(el) => {
                      if (el) nodeEls.current.set(p.id, el);
                    }}
                    transform={`translate(${p.x} ${p.y})`}
                    className={styles.node}
                    data-status={p.status}
                    data-off={!visible || undefined}
                    data-dim={!lit || !matches(p) || undefined}
                    data-picked={picked === p.id || undefined}
                    role="button"
                    tabIndex={visible ? 0 : -1}
                    aria-label={`${p.name}, ${statuses[p.status].label}${p.users ? `, ${p.users}` : ""}${p.stars ? `, ${p.stars} stars` : ""}`}
                    onPointerDown={(e) => onDown(e, p.id)}
                    onPointerEnter={() => setHover(p.id)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(p.id)}
                    onBlur={() => setHover(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pick(p.id);
                      }
                    }}
                  >
                    <g className={styles.pop}>
                      {p.status === "live" && (
                        <>
                          <circle
                            r={p.r * 3}
                            fill="url(#pm-glow)"
                            className={styles.halo}
                          />
                          <circle r={p.r + 6} className={styles.air} />
                        </>
                      )}
                      <circle r={p.r} className={styles.body} />
                      {p.status === "building" && (
                        <circle r={p.r + 5} className={styles.spin} />
                      )}
                      {p.award && (
                        <text
                          className={styles.star}
                          y={-p.r - 8}
                          textAnchor="middle"
                        >
                          ★
                        </text>
                      )}
                      <text
                        className={styles.label}
                        y={p.r + 16}
                        textAnchor="middle"
                      >
                        {p.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        <p className={styles.hint} aria-hidden="true">
          drag anything · scroll or pinch to zoom · click a project
          <button type="button" onClick={fit}>
            reset view
          </button>
        </p>
      </div>

      {list && (
        <div className={styles.list}>
          {order.map((s) => {
            const items = placed.filter((p) => p.status === s && matches(p));
            if (!items.length) return null;
            return (
              <section key={s} aria-labelledby={`list-${s}`}>
                <h2 id={`list-${s}`}>
                  <i data-status={s} aria-hidden="true" />
                  {statuses[s].label} <small>{statuses[s].note}</small>
                </h2>
                <ul>
                  {items.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setList(false);
                          pick(p.id);
                        }}
                      >
                        <b>{p.name}</b>
                        <span>{p.blurb ?? "no description yet"}</span>
                        <small>
                          {groups[p.group]} · since{" "}
                          {monthName(p.t, t0).toLowerCase()}
                          {p.users ? ` · ${p.users}` : ""}
                        </small>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <footer className={styles.bottom}>
        <div className={styles.legend} role="group" aria-label="Show statuses">
          {counts
            .filter(([, n]) => n)
            .map(([s, n]) => (
              <button
                key={s}
                type="button"
                aria-pressed={!off.has(s)}
                title={statuses[s].note}
                onClick={() => {
                  const next = new Set(off);
                  if (next.has(s)) next.delete(s);
                  else next.add(s);
                  setOff(next);
                }}
              >
                <i data-status={s} aria-hidden="true" />
                {statuses[s].label} <small>{n}</small>
              </button>
            ))}
        </div>
        <div className={styles.time}>
          <button
            type="button"
            className={styles.play}
            onClick={() => setPlaying(!playing)}
            aria-label={
              playing ? "Pause the replay" : "Replay how the map filled in"
            }
          >
            {playing ? "❚❚" : "▶"}
          </button>
          <input
            type="range"
            min={-1}
            max={span}
            value={cutoff}
            aria-label="Show projects started up to"
            aria-valuetext={year}
            onChange={(e) => {
              setPlaying(false);
              setCutoff(Number(e.target.value));
            }}
          />
          <output>{cutoff >= span ? "now" : year.toLowerCase()}</output>
        </div>
      </footer>

      <aside
        className={styles.panel}
        data-open={sel ? "" : undefined}
        aria-live="polite"
      >
        {sel && (
          <>
            <button
              type="button"
              className={styles.close}
              onClick={() => setPicked(null)}
              aria-label="Close"
            >
              ×
            </button>
            <span className={styles.pill} data-status={sel.status}>
              <i aria-hidden="true" />
              {statuses[sel.status].label} · {statuses[sel.status].note}
            </span>
            <h2>{sel.name}</h2>
            {sel.award && <p className={styles.award}>★ {sel.award}</p>}
            <p>{sel.blurb ?? "no description yet."}</p>
            <dl>
              <div>
                <dt>started</dt>
                <dd>{monthName(sel.t, t0).toLowerCase()}</dd>
              </div>
              <div>
                <dt>group</dt>
                <dd>{groups[sel.group]}</dd>
              </div>
              {sel.users && (
                <div>
                  <dt>users</dt>
                  <dd>{sel.users}</dd>
                </div>
              )}
              {sel.repo && (
                <div>
                  <dt>stars</dt>
                  <dd>{sel.stars}</dd>
                </div>
              )}
              {sel.language && (
                <div>
                  <dt>mostly</dt>
                  <dd>{sel.language}</dd>
                </div>
              )}
            </dl>
            <div className={styles.links}>
              {sel.url && (
                <a href={sel.url} target="_blank" rel="noreferrer">
                  open it ↗
                </a>
              )}
              {sel.repo && (
                <a href={sel.repo} target="_blank" rel="noreferrer">
                  github ↗
                </a>
              )}
              {sel.post && <Link href={sel.post}>read the post →</Link>}
            </div>
            {(near.get(sel.id)?.size ?? 0) > 0 && (
              <div className={styles.related}>
                <span>related</span>
                <ul>
                  {links
                    .filter((l) => l.source === sel.id || l.target === sel.id)
                    .map((l) => {
                      const other = byId.get(
                        l.source === sel.id ? l.target : l.source,
                      )!;
                      return (
                        <li key={other.id}>
                          <button type="button" onClick={() => pick(other.id)}>
                            <b>{other.name}</b>
                            <span>{l.why}</span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
