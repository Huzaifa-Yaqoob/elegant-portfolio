import { z } from "astro/zod"

export const testimonialsSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  order: z.number().optional(),
  avatar_url: z.string(),
})

export type testimonialConfig = z.infer<typeof testimonialsSchema>
