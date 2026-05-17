// src/content.config.ts
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { NavSchema, SiteSchema } from "@/config/site_nav.config"
import { sectionSchema } from "@/config/section.config"
import { serviceSchema } from "@/config/service.config"
import { portfolioSchema } from "@/config/portfolio.config.ts"
import { testimonialsSchema } from "@/config/testimonials.config.ts"

const nav = defineCollection({
  loader: glob({ pattern: "nav.toml", base: "./src/content/config" }),
  schema: NavSchema,
})

const site = defineCollection({
  loader: glob({ pattern: "site.toml", base: "./src/content/config" }),
  schema: SiteSchema,
})

// Define the sections collection
const section = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/section" }), // Assuming sections are Markdown files in src/content/section
  schema: sectionSchema,
})

// Define the services collection
const services = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/services" }), // Assuming services are Markdown files in src/content/services
  schema: serviceSchema,
})

// Define the portfolio collection
const portfolio = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/portfolio" }), // Corrected loader for portfolio items
  schema: portfolioSchema,
})

const testimonial = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/testimonials" }), // Corrected loader for portfolio items
  schema: testimonialsSchema,
})

// 3. Export the collections object
export const collections = {
  nav,
  site,
  section,
  services,
  portfolio,
  testimonial,
}
