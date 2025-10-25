import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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
});

const blogPostSchema = blogMetadataSchema.extend({
  content: z.string().min(1),
});

export const blogRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    const parsedPosts = blogMetadataSchema.array().parse(getAllBlogPosts());
    const typedPosts: BlogPostMetadata[] = parsedPosts;
    return typedPosts;
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const post = await getBlogPost(input.slug);
      if (!post) {
        return null;
      }

      const parsedPost = blogPostSchema.parse(post);
      const typedPost: BlogPost = parsedPost;
      return typedPost;
    }),
});
