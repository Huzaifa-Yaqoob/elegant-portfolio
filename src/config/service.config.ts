import { z } from "astro:content";

export const serviceSchema = z.object({
  number: z.string(),
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  order: z.number(),
});

export type ServiceCard = z.infer<typeof serviceSchema>;