import { z } from "astro:content"

export const portfolioSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  order: z.number(),
  url: z.string().optional(),
  mainImage: z.string(),
  images: z.array(z.string()).optional(),
  tools: z.array(z.string()),
})

export type portfolioConfig = z.infer<typeof portfolioSchema>

export const portfolioIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  videoLink: z.string(),
  mainImage: z.string(),
})

export type PortfolioIndexConfig = z.infer<typeof portfolioIndexSchema>
