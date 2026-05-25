import { z } from "astro/zod"

export const architectPhaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  icon: z.string(),
  order: z.number(),
})

export type ArchitectPhase = z.infer<typeof architectPhaseSchema>

export const architectIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  badge: z.string(),
})

export type ArchitectIndex = z.infer<typeof architectIndexSchema>
