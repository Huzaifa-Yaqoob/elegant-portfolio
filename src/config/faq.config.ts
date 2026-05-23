import { z } from "astro/zod"

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

export const faqSchema = z.object({
  section: z.object({
    title: z.string(),
    description: z.string().optional(),
    badge: z.string().optional(),
  }),
  items: z.array(faqItemSchema),
})

export type FaqConfig = z.infer<typeof faqSchema>
