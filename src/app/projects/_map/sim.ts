// A small force layout for the project map. It is deterministic (no
// randomness), so the server and the browser settle on the same picture and
// the page can be drawn before any script runs.

import type { MapLink, MapNode } from "~/server/projects";
import { groups, type Group, type Status } from "~/lib/projects";

export const W = 1600;
export const H = 1000;

export type Layout = "map" | "status" | "time";
export type Body = MapNode & {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  fx: number | null;
  fy: number | null;
  t: number; // months since the first project, for the timeline
};

const groupOrder = Object.keys(groups) as Group[];
const statusOrder: Status[] = [
  "live",
  "building",
  "done",
  "shelved",
  "unsorted",
];
export const month = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return (y ?? 2024) * 12 + ((m ?? 1) - 1);
};

/** Where each group gathers on the map: spaced around an ellipse. */
export function anchors(used: Group[]) {
  const out = {} as Record<Group, { x: number; y: number }>;
  used.forEach((g, i) => {
    const a = (i / used.length) * Math.PI * 2 - Math.PI / 2;
    out[g] = { x: W / 2 + Math.cos(a) * 630, y: H / 2 + Math.sin(a) * 375 };
  });
  return out;
}

/** Bigger means more people use it: GitHub stars or real user counts, whichever says more. */
export function radius(n: MapNode) {
  const users = Number(
    /[\d,]+/.exec(n.users ?? "")?.[0]?.replace(/,/g, "") ?? 0,
  );
  const reach = Math.max(
    3.2 * Math.log2(1 + n.stars),
    1.4 * Math.log2(1 + users),
  );
  return Math.min(24, 8 + reach + (n.status === "live" ? 3 : 0));
}

export function makeBodies(nodes: MapNode[]): Body[] {
  const used = groupOrder.filter((g) => nodes.some((n) => n.group === g));
  const at = anchors(used);
  const t0 = Math.min(...nodes.map((n) => month(n.started)));
  const seen: Record<string, number> = {};
  return nodes.map((n) => {
    // Golden-angle spiral around the group's anchor.
    const k = (seen[n.group] = (seen[n.group] ?? -1) + 1);
    const a = k * 2.39996,
      d = 26 + 22 * Math.sqrt(k);
    return {
      ...n,
      x: at[n.group].x + Math.cos(a) * d,
      y: at[n.group].y + Math.sin(a) * d,
      vx: 0,
      vy: 0,
      r: radius(n),
      fx: null,
      fy: null,
      t: month(n.started) - t0,
    };
  });
}

export const laneY = (g: Group) =>
  190 + (groupOrder.indexOf(g) / (groupOrder.length - 1)) * 620;
export const statusX = (s: Status) => 230 + statusOrder.indexOf(s) * 290;

/**
 * In the status layout each column is a small grid, filled in group order, so
 * a busy column (most things are live) doesn't pile up.
 */
function slots(bodies: Body[]) {
  const out = new Map<string, { x: number; y: number }>();
  for (const s of statusOrder) {
    const col = bodies
      .filter((b) => b.status === s)
      .sort(
        (a, b) =>
          groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) ||
          a.name.localeCompare(b.name),
      );
    const cols = Math.max(1, Math.ceil(col.length / 7));
    const rows = Math.ceil(col.length / cols);
    col.forEach((b, i) => {
      const c = i % cols,
        r = Math.floor(i / cols);
      out.set(b.id, {
        x: statusX(s) + (c - (cols - 1) / 2) * 120,
        y: 190 + (rows > 1 ? r / (rows - 1) : 0.5) * 620,
      });
    });
  }
  return out;
}

/** Where a body wants to be in each layout. Null means "near its group". */
export function target(
  b: Body,
  layout: Layout,
  span: number,
  grid?: Map<string, { x: number; y: number }>,
) {
  if (layout === "status") {
    const at = grid?.get(b.id) ?? { x: statusX(b.status), y: laneY(b.group) };
    return { ...at, kx: 0.16, ky: 0.16 };
  }
  if (layout === "time")
    return {
      x: 150 + (b.t / Math.max(1, span)) * (W - 300),
      y: laneY(b.group),
      kx: 0.2,
      ky: 0.08,
    };
  return null;
}

export function step(
  bodies: Body[],
  links: MapLink[],
  layout: Layout,
  alpha: number,
) {
  const byId = new Map(bodies.map((b) => [b.id, b]));
  const used = groupOrder.filter((g) => bodies.some((b) => b.group === g));
  const at = anchors(used);
  const span = Math.max(...bodies.map((b) => b.t));
  const n = bodies.length;
  const grid = layout === "status" ? slots(bodies) : undefined;

  // Everything pushes everything else away, and nothing overlaps.
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const a = bodies[i]!,
        b = bodies[j]!;
      let dx = b.x - a.x,
        dy = b.y - a.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 0.01) {
        dx = (i - j) * 0.1;
        dy = 0.1;
        d2 = dx * dx + dy * dy;
      }
      const d = Math.sqrt(d2);
      const push = (layout === "map" ? 2600 : 500) / d2;
      const min = a.r + b.r + (layout === "status" ? 14 : 26);
      const overlap = d < min ? (min - d) * 0.5 : 0;
      const f = (push + overlap) * alpha;
      const ux = dx / d,
        uy = dy / d;
      a.vx -= ux * f;
      a.vy -= uy * f;
      b.vx += ux * f;
      b.vy += uy * f;
    }

  // Related projects pull together (gently, outside the map layout).
  const pull = layout === "map" ? 0.025 : 0.006;
  for (const l of links) {
    const a = byId.get(l.source),
      b = byId.get(l.target);
    if (!a || !b) continue;
    const dx = b.x - a.x,
      dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = (d - 120) * pull * alpha;
    a.vx += (dx / d) * f;
    a.vy += (dy / d) * f;
    b.vx -= (dx / d) * f;
    b.vy -= (dy / d) * f;
  }

  for (const b of bodies) {
    const t = target(b, layout, span, grid);
    if (t) {
      b.vx += (t.x - b.x) * t.kx * alpha;
      b.vy += (t.y - b.y) * t.ky * alpha;
    } else {
      const g = at[b.group];
      b.vx += (g.x - b.x) * 0.06 * alpha;
      b.vy += (g.y - b.y) * 0.06 * alpha;
    }
    if (b.fx !== null && b.fy !== null) {
      b.x = b.fx;
      b.y = b.fy;
      b.vx = b.vy = 0;
      continue;
    }
    b.vx *= 0.6;
    b.vy *= 0.6;
    b.x = Math.max(40, Math.min(W - 40, b.x + b.vx));
    b.y = Math.max(60, Math.min(H - 60, b.y + b.vy));
  }
}

/** Runs the layout to rest without drawing: for the first paint and for reduced motion. */
export function settle(
  bodies: Body[],
  links: MapLink[],
  layout: Layout,
  ticks = 320,
) {
  for (let i = 0; i < ticks; i++)
    step(bodies, links, layout, Math.max(0.05, 1 - i / ticks));
  return bodies;
}
