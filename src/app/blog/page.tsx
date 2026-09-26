import type { Metadata } from "next";
import { api } from "~/trpc/server";
import BlogIndex from "./_components/BlogIndex";

export const metadata: Metadata = {
  title: "blog",
  description:
    "Writing on machine learning, side projects, and software engineering by Anselm Long.",
  openGraph: {
    title: "blog — anselm long",
    description:
      "Writing on machine learning, side projects, and software engineering by Anselm Long.",
    type: "website",
  },
};

/** The post pinned above the list. */
const featuredSlug = "almost-anselm";

export default async function BlogPage() {
  const posts = await api.blog.list();
  const featured = posts.find((p) => p.slug === featuredSlug) ?? posts[0];

  return <BlogIndex posts={posts} featured={featured ?? null} />;
}
