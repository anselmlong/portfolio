import { type MetadataRoute } from "next";
import { getAllBlogPosts } from "~/lib/blog";

const site = "https://anselmlong.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts().map((post) => {
    const date = new Date(post.date);
    return {
      url: `${site}/blog/${post.slug}`,
      ...(Number.isNaN(date.getTime()) ? {} : { lastModified: date }),
    };
  });
  return [
    { url: site },
    { url: `${site}/projects` },
    { url: `${site}/blog` },
    ...posts,
  ];
}
