import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogPostMetadata } from "~/lib/blog";
import BlogIndex from "./BlogIndex";

vi.mock("next/image", () => ({ default: () => null }));

const post = (slug: string, tags: string[]): BlogPostMetadata => ({
  slug,
  title: slug,
  date: "2026-01-01",
  excerpt: "",
  tags,
  readingTime: "3 min read",
});
// Ten posts share "big"; each also has its own topic, so "solo" falls outside the top nine.
const posts = [
  ...Array.from({ length: 9 }, (_, i) => post(`p${i}`, ["big", `t${i}`, `t${i}-b`])),
  post("odd", ["big", "Solo"]),
];
const index = () => render(<BlogIndex posts={posts} featured={null} />);
const chip = (name: RegExp) => screen.getByRole("button", { name });

beforeEach(() => {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: q.includes("reduce") }));
  vi.stubGlobal("scrollTo", vi.fn());
  Element.prototype.scrollTo = vi.fn();
});
afterEach(() => {
  vi.unstubAllGlobals();
  history.replaceState(null, "", "/");
});

describe("BlogIndex topics", () => {
  it("opens already filtered when the address names a topic, even a small one", () => {
    history.replaceState(null, "", "/blog?topic=solo");
    index();
    expect(chip(/^solo/)).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("1 of 10")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /odd/ })).toBeInTheDocument();
  });

  it("ignores a topic no post has", () => {
    history.replaceState(null, "", "/blog?topic=nope");
    index();
    expect(chip(/^all/)).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("10 of 10")).toBeInTheDocument();
  });

  it("keeps the address in step with the chosen topic", () => {
    history.replaceState(null, "", "/blog");
    index();
    fireEvent.click(chip(/^big/));
    expect(location.search).toBe("?topic=big");
    fireEvent.click(chip(/^all/));
    expect(location.search).toBe("");
  });
});
