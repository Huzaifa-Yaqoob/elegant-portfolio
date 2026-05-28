import { z } from "astro/zod"

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  date: z.date(),
  order: z.number().optional(),

  tags: z.array(z.string()).default([]),
  category: z.string().optional(),

  readingTime: z.string().optional(),
  coverImage: z.string().optional(),
  coverAlt: z.string().optional(),

  author: z.string().default("Huzaifa"),
  authorUrl: z.string().optional(),

  series: z.string().optional(),
  seriesOrder: z.number().optional(),

  canonical: z.string().optional(),
  ogImage: z.string().optional(),
  keywords: z.string().optional(),
  featured: z.boolean().default(false),

  draft: z.boolean().default(false),

  relatedPosts: z.array(z.string()).optional(),
})

export type BlogConfig = z.infer<typeof blogSchema>

export const blogIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  mainImage: z.string().optional(),
  badge: z.string().optional(),
})

export type BlogIndexConfig = z.infer<typeof blogIndexSchema>
