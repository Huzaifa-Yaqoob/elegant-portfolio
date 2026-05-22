import { z } from "astro/zod"

export const NavSchema = z.object({
  header: z.object({
    logo: z.object({
      label: z.string(),
      href: z.string(),
    }),
    links: z.array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    ),
    cta: z.object({
      label: z.string(),
      href: z.string(),
    }),
  }),
  footer: z.object({
    copyright: z.string(),
    tagline: z.string().optional(),
  }),
})

export const SiteSchema = z.object({
  site_name: z.string(),
  description: z.string(),
  personal: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    address: z.string(),
    address_link: z.string(),
  }),
  stats: z.object({
    years_experience: z.number(),
    projects_completed: z.number(),
    total_clients: z.number(),
  }),
  social: z.object({
    github: z.string(),
    twitter: z.string(),
    instagram: z.string(),
    facebook: z.string(),
    discord: z.string(),
    whatsapp: z.string(),
  }),
})
