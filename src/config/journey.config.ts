import { z } from "astro/zod"

export const journeySchema = z.object({
  title: z.string(),
  code: z.string(),
  date: z.string(),
  description: z.string(),
  order: z.number(),
  tags: z.array(z.string()).optional(),
})

export type JourneyConfig = z.infer<typeof journeySchema>

export const journeyIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export type JourneyIndexConfig = z.infer<typeof journeyIndexSchema>
