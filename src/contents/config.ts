import { defineCollection, z } from "astro:content"

const projects = defineCollection({
  type: "content", // 'content' for Markdown/MDX
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    image: z.string(),
    tags: z.array(z.string()),
  }),
})

export const collections = { projects }
