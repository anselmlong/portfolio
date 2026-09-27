import "server-only";

export const githubUser = "anselmlong";

export type Day = { date: string; count: number; level: number };
export type Commit = {
  repo: string;
  message: string;
  date: string;
  url: string;
};
export type GithubActivity = {
  days: Day[];
  total: number;
  streak: number;
  best: Day | null;
  commits: Commit[];
};

const hours = (n: number) => ({ next: { revalidate: n * 3600 } });

/**
 * The past year of contributions, read from the public calendar GitHub draws
 * on a profile. No token needed; each cell has a date and level, and its
 * tooltip has the count.
 */
export function parseCalendar(html: string): Day[] {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(
    /for="(contribution-day-component-\d+-\d+)"[^>]*>\s*(No|[\d,]+) contributions?/g,
  ))
    counts.set(m[1]!, m[2] === "No" ? 0 : Number(m[2]!.replace(/,/g, "")));
  const days: Day[] = [];
  for (const m of html.matchAll(/<td\b[^>]*>/g)) {
    const tag = m[0];
    const date = /data-date="([\d-]+)"/.exec(tag)?.[1];
    const id = /id="(contribution-day-component-\d+-\d+)"/.exec(tag)?.[1];
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1] ?? NaN);
    if (!date || !id || Number.isNaN(level)) continue;
    days.push({ date, level, count: counts.get(id) ?? (level ? 1 : 0) });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

/** Longest run of consecutive days with at least one contribution. */
export function longestStreak(days: Day[]) {
  let best = 0,
    run = 0;
  for (const d of days) {
    run = d.count ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

async function calendar() {
  const res = await fetch(
    `https://github.com/users/${githubUser}/contributions`,
    hours(6),
  );
  if (!res.ok) throw new Error(`calendar ${res.status}`);
  return parseCalendar(await res.text());
}

/** Recent public commits across repos, skipping merges and one repo hogging the list. */
async function commits(): Promise<Commit[]> {
  const res = await fetch(
    `https://api.github.com/search/commits?q=author:${githubUser}&sort=author-date&order=desc&per_page=60`,
    {
      ...hours(1),
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    },
  );
  if (!res.ok) throw new Error(`commits ${res.status}`);
  const body = (await res.json()) as {
    items: {
      html_url: string;
      commit: { message: string; author: { date: string } };
      repository: { name: string; private: boolean };
    }[];
  };
  const perRepo = new Map<string, number>();
  const out: Commit[] = [];
  for (const i of body.items) {
    const message = i.commit.message.split("\n")[0]!.trim();
    if (i.repository.private || /^Merge (pull request|branch)/.test(message))
      continue;
    const n = perRepo.get(i.repository.name) ?? 0;
    if (n >= 2) continue;
    perRepo.set(i.repository.name, n + 1);
    out.push({
      repo: i.repository.name,
      message,
      date: i.commit.author.date,
      url: i.html_url,
    });
    if (out.length === 7) break;
  }
  return out;
}

/** Everything the homepage needs; any part that fails is simply left empty. */
export async function getGithubActivity(): Promise<GithubActivity | null> {
  const [cal, log] = await Promise.allSettled([calendar(), commits()]);
  if (cal.status === "rejected") console.warn("[github] calendar", cal.reason);
  if (log.status === "rejected") console.warn("[github] commits", log.reason);
  const days = cal.status === "fulfilled" ? cal.value : [];
  const list = log.status === "fulfilled" ? log.value : [];
  if (!days.length && !list.length) return null;
  return {
    days,
    total: days.reduce((s, d) => s + d.count, 0),
    streak: longestStreak(days),
    best: days.reduce<Day | null>(
      (b, d) => (!b || d.count > b.count ? d : b),
      null,
    ),
    commits: list,
  };
}
