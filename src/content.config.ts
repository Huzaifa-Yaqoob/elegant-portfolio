// src/content.config.ts
import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"
import { NavSchema, SiteSchema } from "@/config/site_nav.config"
import { sectionSchema } from "@/config/section.config" // Import sectionSchema

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
  loader: glob({ pattern: "*.md", base: "./src/content/section" }), // Assuming sections are markdown files in src/content/section
  schema: sectionSchema,
});

// 3. Export the collections object
export const collections = { nav, site, section }
