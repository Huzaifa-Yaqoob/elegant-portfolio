import { z } from "astro/zod"

export const contactIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoLink: z.string(),
  mainImage: z.string(),
})

export type ContactIndexConfig = z.infer<typeof contactIndexSchema>
