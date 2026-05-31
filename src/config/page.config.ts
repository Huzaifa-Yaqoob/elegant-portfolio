import { z } from "astro/zod"

export const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  lastUpdated: z.date().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
})

export type PageConfig = z.infer<typeof pageSchema>
