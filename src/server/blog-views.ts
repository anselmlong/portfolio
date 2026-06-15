import "server-only";

const VIEW_KEY_PREFIX = "blog:views:";

function canUseKv() {
  return Boolean(
    (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL) &&
      (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN),
  );
}

function viewKey(slug: string) {
  return `${VIEW_KEY_PREFIX}${slug}`;
}

async function getKvClient() {
  if (!canUseKv()) {
    return null;
  }

  const { kv } = await import("@vercel/kv");
  return kv;
}

function normalizeCount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string") {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : null;
  }

  return null;
}

export async function getBlogViewCount(slug: string) {
  try {
    const kv = await getKvClient();
    if (!kv) {
      return null;
    }

    const value = await kv.get(viewKey(slug));
    return normalizeCount(value) ?? 0;
  } catch {
    return null;
  }
}

export async function getBlogViewCounts(slugs: string[]) {
  const entries = await Promise.all(
    slugs.map(async (slug) => [slug, await getBlogViewCount(slug)] as const),
  );

  return new Map(entries);
}

export async function recordBlogView(slug: string) {
  try {
    const kv = await getKvClient();
    if (!kv) {
      return null;
    }

    const value = await kv.incr(viewKey(slug));
    return normalizeCount(value) ?? null;
  } catch {
    return null;
  }
}
