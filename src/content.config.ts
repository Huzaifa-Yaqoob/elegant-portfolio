// src/content.config.ts
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { NavSchema, SiteSchema } from "@/config/site_nav.config"
import { sectionSchema } from "@/config/section.config"
import { serviceSchema } from "@/config/service.config"
import {
  portfolioSchema,
  portfolioIndexSchema,
} from "@/config/portfolio.config.ts"
import { testimonialsSchema } from "@/config/testimonials.config.ts"
import { contactFormSchema } from "@/config/contact-form.config.ts"
import { contactIndexSchema } from "@/config/contact.config.ts"
import { faqSchema } from "@/config/faq.config.ts"

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
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/section" }),
  schema: sectionSchema,
})

// Define the services collection
const services = defineCollection({
  loader: glob({ pattern: ["*.md", "*.mdx"], base: "./src/content/services" }),
  schema: serviceSchema,
})

// Define the portfolio index collection
const portfolioIndex = defineCollection({
  loader: glob({
    pattern: ["**/-index.md", "**/-index.mdx"],
    base: "./src/content/portfolio",
  }),
  schema: portfolioIndexSchema,
})

// Define the portfolio items collection
const portfolio = defineCollection({
  loader: glob({
    pattern: ["*.md", "*.mdx", "!-index.md", "!-index.mdx"],
    base: "./src/content/portfolio",
  }),
  schema: portfolioSchema,
})

const testimonial = defineCollection({
  loader: glob({
    pattern: ["*.md", "*.mdx"],
    base: "./src/content/testimonials",
  }),
  schema: testimonialsSchema,
})

const contactForm = defineCollection({
  loader: glob({ pattern: "contact-form.toml", base: "./src/content/config" }),
  schema: contactFormSchema,
})

const contactIndex = defineCollection({
  loader: glob({
    pattern: ["**/-index.md", "**/-index.mdx"],
    base: "./src/content/contact",
  }),
  schema: contactIndexSchema,
})

const faq = defineCollection({
  loader: glob({ pattern: "faq.toml", base: "./src/content/config" }),
  schema: faqSchema,
})

// 3. Export the collections object
export const collections = {
  nav,
  site,
  section,
  services,
  portfolioIndex,
  portfolio,
  testimonial,
  contactForm,
  contactIndex,
  faq,
}
