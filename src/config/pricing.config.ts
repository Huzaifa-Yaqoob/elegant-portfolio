import { z } from "astro/zod"

const pricingTierSchema = z.object({
  name: z.string(),
  description: z.string(),
  price_range: z.string(),
  features: z.array(z.string()),
  highlighted: z.boolean().default(false),
  icon: z.string().optional(),
})

export const pricingSchema = z.object({
  section: z.object({
    title: z.string(),
    description: z.string().optional(),
    badge: z.string().optional(),
  }),
  items: z.array(pricingTierSchema),
})

export type PricingConfig = z.infer<typeof pricingSchema>
export type PricingTier = z.infer<typeof pricingTierSchema>
