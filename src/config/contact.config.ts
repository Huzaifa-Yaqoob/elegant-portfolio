import { z } from "astro/zod"

export const contactIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoLink: z.string(),
  mainImage: z.string(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
})

export type ContactIndexConfig = z.infer<typeof contactIndexSchema>
