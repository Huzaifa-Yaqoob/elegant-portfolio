// src/content.config.ts
import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"
import { NavSchema, SiteSchema } from "@/config/site_nav.config"

const nav = defineCollection({
  loader: glob({ pattern: "nav.toml", base: "./src/content/config" }),
  schema: NavSchema,
})

const site = defineCollection({
  loader: glob({ pattern: "site.toml", base: "./src/content/config" }),
  schema: SiteSchema,
})

// 3. Export the collections object
export const collections = { nav, site }
