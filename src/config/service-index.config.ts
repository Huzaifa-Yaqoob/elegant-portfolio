import { z } from "astro/zod"

export const serviceIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoLink: z.string().optional(),
  mainImage: z.string().optional(),
  badge: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
})

export type ServiceIndexConfig = z.infer<typeof serviceIndexSchema>
