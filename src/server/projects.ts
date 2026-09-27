import "server-only";
import snapshot from "~/lib/projects-snapshot.json";
import {
  hiddenRepos,
  links,
  projects,
  type Group,
  type Project,
  type Status,
} from "~/lib/projects";
import { githubApi, githubUser } from "./github";

export type RepoMeta = {
  stars: number;
  language: string | null;
  created: string;
  description: string | null;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
};

export type MapNode = {
  id: string;
  name: string;
  status: Status;
  group: Group;
  blurb: string | null;
  started: string;
  stars: number;
  language: string | null;
  users: string | null;
  award: string | null;
  repo: string | null;
  url: string | null;
  post: string | null;
};
export type MapLink = { source: string; target: string; why: string };
export type ProjectMapData = {
  nodes: MapNode[];
  links: MapLink[];
  fresh: boolean;
};

/**
 * Curated projects, filled in with what GitHub knows. A public repo that is
 * neither curated nor hidden still shows up, marked as not sorted yet, rather
 * than given a guessed status.
 */
export function mergeProjects(
  curated: Project[],
  meta: Record<string, RepoMeta>,
  hidden: Set<string>,
  edges: [string, string, string][],
): { nodes: MapNode[]; links: MapLink[] } {
  const used = new Set(curated.map((p) => p.repo).filter(Boolean));
  const nodes: MapNode[] = curated.map((p) => {
    const m = p.repo ? meta[p.repo] : undefined;
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      group: p.group,
      blurb: p.blurb ?? m?.description ?? null,
      started: p.started ?? m?.created.slice(0, 7) ?? "2024-01",
      stars: m?.stars ?? 0,
      language: m?.language ?? null,
      users: p.users ?? null,
      award: p.award ?? null,
      repo: p.repo ? `https://github.com/${githubUser}/${p.repo}` : null,
      url: p.url ?? m?.homepage ?? null,
      post: p.post ?? null,
    };
  });
  for (const [name, m] of Object.entries(meta)) {
    if (used.has(name) || hidden.has(name) || m.fork || m.archived) continue;
    nodes.push({
      id: `repo:${name}`,
      name,
      status: "unsorted",
      group: "unsorted",
      blurb: m.description,
      started: m.created.slice(0, 7),
      stars: m.stars,
      language: m.language,
      users: null,
      award: null,
      repo: `https://github.com/${githubUser}/${name}`,
      url: m.homepage,
      post: null,
    });
  }
  const ids = new Set(nodes.map((n) => n.id));
  return {
    nodes,
    links: edges
      .filter(([a, b]) => ids.has(a) && ids.has(b))
      .map(([source, target, why]) => ({ source, target, why })),
  };
}

async function liveRepos(): Promise<Record<string, RepoMeta>> {
  const res = await githubApi(`/users/${githubUser}/repos?per_page=100`, 6);
  if (!res.ok) throw new Error(`repos ${res.status}`);
  const list = (await res.json()) as {
    name: string;
    stargazers_count: number;
    language: string | null;
    created_at: string;
    description: string | null;
    homepage: string | null;
    fork: boolean;
    archived: boolean;
  }[];
  return Object.fromEntries(
    list.map((r) => [
      r.name,
      {
        stars: r.stargazers_count,
        language: r.language,
        created: r.created_at.slice(0, 10),
        description: r.description,
        homepage: r.homepage === "" ? null : r.homepage,
        fork: r.fork,
        archived: r.archived,
      },
    ]),
  );
}

/** The map's data: GitHub when it answers, the committed snapshot when it doesn't. */
export async function getProjectMap(): Promise<ProjectMapData> {
  let meta = snapshot as Record<string, RepoMeta>,
    fresh = false;
  try {
    meta = await liveRepos();
    fresh = true;
  } catch (failure) {
    console.warn("[projects] using snapshot", failure);
  }
  return { ...mergeProjects(projects, meta, hiddenRepos, links), fresh };
}
