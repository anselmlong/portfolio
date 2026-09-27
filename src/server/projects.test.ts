import { afterEach, describe, expect, it, vi } from "vitest";
import type { Project } from "~/lib/projects";

vi.mock("server-only", () => ({}));
const { mergeProjects, getProjectMap } = await import("./projects");
const { projects, links } = await import("~/lib/projects");

const meta = (over: Partial<Record<string, unknown>> = {}) => ({
  stars: 3,
  language: "TypeScript",
  created: "2026-07-14",
  description: "from github",
  homepage: null,
  fork: false,
  archived: false,
  ...over,
});

describe("project map data", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fills curated projects from GitHub, preferring curated fields", () => {
    const curated: Project[] = [
      {
        id: "k",
        name: "Kopitype",
        repo: "kopitype",
        status: "live",
        group: "play",
        blurb: "mine",
      },
      {
        id: "a",
        name: "Aegis",
        status: "done",
        group: "work",
        started: "2026-01",
        users: "80 CTF players",
      },
    ];
    const { nodes } = mergeProjects(
      curated,
      { kopitype: meta() },
      new Set(),
      [],
    );
    expect(nodes[0]).toMatchObject({
      blurb: "mine",
      stars: 3,
      language: "TypeScript",
      started: "2026-07",
      repo: "https://github.com/anselmlong/kopitype",
      users: null,
    });
    expect(nodes[1]).toMatchObject({
      stars: 0,
      repo: null,
      started: "2026-01",
      users: "80 CTF players",
    });
  });

  it("shows an uncurated repo as unsorted, and skips hidden repos and forks", () => {
    const { nodes } = mergeProjects(
      [],
      { fresh: meta(), secret: meta(), forked: meta({ fork: true }) },
      new Set(["secret"]),
      [],
    );
    expect(nodes.map((n) => [n.name, n.status])).toEqual([
      ["fresh", "unsorted"],
    ]);
  });

  it("drops edges to projects that aren't on the map", () => {
    const curated: Project[] = [
      { id: "a", name: "A", status: "live", group: "web" },
    ];
    expect(
      mergeProjects(curated, {}, new Set(), [["a", "gone", "x"]]).links,
    ).toEqual([]);
  });

  it("every curated edge points at a curated project", () => {
    const ids = new Set(projects.map((p) => p.id));
    for (const [a, b] of links)
      expect([ids.has(a), ids.has(b), a, b]).toEqual([true, true, a, b]);
  });

  it("falls back to the snapshot when GitHub fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("rate limited", { status: 403 })),
    );
    const data = await getProjectMap();
    expect(data.fresh).toBe(false);
    expect(data.nodes.find((n) => n.id === "kopitype")?.language).toBe(
      "TypeScript",
    );
    expect(data.nodes.length).toBeGreaterThan(30);
  });
});
