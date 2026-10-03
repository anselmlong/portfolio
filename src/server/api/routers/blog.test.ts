// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("~/server/auth", () => ({ auth: vi.fn(async () => null) }));
vi.mock("~/server/db", () => ({ db: {} }));
vi.mock("~/server/blog-views", () => ({
  getBlogViewCount: vi.fn(async () => 0),
  getBlogViewCounts: vi.fn(async () => new Map()),
  recordBlogView: vi.fn(async () => 7),
}));
import { recordBlogView } from "~/server/blog-views";
import { getAllBlogSlugs } from "~/lib/blog";
import { createCallerFactory } from "~/server/api/trpc";
import { blogRouter } from "./blog";

const caller = createCallerFactory(blogRouter)({
  db: {} as never,
  session: null,
  headers: new Headers(),
});

describe("blog.recordView", () => {
  it("counts a view for a post that exists", async () => {
    const slug = getAllBlogSlugs()[0]!;
    await expect(caller.recordView({ slug })).resolves.toEqual({
      viewCount: 7,
    });
    expect(recordBlogView).toHaveBeenCalledWith(slug);
  });

  it("ignores slugs with no post behind them", async () => {
    vi.mocked(recordBlogView).mockClear();
    await expect(
      caller.recordView({ slug: "not-a-real-post" }),
    ).resolves.toEqual({ viewCount: null });
    expect(recordBlogView).not.toHaveBeenCalled();
  });
});
