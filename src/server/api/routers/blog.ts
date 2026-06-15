import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getBlogViewCount,
  getBlogViewCounts,
  recordBlogView,
} from "~/server/blog-views";
import {
  getAllBlogPosts,
  getBlogPost,
  type BlogPost,
  type BlogPostMetadata,
} from "~/lib/blog";

const blogMetadataSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  excerpt: z.string().min(1),
  author: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).optional().default([]),
  readingTime: z.string().min(1),
  image: z.string().optional(),
  viewCount: z.number().int().nonnegative().nullable().optional(),
});

const blogPostSchema = blogMetadataSchema.extend({
  content: z.string().min(1),
});

const blogSlugInput = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
});

export const blogRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const parsedPosts = blogMetadataSchema.array().parse(getAllBlogPosts());
    const viewCounts = await getBlogViewCounts(
      parsedPosts.map((post) => post.slug),
    );
    const typedPosts: BlogPostMetadata[] = parsedPosts.map((post) => ({
      ...post,
      viewCount: viewCounts.get(post.slug) ?? null,
    }));
    return typedPosts;
  }),

  bySlug: publicProcedure.input(blogSlugInput).query(async ({ input }) => {
    const post = await getBlogPost(input.slug);
    if (!post) {
      return null;
    }

    const parsedPost = blogPostSchema.parse(post);
    const typedPost: BlogPost = {
      ...parsedPost,
      viewCount: await getBlogViewCount(parsedPost.slug),
    };
    return typedPost;
  }),

  recordView: publicProcedure
    .input(blogSlugInput)
    .mutation(async ({ input }) => {
      const viewCount = await recordBlogView(input.slug);
      return {
        viewCount,
      };
    }),
});
